import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { socialApi } from "@/integrations/api/social";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { Loader2, Lock, Globe2, UserPlus, UserX, User, Grid, Circle, Tag } from "lucide-react";
import { Post } from "@/components/fitgram/PostCard";

export default function FitGramProfile() {
  const { id } = useParams();
  const { user } = useAuth();
  const [profile, setProfile] = useState<any>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [followPending, setFollowPending] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);
  const [isRequested, setIsRequested] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const loadProfile = async () => {
    if (!id) return;
    setLoading(true);
    setErrorMsg(null);
    try {
      const [{ data: uRes }, { data: pRes }, { data: fRes }] = await Promise.all([
        socialApi.profile.get(id),
        socialApi.posts.byUser(id),
        socialApi.follow.list(id),
      ]);
      if (uRes?.ok) setProfile(uRes.data);
      else setErrorMsg(uRes?.message || "Profile not found");
      if (pRes?.ok) setPosts(pRes.data || []);
      if (fRes?.ok) {
        const followers = fRes.data.followers || [];
        const requests = fRes.data.requests || [];
        setIsFollowing(!!followers.find((f: any) => f.followerId?._id === user?._id));
        setIsRequested(!!requests.find((r: any) => r.followerId?._id === user?._id));
      }
    } catch (err: any) {
      setErrorMsg(err?.response?.data?.message || err?.message || "Profile not found");
    } finally {
      setLoading(false);
    }
  };

  const handleFollowAction = async () => {
    if (!id || !user?._id) return;
    if (isFollowing) {
      setFollowPending(true);
      await socialApi.follow.unfollow(id);
      setIsFollowing(false);
      setIsRequested(false);
      setFollowPending(false);
      return;
    }
    if (isRequested) {
      // do nothing until accepted; allow unfollow to cancel
      return;
    }
    setFollowPending(true);
    const { data } = await socialApi.follow.request(id);
    if (data?.ok) {
      if (data.data?.status === "accepted") {
        setIsFollowing(true);
      } else {
        setIsRequested(true);
      }
    }
    setFollowPending(false);
  };

  useEffect(() => {
    loadProfile();
  }, [id]);

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin" />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="p-6">
        <Card>
          <CardContent className="py-10 text-center text-muted-foreground">
            {errorMsg || "Profile not found."}
          </CardContent>
        </Card>
      </div>
    );
  }

  const showPosts = !profile.isPrivate || profile._id === user?._id || isFollowing;

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="max-w-5xl mx-auto px-4 py-6 space-y-6">
        <div className="flex flex-col md:flex-row md:items-center gap-6">
          <Avatar className="h-28 w-28">
            <AvatarImage src={profile.avatarUrl || ""} alt={profile.name} />
            <AvatarFallback>{profile.name?.charAt(0) || "U"}</AvatarFallback>
          </Avatar>
          <div className="flex-1 space-y-3">
            <div className="flex flex-col md:flex-row md:items-center md:gap-4 gap-2">
              <div className="text-xl font-semibold">{profile.username || profile.name || "User"}</div>
              {profile._id !== user?._id && (
                <Button onClick={handleFollowAction} disabled={followPending} variant={isFollowing ? "secondary" : "default"}>
                  {followPending ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : isFollowing ? (
                    <>
                      <UserX className="h-4 w-4 mr-1" /> Following
                    </>
                  ) : isRequested ? (
                    <>
                      <User className="h-4 w-4 mr-1" /> Requested
                    </>
                  ) : (
                    <>
                      <UserPlus className="h-4 w-4 mr-1" /> Follow
                    </>
                  )}
                </Button>
              )}
            </div>
            <div className="flex items-center gap-6 text-sm">
              <div className="flex items-center gap-1">
                <span className="font-semibold">{posts.length}</span>
                <span className="text-muted-foreground">posts</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="font-semibold">{profile.followerCount || 0}</span>
                <span className="text-muted-foreground">followers</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="font-semibold">{profile.followingCount || 0}</span>
                <span className="text-muted-foreground">following</span>
              </div>
            </div>
            <div className="text-sm space-y-1">
              <div className="font-semibold">{profile.name}</div>
              <div>{profile.bio || "Bio goes here"}</div>
              <div className="flex items-center gap-1 text-muted-foreground text-xs">
                {profile.isPrivate ? <Lock className="h-3 w-3" /> : <Globe2 className="h-3 w-3" />}
                {profile.isPrivate ? "Private account" : "Public account"}
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-center gap-8 text-muted-foreground text-sm border-t border-b py-3">
          <button className="flex items-center gap-2 text-foreground">
            <Grid className="h-4 w-4" /> POSTS
          </button>
          <button className="flex items-center gap-2">
            <Circle className="h-4 w-4" /> REELS
          </button>
          <button className="flex items-center gap-2">
            <Tag className="h-4 w-4" /> TAGGED
          </button>
        </div>

          {showPosts ? (
            posts.length === 0 ? (
              <div className="text-center text-muted-foreground py-8">No posts yet.</div>
            ) : (
              <div className="grid grid-cols-3 gap-2 md:gap-3">
                {posts.map((p) => {
                  const thumb = p.media?.[0]?.url;
                  const type = p.media?.[0]?.type;
                  return (
                    <div
                      key={p._id}
                      className="relative group aspect-square overflow-hidden rounded-md bg-muted/40 cursor-pointer"
                      onClick={() => window.location.href = `/fitgram/post/${p._id}`}
                    >
                      {thumb ? (
                        type === "video" ? (
                          <video src={thumb} className="h-full w-full object-cover" muted />
                        ) : (
                          <img src={thumb} className="h-full w-full object-cover" alt="post media" />
                        )
                      ) : (
                        <div className="h-full w-full flex items-center justify-center text-xs text-muted-foreground">No media</div>
                      )}
                    </div>
                  );
                })}
              </div>
            )
          ) : (
            <div className="text-center text-muted-foreground py-12 flex flex-col items-center gap-2">
              <Lock className="h-5 w-5" />
              This account is private. Follow to see posts.
            </div>
          )}
      </div>
    </div>
  );
}


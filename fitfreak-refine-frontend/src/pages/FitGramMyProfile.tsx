import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { socialApi } from "@/integrations/api/social";
import { useAuth } from "@/hooks/useAuth";
import { Loader2, Globe2, Lock, Hash } from "lucide-react";
import { useNavigate } from "react-router-dom";

type Profile = {
  _id: string;
  name?: string;
  username?: string;
  bio?: string;
  avatarUrl?: string;
  isPrivate?: boolean;
  followerCount?: number;
  followingCount?: number;
};

export default function FitGramMyProfile() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    if (!user?._id) return;
    setLoading(true);
    try {
      const [{ data: pRes }, { data: postsRes }] = await Promise.all([
        socialApi.profile.get(user._id),
        socialApi.posts.byUser(user._id),
      ]);
      if (pRes?.ok) setProfile(pRes.data);
      if (postsRes?.ok) setPosts(postsRes.data || []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [user?._id]);

  if (!user?._id) {
    return (
      <div className="p-6">
        <Card>
          <CardContent className="py-10 text-center text-muted-foreground">
            Please sign in to view your profile.
          </CardContent>
        </Card>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin" />
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 space-y-6">
      {profile && (
        <Card>
          <CardHeader className="flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <Avatar className="h-24 w-24">
                <AvatarImage src={profile.avatarUrl || ""} alt={profile.name} />
                <AvatarFallback>{profile.name?.charAt(0) || "U"}</AvatarFallback>
              </Avatar>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <CardTitle className="text-xl">{profile.username || profile.name || "User"}</CardTitle>
                  <Badge variant="outline" className="flex items-center gap-1">
                    {profile.isPrivate ? <Lock className="h-3 w-3" /> : <Globe2 className="h-3 w-3" />}
                    {profile.isPrivate ? "Private" : "Public"}
                  </Badge>
                </div>
                <CardDescription>{profile.bio || "Add a bio from your Profile page."}</CardDescription>
                <div className="flex items-center gap-6 text-sm">
                  <div className="flex flex-col items-center">
                    <span className="font-semibold">{posts.length}</span>
                    <span className="text-muted-foreground">Posts</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <span className="font-semibold">{profile.followerCount || 0}</span>
                    <span className="text-muted-foreground">Followers</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <span className="font-semibold">{profile.followingCount || 0}</span>
                    <span className="text-muted-foreground">Following</span>
                  </div>
                </div>
              </div>
              <div className="ml-auto">
                <Button variant="outline" onClick={() => navigate("/profile")}>
                  Edit Profile
                </Button>
              </div>
            </div>
          </CardHeader>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Hash className="h-4 w-4" />
            Posts
          </CardTitle>
          <CardDescription>Your posts appear here.</CardDescription>
        </CardHeader>
        <CardContent>
          {posts.length === 0 ? (
            <div className="py-8 text-center text-muted-foreground">
              No posts yet. Create from FitGram → Create tab.
            </div>
          ) : (
            <div className="grid grid-cols-3 gap-2 md:gap-3">
              {posts.map((p) => (
                <button
                  key={p._id}
                  className="aspect-square overflow-hidden rounded-md bg-muted"
                  onClick={() => navigate(`/fitgram/profile/${user._id}`)}
                >
                  {p.media?.[0]?.type === "video" ? (
                    <video className="w-full h-full object-cover">
                      <source src={p.media?.[0]?.url} />
                    </video>
                  ) : (
                    <img
                      src={p.media?.[0]?.url}
                      alt="post"
                      className="w-full h-full object-cover"
                    />
                  )}
                </button>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}


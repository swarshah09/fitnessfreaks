import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Heart, MessageCircle, Bookmark, Globe2, Lock } from "lucide-react";
import { useState } from "react";
import { socialApi } from "@/integrations/api/social";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";

export type Post = {
  _id: string;
  userId: { _id: string; name?: string; username?: string; avatarUrl?: string };
  caption: string;
  hashtags?: string[];
  location?: string;
  visibility: "public" | "followers";
  media: { url: string; type: "image" | "video" }[];
  likes?: string[];
  comments?: { _id: string; userId: string; text: string; createdAt: string }[];
  saves?: string[];
  createdAt: string;
};

export function PostCard({ post, onLike }: { post: Post; onLike?: () => void }) {
  const { user } = useAuth();
  const [pending, setPending] = useState(false);
  const [commentPending, setCommentPending] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [localComments, setLocalComments] = useState(post.comments || []);
  const [saved, setSaved] = useState(!!post.saves?.find((id) => id === user?._id));
  const liked = !!post.likes?.find((id) => id === user?._id);
  const navigate = useNavigate();
  const [commentsOpen, setCommentsOpen] = useState(false);
  const [commentsLoading, setCommentsLoading] = useState(false);

  const handleLike = async () => {
    if (pending) return;
    setPending(true);
    try {
      await socialApi.posts.like(post._id);
      onLike?.();
    } finally {
      setPending(false);
    }
  };

  const openComments = async () => {
    setCommentsOpen(true);
    setCommentsLoading(true);
    try {
      const { data } = await socialApi.posts.detail(post._id);
      if (data?.ok && data?.data?.comments) {
        setLocalComments(data.data.comments);
      }
    } finally {
      setCommentsLoading(false);
    }
  };

  const handleSave = async () => {
    if (pending) return;
    setPending(true);
    try {
      await socialApi.posts.save(post._id);
      setSaved((s) => !s);
    } finally {
      setPending(false);
    }
  };

  const handleComment = async () => {
    if (!commentText.trim() || commentPending) return;
    setCommentPending(true);
    try {
      const { data } = await socialApi.posts.comment(post._id, commentText.trim());
      if (data?.ok) {
        setLocalComments([
          ...localComments,
          { _id: `${Date.now()}`, userId: user?._id || "", text: commentText.trim(), createdAt: new Date().toISOString() },
        ]);
        setCommentText("");
      } else {
        alert(data?.message || "Failed to comment");
      }
    } catch (err: any) {
      alert(err?.response?.data?.message || err?.message || "Failed to comment");
    } finally {
      setCommentPending(false);
    }
  };

  return (
    <Card className="overflow-hidden border-border/60 bg-card/70">
      <CardHeader className="flex flex-row items-center gap-3 p-3 pb-2">
        <button
          className="flex items-center gap-3 text-left"
          onClick={() => navigate(`/fitgram/profile/${post.userId?._id || ""}`)}
        >
          <Avatar className="h-10 w-10">
            <AvatarImage src={post.userId?.avatarUrl || ""} alt={post.userId?.name} />
            <AvatarFallback>{post.userId?.name?.charAt(0) || "U"}</AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <CardTitle className="text-sm">
              {post.userId?.username || post.userId?.name || "User"}
            </CardTitle>
            <div className="text-xs text-muted-foreground">
              {post.visibility === "public" ? (
                <Globe2 className="h-3 w-3 inline mr-1" />
              ) : (
                <Lock className="h-3 w-3 inline mr-1" />
              )}
              {new Date(post.createdAt).toLocaleString()}
            </div>
          </div>
        </button>
      </CardHeader>
      <CardContent className="space-y-3 p-3 pt-0">
        {post.media?.length > 0 && (
          <div className="space-y-2 relative">
            <Carousel media={post.media} />
          </div>
        )}
        {post.caption && (
          <p className="text-sm leading-relaxed line-clamp-3">
            {post.caption}
            {post.hashtags?.length ? (
              <span className="ml-2 text-primary">
                {post.hashtags.map((h) => `#${h}`).join(" ")}
              </span>
            ) : null}
          </p>
        )}
        <div className="flex items-center gap-3">
          <Button
            variant={liked ? "secondary" : "outline"}
            size="sm"
            onClick={handleLike}
            disabled={pending}
          >
            <Heart className="h-4 w-4 mr-1" />
            {post.likes?.length || 0}
          </Button>
          <Button variant="outline" size="sm" onClick={openComments}>
            <MessageCircle className="h-4 w-4 mr-1" />
            {localComments?.length || 0}
          </Button>
          <Button variant={saved ? "secondary" : "outline"} size="sm" onClick={handleSave} disabled={pending}>
            <Bookmark className="h-4 w-4 mr-1" />
            {saved ? "Saved" : "Save"}
          </Button>
        </div>
        <div className="space-y-2">
          <Textarea
            rows={2}
            placeholder="Add a comment..."
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
          />
          <div className="flex items-center gap-2">
            <Button size="sm" onClick={handleComment} disabled={commentPending || !commentText.trim()}>
              {commentPending ? <Loader2 className="h-4 w-4 mr-1 animate-spin" /> : null}
              Post
            </Button>
            <span className="text-xs text-muted-foreground">{localComments.length} comments</span>
          </div>
          {localComments.slice(-3).map((c) => (
            <div key={c._id} className="text-sm text-muted-foreground">
              <span className="font-medium mr-1">{c.userId === user?._id ? "You" : "User"}</span>
              {c.text}
            </div>
          ))}
        </div>
      </CardContent>

      <Dialog open={commentsOpen} onOpenChange={setCommentsOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Comments</DialogTitle>
            <DialogDescription>Join the conversation</DialogDescription>
          </DialogHeader>
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Textarea
                rows={2}
                placeholder="Add a comment..."
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
              />
              <Button onClick={handleComment} disabled={commentPending || !commentText.trim()}>
                {commentPending ? <Loader2 className="h-4 w-4 animate-spin" /> : "Post"}
              </Button>
            </div>
            <Separator />
            {commentsLoading ? (
              <div className="flex items-center justify-center py-4 text-muted-foreground">
                <Loader2 className="h-4 w-4 animate-spin" />
              </div>
            ) : localComments.length === 0 ? (
              <div className="text-sm text-muted-foreground">No comments yet.</div>
            ) : (
              <div className="space-y-2 max-h-64 overflow-auto">
                {localComments.map((c) => (
                  <div key={c._id} className="text-sm leading-relaxed">
                    <span className="font-semibold mr-2">
                      {c.userId === user?._id ? "You" : "User"}
                    </span>
                    <span className="text-muted-foreground">{c.text}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </Card>
  );
}

function Carousel({ media }: { media: { url: string; type: "image" | "video" }[] }) {
  const [index, setIndex] = useState(0);
  const hasMultiple = media.length > 1;
  const prev = () => setIndex((i) => (i === 0 ? media.length - 1 : i - 1));
  const next = () => setIndex((i) => (i === media.length - 1 ? 0 : i + 1));

  return (
    <div className="relative group">
      {media[index].type === "image" ? (
        <img src={media[index].url} alt="post media" className="w-full rounded-lg object-cover" />
      ) : (
        <video controls className="w-full rounded-lg">
          <source src={media[index].url} />
        </video>
      )}
      {hasMultiple && (
        <>
          <button
            className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/40 text-white rounded-full px-2 py-1 opacity-0 group-hover:opacity-100 transition"
            onClick={prev}
            aria-label="Previous"
          >
            ‹
          </button>
          <button
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/40 text-white rounded-full px-2 py-1 opacity-0 group-hover:opacity-100 transition"
            onClick={next}
            aria-label="Next"
          >
            ›
          </button>
          <div className="absolute bottom-2 w-full flex items-center justify-center gap-1">
            {media.map((_, i) => (
              <span
                key={i}
                className={cn(
                  "h-1.5 w-1.5 rounded-full bg-white/60",
                  i === index && "bg-white"
                )}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}


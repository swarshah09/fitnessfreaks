import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
import { socialApi, SocialMedia } from "@/integrations/api/social";
import { toast } from "@/hooks/use-toast";
import { Loader2, UploadCloud } from "lucide-react";
import { api } from "@/integrations/api/client";

export function CreatePostForm({ onCreated }: { onCreated: () => void }) {
  const [caption, setCaption] = useState("");
  const [hashtags, setHashtags] = useState("");
  const [visibility, setVisibility] = useState<"public" | "followers">("public");
  const [files, setFiles] = useState<File[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  const uploadMedia = async (): Promise<SocialMedia[]> => {
    const uploaded: SocialMedia[] = [];
    for (const file of files) {
      const formData = new FormData();
      formData.append("myimage", file);
      const { data } = await api.post("/image-upload/uploadimage", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      if (data?.ok && data?.imageUrl) {
        const type = file.type.startsWith("video") ? "video" : "image";
        uploaded.push({ url: data.imageUrl, type });
      } else {
        throw new Error(data?.error || "Upload failed");
      }
    }
    return uploaded;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!files.length) {
      toast({ title: "Add media", description: "Please add at least one photo/video", variant: "destructive" });
      return;
    }
    try {
      setIsUploading(true);
      const media = await uploadMedia();
      const tagList = hashtags
        .split(/[,\s]+/)
        .map((h) => h.replace('#', '').trim())
        .filter(Boolean);
      await socialApi.posts.create({ caption, hashtags: tagList, visibility, media });
      toast({ title: "Posted", description: "Your post is live" });
      setCaption("");
      setHashtags("");
      setFiles([]);
      onCreated();
    } catch (error: any) {
      toast({ title: "Post failed", description: error?.message || "Try again", variant: "destructive" });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Create a Post</CardTitle>
        <CardDescription>Share photos, videos, or quotes with your followers.</CardDescription>
      </CardHeader>
      <CardContent>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <Label>Caption</Label>
            <Textarea
              placeholder="Share your workout, meal, or thoughts..."
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              rows={3}
            />
          </div>
          <div className="space-y-2">
            <Label>Hashtags</Label>
            <Input
              placeholder="#fitness #workout"
              value={hashtags}
              onChange={(e) => setHashtags(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label>Visibility</Label>
            <Select value={visibility} onValueChange={(v: "public" | "followers") => setVisibility(v)}>
              <SelectTrigger>
                <SelectValue placeholder="Visibility" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="public">Public</SelectItem>
                <SelectItem value="followers">Followers only</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Media (images/videos)</Label>
            <Input
              type="file"
              accept="image/*,video/*"
              multiple
              onChange={(e) => setFiles(Array.from(e.target.files || []))}
            />
            {files.length > 0 && (
              <div className="text-xs text-muted-foreground">
                {files.length} file(s) selected
              </div>
            )}
          </div>
          <Button type="submit" disabled={isUploading}>
            {isUploading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Posting...
              </>
            ) : (
              <>
                <UploadCloud className="h-4 w-4 mr-2" />
                Post
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}


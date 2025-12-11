import { useState } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { socialApi } from "@/integrations/api/social";
import { api } from "@/integrations/api/client";
import { toast } from "@/hooks/use-toast";
import { Loader2, UploadCloud } from "lucide-react";

export function CreateStory({ onCreated }: { onCreated: () => void }) {
  const [file, setFile] = useState<File | null>(null);
  const [caption, setCaption] = useState("");
  const [isUploading, setIsUploading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      toast({ title: "Add media", description: "Select an image or video", variant: "destructive" });
      return;
    }
    try {
      setIsUploading(true);
      const formData = new FormData();
      formData.append("myimage", file);
      const { data } = await api.post("/image-upload/uploadimage", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      if (!data?.ok || !data?.imageUrl) throw new Error("Upload failed");
      const type = file.type.startsWith("video") ? "video" : "image";
      await socialApi.stories.create({ url: data.imageUrl, type, caption });
      toast({ title: "Story added", description: "Live for 24h." });
      setFile(null);
      setCaption("");
      onCreated();
    } catch (err: any) {
      toast({ title: "Failed", description: err?.message || "Could not add story", variant: "destructive" });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Create Story</CardTitle>
        <CardDescription>Share a 24h story (image/video)</CardDescription>
      </CardHeader>
      <CardContent>
        <form className="space-y-3" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <Label>Media</Label>
            <Input type="file" accept="image/*,video/*" onChange={(e) => setFile(e.target.files?.[0] || null)} />
          </div>
          <div className="space-y-2">
            <Label>Caption (optional)</Label>
            <Input value={caption} onChange={(e) => setCaption(e.target.value)} />
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
                Post Story
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}


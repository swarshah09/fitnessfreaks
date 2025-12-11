import { useEffect, useState, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { api } from "@/integrations/api/client";
import { Loader2, UploadCloud, User } from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";

export default function Profile() {
  const { user, updateProfile } = useAuth();
  const [name, setName] = useState(user?.name || "");
  const [username, setUsername] = useState(user?.username || "");
  const [bio, setBio] = useState(user?.bio || "");
  const [isPrivate, setIsPrivate] = useState<boolean>(!!user?.isPrivate);
  const [avatarUrl, setAvatarUrl] = useState<string>(user?.avatarUrl || "");
  const [selectedImage, setSelectedImage] = useState<string>("");
  const [zoom, setZoom] = useState<number>(1);
  const [isUploading, setIsUploading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (user) {
      setName(user.name || "");
      setUsername(user.username || "");
      setBio(user.bio || "");
      setIsPrivate(!!user.isPrivate);
      setAvatarUrl(user.avatarUrl || "");
    }
  }, [user]);

  useEffect(() => {
    if (!selectedImage || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const img = new Image();
    img.onload = () => {
      const size = Math.min(img.width, img.height) / zoom;
      const sx = (img.width - size) / 2;
      const sy = (img.height - size) / 2;
      canvas.width = 320;
      canvas.height = 320;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, sx, sy, size, size, 0, 0, canvas.width, canvas.height);
    };
    img.src = selectedImage;
  }, [selectedImage, zoom]);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setSelectedImage(reader.result as string);
    reader.readAsDataURL(file);
  };

  const uploadCropped = async () => {
    if (!selectedImage || !canvasRef.current) {
      toast({ title: "Select an image", description: "Choose and crop a photo first", variant: "destructive" });
      return;
    }
    const blob: Blob | null = await new Promise((resolve) =>
      canvasRef.current!.toBlob((b) => resolve(b), "image/jpeg", 0.9)
    );
    if (!blob) {
      toast({ title: "Crop failed", description: "Could not process image", variant: "destructive" });
      return;
    }

    const formData = new FormData();
    formData.append("myimage", blob, "avatar.jpg");

    try {
      setIsUploading(true);
      const { data } = await api.post("/image-upload/uploadimage", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      if (data?.ok && data?.imageUrl) {
        setAvatarUrl(data.imageUrl);
        toast({ title: "Uploaded", description: "Profile photo updated." });
      } else {
        throw new Error(data?.error || "Upload failed");
      }
    } catch (error: any) {
      toast({
        title: "Upload failed",
        description: error?.message || "Could not upload image",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);
      const { error } = await updateProfile({ name, username, bio, isPrivate, avatarUrl });
      if (error) {
        toast({ title: "Update failed", description: error.message, variant: "destructive" });
      } else {
        toast({ title: "Profile updated", description: "Your changes are saved." });
      }
    } catch (error: any) {
      toast({ title: "Update failed", description: error?.message || "Try again", variant: "destructive" });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="p-4 md:p-6 space-y-6">
      <div className="flex items-center gap-3">
        <div className="rounded-lg bg-primary/10 p-3">
          <User className="h-6 w-6 text-primary" />
        </div>
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">Your Profile</h1>
          <p className="text-muted-foreground">
            Update your name and profile photo. Your avatar will appear in the navbar.
          </p>
        </div>
      </div>

      <Card className="max-w-3xl">
        <CardHeader>
          <CardTitle>Profile Details</CardTitle>
          <CardDescription>Keep your info up to date</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
            <Avatar className="h-16 w-16">
              <AvatarImage src={avatarUrl || ""} alt={user?.email} />
              <AvatarFallback className="bg-primary text-primary-foreground text-lg">
                {user?.email?.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="space-y-2 w-full">
              <Label className="text-sm font-medium">Profile Photo</Label>
              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-2">
                  <Input type="file" accept="image/*" onChange={handleUpload} />
                  <Button variant="outline" onClick={uploadCropped} disabled={isUploading}>
                    {isUploading ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Uploading...
                      </>
                    ) : (
                      <>
                        <UploadCloud className="h-4 w-4 mr-2" />
                        Upload
                      </>
                    )}
                  </Button>
                </div>
                {selectedImage && (
                  <div className="space-y-3">
                    <div className="space-y-2">
                      <Label>Adjust zoom</Label>
                      <Slider
                        value={[zoom]}
                        min={1}
                        max={3}
                        step={0.1}
                        onValueChange={(v) => setZoom(v[0])}
                      />
                    </div>
                    <div className="border rounded-lg p-2 bg-muted/50 max-w-[360px]">
                      <canvas ref={canvasRef} className="rounded-md w-full h-full" />
                    </div>
                  </div>
                )}
                {isUploading && !selectedImage && (
                  <div className="text-xs text-muted-foreground flex items-center gap-1">
                    <Loader2 className="h-4 w-4 animate-spin" /> Uploading...
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your name"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="username">Username</Label>
            <Input
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="username"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="bio">Bio</Label>
            <Input
              id="bio"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Share something about you"
            />
          </div>
          <div className="flex items-center gap-3">
            <Switch checked={isPrivate} onCheckedChange={setIsPrivate} id="private" />
            <Label htmlFor="private">Private account</Label>
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" value={user?.email || ""} disabled />
          </div>

          <div className="flex gap-2">
            <Button onClick={handleSave} disabled={isSaving || isUploading}>
              {isSaving ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                "Save Changes"
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}


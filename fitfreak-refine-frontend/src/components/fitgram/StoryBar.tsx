import { useEffect, useState } from "react";
import { socialApi } from "@/integrations/api/social";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { Dialog, DialogContent } from "@/components/ui/dialog";

type Story = {
  _id: string;
  userId: { _id: string; name?: string; username?: string; avatarUrl?: string };
  media: { url: string; type: "image" | "video" };
  caption?: string;
  createdAt: string;
};

export function StoryBar() {
  const [stories, setStories] = useState<Story[]>([]);
  const [active, setActive] = useState<Story | null>(null);

  const load = async () => {
    const { data } = await socialApi.stories.feed();
    if (data?.ok) setStories(data.data || []);
  };

  useEffect(() => {
    load();
  }, []);

  return (
    <>
      <Card className="p-3 overflow-x-auto">
        <div className="flex items-center gap-3">
          {stories.length === 0 ? (
            <div className="text-sm text-muted-foreground">No stories yet</div>
          ) : (
            stories.map((s) => (
              <button key={s._id} className="flex flex-col items-center gap-1" onClick={() => setActive(s)}>
                <div className="p-[2px] rounded-full bg-gradient-to-tr from-pink-500 via-amber-400 to-purple-500">
                  <Avatar className="h-14 w-14 ring-2 ring-background ring-offset-2 ring-offset-background bg-background">
                  <AvatarImage src={s.userId?.avatarUrl || ""} />
                  <AvatarFallback>{s.userId?.username?.charAt(0) || "U"}</AvatarFallback>
                  </Avatar>
                </div>
                <span className="text-xs text-muted-foreground max-w-[70px] truncate">
                  {s.userId?.username || s.userId?.name || "User"}
                </span>
              </button>
            ))
          )}
        </div>
      </Card>

      <Dialog open={!!active} onOpenChange={(o) => !o && setActive(null)}>
        <DialogContent className="max-w-sm p-0 overflow-hidden">
          {active && (
            <div className="bg-black text-white">
              {active.media.type === "image" ? (
                <img src={active.media.url} alt="story" className="w-full h-full object-cover" />
              ) : (
                <video src={active.media.url} className="w-full h-full" autoPlay controls />
              )}
              <div className="p-3 text-sm">
                <div className="font-semibold">{active.userId?.username || active.userId?.name}</div>
                {active.caption && <div className="text-xs mt-1 text-white/80">{active.caption}</div>}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}


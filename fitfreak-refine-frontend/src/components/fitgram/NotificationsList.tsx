import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { socialApi } from "@/integrations/api/social";
import { useEffect, useState } from "react";
import { Loader2, Heart, MessageCircle, UserPlus, Bell } from "lucide-react";

type Notification = {
  _id: string;
  type: string;
  read: boolean;
  createdAt: string;
  fromUserId?: { name?: string; username?: string; avatarUrl?: string };
  payload?: any;
};

const typeLabel = (type: string) => {
  switch (type) {
    case "follow_request":
      return { label: "Follow request", icon: UserPlus };
    case "follow_accept":
      return { label: "Request accepted", icon: UserPlus };
    case "new_follower":
      return { label: "New follower", icon: UserPlus };
    case "post_like":
      return { label: "Post liked", icon: Heart };
    case "post_comment":
      return { label: "New comment", icon: MessageCircle };
    default:
      return { label: "Activity", icon: Bell };
  }
};

export function NotificationsList() {
  const [items, setItems] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    try {
      const { data } = await socialApi.notifications.list(50);
      if (data?.ok) setItems(data.data || []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    socialApi.notifications.markRead();
  }, []);

  if (loading) {
    return (
      <Card>
        <CardContent className="py-8 flex items-center justify-center">
          <Loader2 className="h-5 w-5 animate-spin" />
        </CardContent>
      </Card>
    );
  }

  if (items.length === 0) {
    return (
      <Card>
        <CardContent className="py-8 text-center text-muted-foreground">
          No notifications yet.
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Notifications</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {items.map((n) => {
          const meta = typeLabel(n.type);
          const Icon = meta.icon;
          return (
            <div key={n._id} className="flex items-start gap-3 border-b pb-2 last:border-b-0 last:pb-0">
              <Icon className="h-4 w-4 text-primary mt-1" />
              <div className="flex-1 text-sm">
                <div className="font-medium">{meta.label}</div>
                {n.fromUserId?.username && (
                  <div className="text-muted-foreground text-xs">@{n.fromUserId.username}</div>
                )}
                <div className="text-xs text-muted-foreground">
                  {new Date(n.createdAt).toLocaleString()}
                </div>
              </div>
              {!n.read && <Badge variant="secondary">New</Badge>}
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}


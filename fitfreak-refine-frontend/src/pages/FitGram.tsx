import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Hash, Search, Compass, Users, Bell, UserCircle2 } from "lucide-react";
import { socialApi } from "@/integrations/api/social";
import { CreatePostForm } from "@/components/fitgram/CreatePostForm";
import { PostCard, Post } from "@/components/fitgram/PostCard";
import { NotificationsList } from "@/components/fitgram/NotificationsList";
import { StoryBar } from "@/components/fitgram/StoryBar";
import { CreateStory } from "@/components/fitgram/CreateStory";
import FitGramMyProfile from "./FitGramMyProfile";
import FitGramChat from "./FitGramChat";
import { Header } from "@/components/layout/Header";
import { Sidebar } from "@/components/layout/Sidebar";

type SearchUser = { _id: string; username?: string; name?: string; avatarUrl?: string };

export default function FitGram() {
  const [feed, setFeed] = useState<Post[]>([]);
  const [trending, setTrending] = useState<Post[]>([]);
  const [saved, setSaved] = useState<Post[]>([]);
  const [searchUsers, setSearchUsers] = useState<SearchUser[]>([]);
  const [searchHashtags, setSearchHashtags] = useState<string[]>([]);
  const [query, setQuery] = useState("");
  const [trendingGrid, setTrendingGrid] = useState<Post[]>([]);
  const [suggestedUsers, setSuggestedUsers] = useState<SearchUser[]>([]);

  const loadFeed = async () => {
    const { data } = await socialApi.posts.feed(20);
    if (data?.ok) setFeed(data.data || []);
  };

  const loadTrending = async () => {
    const { data } = await socialApi.explore.trending(12);
    if (data?.ok) setTrending(data.data || []);
    if (data?.ok) setTrendingGrid(data.data || []);
  };

  const loadSaved = async () => {
    const { data } = await socialApi.posts.saved();
    if (data?.ok) setSaved(data.data || []);
  };

  const handleSearch = async () => {
    const [uRes, hRes] = await Promise.all([
      socialApi.explore.searchUsers(query),
      socialApi.explore.searchHashtags(query),
    ]);
    if (uRes.data?.ok) setSearchUsers(uRes.data.data || []);
    if (hRes.data?.ok) setSearchHashtags(hRes.data.data || []);
  };

  useEffect(() => {
    loadFeed();
    loadTrending();
    loadSaved();
    socialApi.profile.suggestions(8).then(({ data }) => {
      if (data?.ok) setSuggestedUsers(data.data || []);
    });
  }, []);

  return (
    <div className="min-h-screen bg-background flex">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header />
        <div className="mx-auto w-full max-w-6xl px-4 md:px-8 py-6">
          <div className="grid grid-cols-1 lg:grid-cols-[2fr,1fr] gap-6">
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-primary/10 p-3">
                  <Hash className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h1 className="text-2xl md:text-3xl font-bold">FitGram</h1>
                  <p className="text-muted-foreground">
                    Share posts, explore trending fitness content, and follow friends.
                  </p>
                </div>
              </div>

              <Tabs defaultValue="feed" className="space-y-4">
                <TabsList className="flex flex-wrap gap-2">
                  <TabsTrigger value="feed">Feed</TabsTrigger>
                  <TabsTrigger value="create">Create</TabsTrigger>
                  <TabsTrigger value="explore">Explore</TabsTrigger>
                  <TabsTrigger value="notifications">
                    <Bell className="h-4 w-4 mr-1" /> Notifications
                  </TabsTrigger>
                  <TabsTrigger value="saved">Saved</TabsTrigger>
                  <TabsTrigger value="profile">
                    <UserCircle2 className="h-4 w-4 mr-1" /> Profile
                  </TabsTrigger>
                  <TabsTrigger value="messages">Messages</TabsTrigger>
                </TabsList>

                <TabsContent value="create">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    <CreatePostForm onCreated={() => { loadFeed(); loadTrending(); loadSaved(); }} />
                    <CreateStory onCreated={loadFeed} />
                  </div>
                </TabsContent>

                <TabsContent value="feed" className="space-y-4">
                  <StoryBar />
                  {feed.length === 0 ? (
                    <Card>
                      <CardContent className="py-10 text-center text-muted-foreground">
                        No posts yet. Follow people or create your first post.
                      </CardContent>
                    </Card>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {feed.map((p) => (
                        <PostCard key={p._id} post={p} onLike={() => { loadFeed(); loadSaved(); }} />
                      ))}
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="explore" className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Compass className="h-5 w-5 text-primary" />
                        Explore & Search
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex gap-2">
                        <Input
                          placeholder="Search users or hashtags"
                          value={query}
                          onChange={(e) => setQuery(e.target.value)}
                        />
                        <Button onClick={handleSearch}>
                          <Search className="h-4 w-4 mr-1" />
                          Search
                        </Button>
                      </div>
                      <Separator />
                      <div className="space-y-2">
                        <p className="text-sm font-semibold flex items-center gap-2">
                          <Users className="h-4 w-4" /> Users
                        </p>
                        {searchUsers.length === 0 ? (
                          <p className="text-xs text-muted-foreground">No users yet</p>
                        ) : (
                          <div className="flex flex-wrap gap-2">
                            {searchUsers.map((u) => (
                              <Badge key={u._id} variant="outline">
                                {u.username || u.name || "User"}
                              </Badge>
                            ))}
                          </div>
                        )}
                      </div>
                      <div className="space-y-2">
                        <p className="text-sm font-semibold flex items-center gap-2">
                          <Hash className="h-4 w-4" /> Hashtags
                        </p>
                        {searchHashtags.length === 0 ? (
                          <p className="text-xs text-muted-foreground">No hashtags yet</p>
                        ) : (
                          <div className="flex flex-wrap gap-2">
                            {searchHashtags.map((h) => (
                              <Badge key={h} variant="secondary">#{h}</Badge>
                            ))}
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>

                  {trending.length === 0 ? (
                    <Card>
                      <CardContent className="py-8 text-center text-muted-foreground">
                        No trending posts yet.
                      </CardContent>
                    </Card>
                  ) : (
                    <div className="columns-1 md:columns-2 lg:columns-3 gap-4 space-y-4">
                      {trendingGrid.map((p) => (
                        <div key={p._id} className="break-inside-avoid">
                          <PostCard post={p} onLike={loadTrending} />
                        </div>
                      ))}
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="notifications" className="space-y-4">
                  <NotificationsList />
                </TabsContent>

                <TabsContent value="saved" className="space-y-4">
                  {saved.length === 0 ? (
                    <Card>
                      <CardContent className="py-10 text-center text-muted-foreground">
                        No saved posts yet.
                      </CardContent>
                    </Card>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {saved.map((p) => (
                        <PostCard key={p._id} post={p} onLike={loadSaved} />
                      ))}
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="profile" className="space-y-4">
                  <FitGramMyProfile />
                </TabsContent>

                <TabsContent value="messages" className="space-y-4">
                  <FitGramChat />
                </TabsContent>
              </Tabs>
            </div>

            <div className="hidden lg:block space-y-4">
              <Card className="sticky top-6">
                <CardHeader>
                  <CardTitle>Suggested for you</CardTitle>
                  <CardDescription>People you may know</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                {suggestedUsers.length === 0 ? (
                  <div className="text-sm text-muted-foreground">No suggestions right now</div>
                ) : (
                  suggestedUsers.map((s) => (
                    <div key={s._id} className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center text-xs font-semibold">
                          {s.username?.charAt(0)?.toUpperCase() || "U"}
                        </div>
                        <div>
                          <div className="font-medium">{s.name || s.username || "User"}</div>
                          <div className="text-muted-foreground">@{s.username || "user"}</div>
                        </div>
                      </div>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => (window.location.href = `/fitgram/profile/${s._id}`)}
                      >
                        View
                      </Button>
                    </div>
                  ))
                )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


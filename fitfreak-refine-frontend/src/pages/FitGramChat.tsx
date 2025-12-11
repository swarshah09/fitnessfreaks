import { useEffect, useMemo, useRef, useState, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { socialApi } from "@/integrations/api/social";
import { useAuth } from "@/hooks/useAuth";
import { io, Socket } from "socket.io-client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Loader2, Send, Reply, Trash2, Smile, Search, Paperclip, BellOff, Pin, PinOff, Star, Image as ImageIcon } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

type UserLite = { _id: string; name?: string; username?: string; avatarUrl?: string; isPrivate?: boolean; lastSeen?: string };
type ChatListItem = {
  _id: string;
  otherUser: UserLite;
  lastMessage?: any;
  lastMessageAt?: string;
  unread?: number;
  pinned?: boolean;
  muted?: boolean;
};

export default function FitGramChat() {
  const { user } = useAuth();
  const [suggestions, setSuggestions] = useState<UserLite[]>([]);
  const [chatList, setChatList] = useState<ChatListItem[]>([]);
  const [selected, setSelected] = useState<UserLite | null>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [text, setText] = useState("");
  const [replyTo, setReplyTo] = useState<any | null>(null);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [search, setSearch] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [uploading, setUploading] = useState(false);
  const [showStarredOnly, setShowStarredOnly] = useState(false);
  const [wallpaper, setWallpaper] = useState<string | undefined>(undefined);
  const [showStarPanel, setShowStarPanel] = useState(false);
  const socketRef = useRef<Socket | null>(null);
  const bottomRef = useRef<HTMLDivElement | null>(null);
  const typingTimeout = useRef<NodeJS.Timeout | null>(null);

  const token = useMemo(() => localStorage.getItem("authToken"), []);

  const refreshChatList = useCallback(async () => {
    const { data } = await socialApi.chat.list();
    if (data?.ok) {
      const list = (data.data || []).sort(
        (a: any, b: any) =>
          Number(b.pinned) - Number(a.pinned) ||
          new Date(b.lastMessageAt || 0).getTime() - new Date(a.lastMessageAt || 0).getTime()
      );
      setChatList(list);
    }
  }, []);

  useEffect(() => {
    const loadSuggestions = async () => {
      const [suggRes, followRes] = await Promise.allSettled([
        socialApi.profile.suggestions(12),
        user?._id ? socialApi.follow.list(user._id) : Promise.resolve({ data: null }),
      ]);
      const suggestions: UserLite[] = [];
      if (suggRes.status === "fulfilled" && suggRes.value.data?.ok) {
        suggestions.push(...(suggRes.value.data.data || []));
      }
      if (followRes.status === "fulfilled" && followRes.value.data?.ok) {
        const following = followRes.value.data.data?.following || [];
        following.forEach((f: any) => {
          if (f.targetUserId) {
            suggestions.push({
              _id: f.targetUserId._id,
              username: f.targetUserId.username,
              name: f.targetUserId.name,
              avatarUrl: f.targetUserId.avatarUrl,
            });
          }
        });
      }
      // dedupe by _id
      const seen = new Set();
      const deduped = suggestions.filter((u) => {
        if (!u?._id || seen.has(u._id)) return false;
        seen.add(u._id);
        return true;
      });
      setSuggestions(deduped);
    };
    loadSuggestions();
    refreshChatList();
  }, [refreshChatList, user?._id]);

  useEffect(() => {
    if (!token || !user?._id) return;
    const socket = io(import.meta.env.VITE_API_BASE_URL || "http://localhost:8000", {
      query: { userId: user._id },
      transports: ["websocket"],
    });
    socketRef.current = socket;

    socket.on("chat:message", (msg) => {
      const isInThread = selected && (msg.fromUserId === selected._id || msg.toUserId === selected._id);
      if (isInThread) {
        setMessages((prev) => [...prev, msg]);
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
      }
      refreshChatList();
    });

    socket.on("chat:typing", ({ from, isTyping }) => {
      if (selected && from === selected._id) {
        setIsTyping(!!isTyping);
      }
    });

    socket.on("chat:read", ({ from }) => {
      if (selected && from === selected._id) {
        setMessages((prev) =>
          prev.map((m) => (m.fromUserId === user?._id ? { ...m, status: "read" } : m))
        );
      }
    });

    return () => {
      socket.disconnect();
    };
  }, [token, user?._id, selected?._id]);

  const loadMessages = async (otherId: string) => {
    setLoadingMessages(true);
    try {
      const { data } = await socialApi.chat.messages(otherId);
      if (data?.ok) {
        setMessages(data.data || []);
        await socialApi.chat.read(otherId);
        socketRef.current?.emit("chat:read", { from: otherId });
        setChatList((prev) =>
          prev.map((c) =>
            c.otherUser._id === otherId ? { ...c, unread: 0 } : c
          )
        );
        // refresh to pull lastMessage status and unread globally
        refreshChatList();
      } else if (data?.message) {
        setMessages([]);
        alert(data.message);
      }
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    } finally {
      setLoadingMessages(false);
    }
  };

  const sendTyping = (to: string, typing: boolean) => {
    socketRef.current?.emit("chat:typing", { to, isTyping: typing });
  };

  const handleSend = async (opts?: { mediaUrl?: string; type?: string }) => {
    if (!selected || !socketRef.current) return;
    const payload = {
      to: selected._id,
      text: opts?.mediaUrl ? text.trim() || "" : text.trim(),
      fromUserId: user?._id,
      toUserId: selected._id,
      createdAt: new Date().toISOString(),
      type: opts?.type || (opts?.mediaUrl ? "image" : "text"),
      mediaUrl: opts?.mediaUrl,
      replyTo: replyTo?._id,
    };
    if (!payload.text && !payload.mediaUrl) return;
    socketRef.current.emit("chat:message", payload);
    setMessages((prev) => [...prev, payload]);
    setText("");
    setReplyTo(null);
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const uploadAndSend = async (file: File) => {
    const isImage = file.type.startsWith("image/");
    const isVideo = file.type.startsWith("video/");
    const isAudio = file.type.startsWith("audio/");
    const type = isImage ? "image" : isVideo ? "video" : isAudio ? "audio" : "doc";
    const form = new FormData();
    form.append("myimage", file);
    try {
      setUploading(true);
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL || "http://localhost:8000"}/image-upload/uploadimage`, {
        method: "POST",
        body: form,
      });
      const data = await res.json();
      if (data?.ok && data.imageUrl) {
        await handleSend({ mediaUrl: data.imageUrl, type });
      } else {
        alert(data?.error || "Upload failed");
      }
    } catch (err: any) {
      alert(err?.message || "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    uploadAndSend(file);
  };

  const onSearch = async () => {
    if (!selected || !search.trim()) {
      setSearchResults([]);
      return;
    }
    const { data } = await socialApi.chat.search(selected._id, search.trim());
    if (data?.ok) setSearchResults(data.data || []);
  };

  const toggleReaction = async (messageId: string, emoji: string) => {
    if (!selected) return;
    const { data } = await socialApi.chat.react(selected._id, { messageId, emoji });
    if (data?.ok) {
      setMessages((prev) => prev.map((m) => (m._id === messageId ? data.data : m)));
    }
  };

  const deleteMessage = async (messageId: string, forEveryone = false) => {
    if (!selected) return;
    const { data } = await socialApi.chat.delete(selected._id, { messageId, forEveryone });
    if (data?.ok) {
      setMessages((prev) => prev.map((m) => (m._id === messageId ? data.data : m)));
    } else if (data?.message) {
      alert(data.message);
    }
  };

  const statusIcon = (status?: string) => {
    if (status === "read") return "✓✓";
    if (status === "delivered") return "✓✓";
    return "✓";
  };

  const statusColor = (status?: string) => {
    if (status === "read") return "text-sky-500";
    if (status === "delivered") return "text-muted-foreground";
    return "text-muted-foreground";
  };

  const togglePin = async (userId: string) => {
    const { data } = await socialApi.chat.pin(userId);
    if (data?.ok) {
      setChatList((prev) =>
        prev
          .map((c) =>
            c.otherUser._id === userId ? { ...c, pinned: data.data.pinned } : c
          )
          .sort(
            (a, b) =>
              Number(b.pinned) - Number(a.pinned) ||
              new Date(b.lastMessageAt || 0).getTime() - new Date(a.lastMessageAt || 0).getTime()
          )
      );
    }
  };

  const toggleMute = async (userId: string) => {
    const { data } = await socialApi.chat.mute(userId);
    if (data?.ok) {
      setChatList((prev) =>
        prev.map((c) =>
          c.otherUser._id === userId ? { ...c, muted: data.data.muted } : c
        )
      );
    }
  };

  const lastSeenLabel = (lastSeen?: string) => {
    if (!lastSeen) return "Last seen recently";
    const d = new Date(lastSeen);
    const diff = Date.now() - d.getTime();
    if (diff < 2 * 60 * 1000) return "Online";
    return `Last seen ${d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`;
  };

  const toggleStar = async (messageId: string) => {
    if (!selected) return;
    const { data } = await socialApi.chat.star(selected._id, { messageId });
    if (data?.ok) {
      setMessages((prev) => prev.map((m) => (m._id === messageId ? data.data : m)));
    }
  };

  const applyWallpaper = async (val: string) => {
    if (!selected) return;
    setWallpaper(val);
    await socialApi.chat.wallpaper(selected._id, val);
  };

  const toneList = [
    { key: "default", label: "Default" },
    { key: "soft", label: "Soft Ping", url: "/tones/soft.mp3" },
    { key: "pop", label: "Pop", url: "/tones/pop.mp3" },
    { key: "chime", label: "Chime", url: "/tones/chime.mp3" },
  ];

  const playTone = (url?: string) => {
    if (!url) return;
    const audio = new Audio(url);
    audio.play();
  };

  return (
    <div className="p-4 md:p-6 space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Messages</span>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Input
                  placeholder="Search in chat"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pr-10"
                  disabled={!selected}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      onSearch();
                    }
                  }}
                />
                <Search className="h-4 w-4 text-muted-foreground absolute right-2 top-2.5" />
              </div>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-[300px,1fr] gap-6">
          <div className="space-y-3">
            {chatList.length === 0 ? (
              <div className="text-sm text-muted-foreground">No chats yet</div>
            ) : (
              chatList.map((c) => (
                <div key={c._id} className={cn("rounded-lg p-3 border hover:bg-accent transition-colors", selected?._id === c.otherUser._id && "bg-accent")}>
              <div className="flex items-center gap-3">
                    <Avatar className="h-11 w-11">
                      <AvatarImage src={c.otherUser.avatarUrl || ""} />
                      <AvatarFallback>{c.otherUser.username?.charAt(0) || "U"}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0 cursor-pointer" onClick={() => { setSelected(c.otherUser); setSearch(""); setSearchResults([]); loadMessages(c.otherUser._id); }}>
                      <div className="flex items-center justify-between">
                        <div className="font-semibold truncate">{c.otherUser.username || c.otherUser.name || "User"}</div>
                        <div className="text-[11px] text-muted-foreground">{c.lastMessageAt ? new Date(c.lastMessageAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : ""}</div>
                      </div>
                  <div className="text-xs text-muted-foreground truncate">
                    {c.lastMessage
                      ? `${c.lastMessage?.fromUserId === user?._id ? "You: " : `${c.otherUser.username || "They"}: `}${c.lastMessage?.text || (c.lastMessage?.mediaUrl ? "[Media]" : "")}`
                      : "Say hi"}
                  </div>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      {c.unread ? <span className="px-2 py-0.5 rounded-full bg-primary text-primary-foreground text-[11px]">{c.unread}</span> : null}
                      <div className="flex gap-1">
                        <button onClick={() => togglePin(c.otherUser._id)} title={c.pinned ? "Unpin" : "Pin"}>
                          {c.pinned ? <PinOff className="h-4 w-4" /> : <Pin className="h-4 w-4" />}
                        </button>
                        <button onClick={() => toggleMute(c.otherUser._id)} title={c.muted ? "Unmute" : "Mute"}>
                          <BellOff className={cn("h-4 w-4", c.muted && "text-muted-foreground")} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
            <Separator />
            <div className="text-xs text-muted-foreground">People you may know</div>
            {suggestions.slice(0, 6).map((s) => (
              <button
                key={s._id}
                className={`flex items-center gap-2 w-full rounded-md px-2 py-2 hover:bg-accent ${selected?._id === s._id ? "bg-accent" : ""
                  }`}
                onClick={() => {
                  setSelected(s);
                  setSearch("");
                  setSearchResults([]);
                  loadMessages(s._id);
                }}
              >
                <Avatar className="h-8 w-8">
                  <AvatarImage src={s.avatarUrl || ""} />
                  <AvatarFallback>{s.username?.charAt(0) || "U"}</AvatarFallback>
                </Avatar>
                <div className="text-left">
                  <div className="text-sm font-medium">{s.username || s.name || "User"}</div>
                </div>
              </button>
            ))}
          </div>

          <div className="flex flex-col border rounded-lg">
            <div className="flex items-center justify-between px-4 py-3 border-b">
              {selected ? (
                <>
                  <div>
                    <div className="font-semibold">{selected.username || selected.name || "User"}</div>
                    <div className="text-xs text-muted-foreground">
                      {lastSeenLabel(selected.lastSeen)}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="ghost" onClick={() => togglePin(selected._id)}>
                      <Pin className="h-4 w-4" />
                    </Button>
                    <Button size="sm" variant="ghost" onClick={() => toggleMute(selected._id)}>
                      <BellOff className="h-4 w-4" />
                    </Button>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button size="sm" variant="outline">
                          Wallpaper
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        {["#f5f5f5", "#eef2ff", "#e0f2fe", "#fef9c3"].map((c) => (
                          <DropdownMenuItem key={c} onClick={() => applyWallpaper(c)}>
                            <div className="h-4 w-4 rounded-full mr-2" style={{ background: c }} />
                            {c}
                          </DropdownMenuItem>
                        ))}
                        <DropdownMenuItem onClick={() => applyWallpaper("")}>Default</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button size="sm" variant="outline">
                          Tone
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        {toneList.map((t) => (
                          <DropdownMenuItem
                            key={t.key}
                            onClick={() => {
                              if (!selected) return;
                              socialApi.chat.tone(selected._id, t.key);
                              playTone(t.url);
                            }}
                          >
                            {t.label}
                          </DropdownMenuItem>
                        ))}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </>
              ) : (
                <div className="text-sm text-muted-foreground">Select a chat to view</div>
              )}
            </div>
            <div className="flex-1 p-4" style={wallpaper ? { background: wallpaper } : undefined}>
              {loadingMessages ? (
                <div className="flex items-center justify-center h-full text-muted-foreground">
                  <Loader2 className="h-5 w-5 animate-spin" />
                </div>
              ) : selected ? (
                <>
                  <div className="text-xs text-muted-foreground mb-2">
                    {isTyping ? `${selected.username || "User"} is typing...` : ""}
                  </div>
                  <ScrollArea className="h-[420px] pr-1">
                    <div className="space-y-3">
                      {messages
                        .filter((m) => !showStarredOnly || (m.starredBy || []).includes(user?._id))
                        .map((m, idx) => {
                        const isMe = m.fromUserId === user?._id;
                        const isDeleted = m.deletedForEveryone || (m.deletedFor || []).includes(user?._id);
                        return (
                          <div key={idx} className="group">
                            <div
                              className={cn(
                                "max-w-[80%] rounded-lg px-4 py-3 text-sm relative shadow-sm",
                                isMe ? "ml-auto bg-primary text-primary-foreground" : "bg-muted"
                              )}
                            >
                              {m.replyTo && (
                                <div className="text-xs mb-1 opacity-80 border-l-2 pl-2">
                                  Replying…
                                </div>
                              )}
                              {!isMe && (
                                <div className="text-[11px] font-semibold mb-1 text-muted-foreground">
                                  {selected?.username || "Sender"}
                                </div>
                              )}
                              {m.mediaUrl && (
                                <div className="mb-2">
                                  {m.type === "video" ? (
                                    <video src={m.mediaUrl} controls className="rounded-md max-h-48" />
                                  ) : (
                                    <img src={m.mediaUrl} alt="media" className="rounded-md max-h-48" />
                                  )}
                                </div>
                              )}
                              <div className={cn(isDeleted && "italic opacity-70")}>
                                {isDeleted ? "Message deleted" : m.text}
                              </div>
                              <div className="flex items-center justify-end gap-1 text-[11px] opacity-80 mt-2">
                                {isMe && <span className={statusColor(m.status)}>{statusIcon(m.status)}</span>}
                                <span>{new Date(m.createdAt || Date.now()).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</span>
                              </div>
                            </div>
                            <div className="hidden group-hover:flex gap-1 text-xs mt-1">
                              <Button size="sm" variant="ghost" className="h-7 px-2" onClick={() => setReplyTo(m)}>
                                <Reply className="h-3 w-3 mr-1" /> Reply
                              </Button>
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button size="sm" variant="ghost" className="h-7 px-2">
                                    <Smile className="h-3 w-3 mr-1" /> React
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent>
                                  {["👍", "❤️", "😂", "😮", "😢", "👏"].map((e) => (
                                    <DropdownMenuItem key={e} onClick={() => toggleReaction(m._id, e)}>
                                      {e}
                                    </DropdownMenuItem>
                                  ))}
                                </DropdownMenuContent>
                              </DropdownMenu>
                              <Button size="sm" variant="ghost" className="h-7 px-2" onClick={() => toggleStar(m._id)}>
                                <Star className={cn("h-3 w-3 mr-1", (m.starredBy || []).includes(user?._id) && "fill-yellow-500 text-yellow-500")} /> Star
                              </Button>
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button size="sm" variant="ghost" className="h-7 px-2 text-destructive">
                                    <Trash2 className="h-3 w-3 mr-1" /> Delete
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent>
                                  <DropdownMenuItem onClick={() => deleteMessage(m._id, false)}>
                                    Delete for me
                                  </DropdownMenuItem>
                                  {isMe && (
                                    <DropdownMenuItem onClick={() => deleteMessage(m._id, true)}>
                                      Delete for everyone
                                    </DropdownMenuItem>
                                  )}
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </div>
                            {m.reactions && m.reactions.length > 0 && (
                              <div className="flex gap-1 text-xs mt-1">
                                {m.reactions.map((r: any, i: number) => (
                                  <span key={i} className="px-2 py-1 rounded-full bg-muted text-foreground">
                                    {r.emoji}
                                  </span>
                                ))}
                              </div>
                            )}
                          </div>
                        );
                      })}
                      <div ref={bottomRef} />
                    </div>
                  </ScrollArea>
                </>
              ) : (
                <div className="flex items-center justify-center h-full text-muted-foreground">
                  Select a user to start chatting.
                </div>
              )}
            </div>
            <div className="border-t p-3 grid grid-cols-[1fr,420px] gap-3 items-start">
              <div className="space-y-2">
                {replyTo && (
                  <div className="text-xs bg-muted px-2 py-1 rounded-full inline-flex items-center gap-2">
                    Replying… <button className="text-primary" onClick={() => setReplyTo(null)}>Cancel</button>
                  </div>
                )}
                <div className="flex gap-2 flex-wrap">
                  <Button size="sm" variant={showStarredOnly ? "secondary" : "ghost"} onClick={() => setShowStarredOnly((v) => !v)}>
                    <Star className="h-4 w-4 mr-1" /> Starred
                  </Button>
                  <Button size="sm" variant={showStarPanel ? "secondary" : "ghost"} onClick={() => setShowStarPanel((v) => !v)}>
                    <Star className="h-4 w-4 mr-1" /> View starred
                  </Button>
                </div>
              </div>

              <div className="flex items-center gap-2 bg-muted/50 rounded-xl px-3 py-2">
                <Input
                  placeholder="Message..."
                  value={text}
                  onChange={(e) => {
                    setText(e.target.value);
                    if (!selected) return;
                    if (typingTimeout.current) clearTimeout(typingTimeout.current);
                    sendTyping(selected._id, true);
                    typingTimeout.current = setTimeout(() => sendTyping(selected._id, false), 1200);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleSend();
                    }
                  }}
                  className="flex-1"
                />
                <label className="inline-flex items-center justify-center rounded-md border px-2 h-10 cursor-pointer bg-background">
                  <Paperclip className="h-4 w-4" />
                  <input
                    type="file"
                    className="hidden"
                    onChange={onFileChange}
                    disabled={uploading}
                    accept="image/*,video/*,audio/*,.pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx"
                  />
                </label>
                <Button onClick={() => handleSend()} disabled={!selected || (!text.trim() && !replyTo)}>
                  {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                </Button>
              </div>
            </div>
            {searchResults.length > 0 && (
              <>
                <Separator />
                <div className="p-3 space-y-2 text-sm">
                  <div className="font-semibold">Search results</div>
                  <div className="space-y-2 max-h-40 overflow-y-auto">
                    {searchResults.map((m, i) => (
                      <div key={i} className="border rounded-md p-2">
                        {m.text}
                        <div className="text-[10px] text-muted-foreground">
                          {new Date(m.createdAt).toLocaleString()}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}
            {showStarPanel && (
              <>
                <Separator />
                <div className="p-3 space-y-2 text-sm">
                  <div className="font-semibold">Starred messages</div>
                  <div className="space-y-2 max-h-48 overflow-y-auto">
                    {messages.filter((m) => (m.starredBy || []).includes(user?._id)).map((m, i) => (
                      <div key={i} className="border rounded-md p-2">
                        {m.text || (m.mediaUrl ? "[Media]" : "")}
                        <div className="text-[10px] text-muted-foreground">
                          {new Date(m.createdAt).toLocaleString()}
                        </div>
                      </div>
                    ))}
                    {messages.filter((m) => (m.starredBy || []).includes(user?._id)).length === 0 && (
                      <div className="text-xs text-muted-foreground">No starred messages</div>
                    )}
                  </div>
                </div>
              </>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}


import { api } from "./client";

export type SocialMedia = { url: string; type: "image" | "video" };

export const socialApi = {
  profile: {
    get: (userId: string) => api.get(`/social/user/${userId}`),
    update: (payload: Record<string, unknown>) => api.patch("/social/user/update", payload),
    suggestions: (limit = 10) => api.get(`/social/users/suggestions?limit=${limit}`),
  },
  follow: {
    request: (targetUserId: string) => api.post("/social/follow/request", { targetUserId }),
    accept: (followerId: string) => api.post("/social/follow/accept", { followerId }),
    reject: (followerId: string) => api.post("/social/follow/reject", { followerId }),
    unfollow: (targetUserId: string) => api.post("/social/follow/unfollow", { targetUserId }),
    list: (userId: string) => api.get(`/social/follow/list/${userId}`),
  },
  posts: {
    create: (payload: { caption: string; hashtags: string[]; visibility: "public" | "followers"; media: SocialMedia[]; location?: string }) =>
      api.post("/social/posts/create", payload),
    feed: (limit = 20) => api.get(`/social/posts/feed?limit=${limit}`),
    byUser: (userId: string) => api.get(`/social/posts/user/${userId}`),
    detail: (postId: string) => api.get(`/social/posts/${postId}`),
    like: (postId: string) => api.post("/social/posts/like", { postId }),
    comment: (postId: string, text: string) => api.post("/social/posts/comment", { postId, text }),
    remove: (postId: string) => api.delete(`/social/posts/delete/${postId}`),
    save: (postId: string) => api.post("/social/posts/save", { postId }),
    saved: () => api.get("/social/posts/saved"),
  },
  explore: {
    trending: (limit = 20) => api.get(`/social/explore/trending?limit=${limit}`),
    searchUsers: (q: string) => api.get(`/social/search/users?q=${encodeURIComponent(q)}`),
    searchHashtags: (q: string) => api.get(`/social/search/hashtags?q=${encodeURIComponent(q)}`),
  },
  notifications: {
    list: (limit = 50) => api.get(`/social/notifications?limit=${limit}`),
    markRead: () => api.patch(`/social/notifications/mark-read`),
  },
  stories: {
    create: (payload: { url: string; type?: "image" | "video"; caption?: string }) => api.post("/social/stories/create", payload),
    feed: () => api.get("/social/stories/feed"),
    byUser: (userId: string) => api.get(`/social/stories/user/${userId}`),
    remove: (id: string) => api.delete(`/social/stories/${id}`),
  },
  chat: {
    messages: (userId: string) => api.get(`/social/chat/${userId}`),
    send: (userId: string, payload: { text?: string; type?: string; mediaUrl?: string; caption?: string; replyTo?: string; forwardedFrom?: string }) =>
      api.post(`/social/chat/${userId}/send`, payload),
    read: (userId: string) => api.post(`/social/chat/${userId}/read`),
    react: (userId: string, payload: { messageId: string; emoji: string }) => api.post(`/social/chat/${userId}/react`, payload),
    delete: (userId: string, payload: { messageId: string; forEveryone?: boolean }) => api.post(`/social/chat/${userId}/delete`, payload),
    star: (userId: string, payload: { messageId: string }) => api.post(`/social/chat/${userId}/star`, payload),
    search: (userId: string, q: string) => api.get(`/social/chat/${userId}/search`, { params: { q } }),
    list: () => api.get(`/social/chat`),
    pin: (userId: string) => api.post(`/social/chat/${userId}/pin`),
    mute: (userId: string) => api.post(`/social/chat/${userId}/mute`),
    lastSeen: (userId: string) => api.get(`/social/chat/${userId}/last-seen`),
    wallpaper: (userId: string, wallpaper: string) => api.post(`/social/chat/${userId}/wallpaper`, { wallpaper }),
    tone: (userId: string, customTone: string) => api.post(`/social/chat/${userId}/tone`, { customTone }),
  },
};


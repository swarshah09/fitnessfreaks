const express = require('express');
const router = express.Router();
const checkAuth = require('../Middlewares/checkAuthToken');
const SocialMessage = require('../Models/SocialMessage');
const SocialFollow = require('../Models/SocialFollow');
const User = require('../Models/UserSchema');
const SocialChat = require('../Models/SocialChat');

const DELETE_WINDOW_MS = 24 * 60 * 60 * 1000; // 24 hours
const REACTIONS_SET = ['👍', '❤️', '😂', '😮', '😢', '👏'];

const createResponse = (ok, message, data = null) => ({ ok, message, data });

const canMessage = async (viewerId, otherUserId) => {
    const other = await User.findById(otherUserId).lean();
    if (!other) return false;
    if (!other.isPrivate) return true;
    const accepted = await SocialFollow.findOne({
        followerId: viewerId,
        targetUserId: otherUserId,
        status: 'accepted',
    }).lean();
    return !!accepted;
};

// GET /social/chat/:userId - fetch recent messages between auth user and userId (respect privacy)
router.get('/chat/:userId', checkAuth, async (req, res) => {
    try {
        const otherId = req.params.userId;
        const allowed = await canMessage(req.userId, otherId);
        if (!allowed) {
            return res.status(403).json(createResponse(false, 'Cannot message this user unless follow is accepted'));
        }
        const messages = await SocialMessage.find({
            $or: [
                { fromUserId: req.userId, toUserId: otherId },
                { fromUserId: otherId, toUserId: req.userId },
            ],
        })
            .sort({ createdAt: -1 })
            .limit(50)
            .lean();
        // mark incoming as delivered
        await SocialMessage.updateMany(
            { toUserId: req.userId, fromUserId: otherId, status: 'sent' },
            { $set: { status: 'delivered' } }
        );
        return res.json(createResponse(true, 'Messages', messages.reverse()));
    } catch (err) {
        console.error('Chat fetch error', err);
        return res.status(500).json(createResponse(false, 'Failed to fetch messages'));
    }
});

// GET /social/chat/list - list chats with metadata
router.get('/chat', checkAuth, async (req, res) => {
    try {
        const chats = await SocialChat.find({ participants: req.userId })
            .sort({ lastMessageAt: -1 })
            .populate({ path: 'lastMessage' })
            .populate({ path: 'participants', select: 'name username avatarUrl isPrivate lastSeen' })
            .lean();

        const mapped = chats.map((c) => {
            const other = (c.participants || []).find((p) => String(p._id) !== String(req.userId));
            return {
                _id: c._id,
                otherUser: other,
                lastMessage: c.lastMessage,
                lastMessageAt: c.lastMessageAt,
                unread: c.unreadCounts?.[req.userId] || 0,
                pinned: (c.pinnedBy || []).some((id) => String(id) === String(req.userId)),
                muted: (c.mutedBy || []).some((id) => String(id) === String(req.userId)),
            };
        });

        return res.json(createResponse(true, 'Chats', mapped));
    } catch (err) {
        console.error('Chat list error', err);
        return res.status(500).json(createResponse(false, 'Failed to fetch chats'));
    }
});

// POST /social/chat/:userId/pin - toggle pin
router.post('/chat/:userId/pin', checkAuth, async (req, res) => {
    try {
        const otherId = req.params.userId;
        const chat = await SocialChat.findOneAndUpdate(
            { participants: { $all: [req.userId, otherId] } },
            { $setOnInsert: { participants: [req.userId, otherId] } },
            { upsert: true, new: true }
        );
        const has = chat.pinnedBy.some((id) => String(id) === String(req.userId));
        chat.pinnedBy = has ? chat.pinnedBy.filter((id) => String(id) !== String(req.userId)) : [...chat.pinnedBy, req.userId];
        await chat.save();
        return res.json(createResponse(true, 'Pinned updated', { pinned: !has }));
    } catch (err) {
        console.error('Pin error', err);
        return res.status(500).json(createResponse(false, 'Failed to update pin'));
    }
});

// POST /social/chat/:userId/mute - toggle mute
router.post('/chat/:userId/mute', checkAuth, async (req, res) => {
    try {
        const otherId = req.params.userId;
        const chat = await SocialChat.findOneAndUpdate(
            { participants: { $all: [req.userId, otherId] } },
            { $setOnInsert: { participants: [req.userId, otherId] } },
            { upsert: true, new: true }
        );
        const has = chat.mutedBy.some((id) => String(id) === String(req.userId));
        chat.mutedBy = has ? chat.mutedBy.filter((id) => String(id) !== String(req.userId)) : [...chat.mutedBy, req.userId];
        await chat.save();
        return res.json(createResponse(true, 'Muted updated', { muted: !has }));
    } catch (err) {
        console.error('Mute error', err);
        return res.status(500).json(createResponse(false, 'Failed to update mute'));
    }
});

// POST /social/chat/:userId/wallpaper - set wallpaper URL or color string
router.post('/chat/:userId/wallpaper', checkAuth, async (req, res) => {
    try {
        const otherId = req.params.userId;
        const { wallpaper } = req.body;
        const chat = await SocialChat.findOneAndUpdate(
            { participants: { $all: [req.userId, otherId] } },
            {
                $setOnInsert: { participants: [req.userId, otherId] },
                $set: { wallpaper },
            },
            { upsert: true, new: true }
        );
        return res.json(createResponse(true, 'Wallpaper updated', { wallpaper: chat.wallpaper }));
    } catch (err) {
        console.error('Wallpaper error', err);
        return res.status(500).json(createResponse(false, 'Failed to update wallpaper'));
    }
});

// POST /social/chat/:userId/tone - set custom tone key/url
router.post('/chat/:userId/tone', checkAuth, async (req, res) => {
    try {
        const otherId = req.params.userId;
        const { customTone } = req.body;
        const chat = await SocialChat.findOneAndUpdate(
            { participants: { $all: [req.userId, otherId] } },
            {
                $setOnInsert: { participants: [req.userId, otherId] },
                $set: { customTone },
            },
            { upsert: true, new: true }
        );
        return res.json(createResponse(true, 'Tone updated', { customTone: chat.customTone }));
    } catch (err) {
        console.error('Tone error', err);
        return res.status(500).json(createResponse(false, 'Failed to update tone'));
    }
});

// GET /social/chat/:userId/last-seen
router.get('/chat/:userId/last-seen', checkAuth, async (req, res) => {
    try {
        const u = await User.findById(req.params.userId).select('lastSeen').lean();
        if (!u) return res.status(404).json(createResponse(false, 'User not found'));
        return res.json(createResponse(true, 'Last seen', { lastSeen: u.lastSeen }));
    } catch (err) {
        console.error('Last seen error', err);
        return res.status(500).json(createResponse(false, 'Failed to fetch last seen'));
    }
});

// POST /social/chat/:userId/send - send a message (text/media)
router.post('/chat/:userId/send', checkAuth, async (req, res) => {
    try {
        const otherId = req.params.userId;
        const { text, type = 'text', mediaUrl, caption, replyTo, forwardedFrom } = req.body;

        const allowed = await canMessage(req.userId, otherId);
        if (!allowed) {
            return res.status(403).json(createResponse(false, 'Cannot message this user unless follow is accepted'));
        }
        if (!text && !mediaUrl) {
            return res.status(400).json(createResponse(false, 'Message text or media is required'));
        }

        const msg = await SocialMessage.create({
            fromUserId: req.userId,
            toUserId: otherId,
            text,
            type,
            mediaUrl,
            caption,
            replyTo,
            forwardedFrom,
        });

        // Upsert chat metadata
        const chat = await SocialChat.findOneAndUpdate(
            { participants: { $all: [req.userId, otherId] } },
            {
                $set: {
                    lastMessage: msg._id,
                    lastMessageAt: msg.createdAt,
                },
                $inc: { [`unreadCounts.${otherId}`]: 1 },
                $setOnInsert: { participants: [req.userId, otherId] },
            },
            { new: true, upsert: true }
        );

        // emit realtime to both participants
        const io = req.app.get('io');
        if (io) {
            const safeMsg = {
                _id: msg._id,
                fromUserId: msg.fromUserId,
                toUserId: msg.toUserId,
                text: msg.text,
                type: msg.type,
                mediaUrl: msg.mediaUrl,
                caption: msg.caption,
                replyTo: msg.replyTo,
                status: msg.status,
                createdAt: msg.createdAt,
            };
            io.to(String(otherId)).emit('chat:message', safeMsg);
            io.to(String(req.userId)).emit('chat:message', safeMsg);
        }

        return res.json(createResponse(true, 'Sent', { message: msg, chat }));
    } catch (err) {
        console.error('Send message error', err);
        return res.status(500).json(createResponse(false, 'Failed to send message'));
    }
});

// POST /social/chat/:userId/read - mark messages as read
router.post('/chat/:userId/read', checkAuth, async (req, res) => {
    try {
        const otherId = req.params.userId;
        await SocialMessage.updateMany(
            { toUserId: req.userId, fromUserId: otherId, status: { $ne: 'read' } },
            { $set: { status: 'read' } }
        );
        await SocialChat.findOneAndUpdate(
            { participants: { $all: [req.userId, otherId] } },
            { $set: { [`unreadCounts.${req.userId}`]: 0 } }
        );
        return res.json(createResponse(true, 'Read'));
    } catch (err) {
        console.error('Read error', err);
        return res.status(500).json(createResponse(false, 'Failed to mark read'));
    }
});

// POST /social/chat/:userId/react - add/remove reaction
router.post('/chat/:userId/react', checkAuth, async (req, res) => {
    try {
        const { messageId, emoji } = req.body;
        if (!REACTIONS_SET.includes(emoji)) {
            return res.status(400).json(createResponse(false, 'Unsupported reaction'));
        }
        const msg = await SocialMessage.findById(messageId);
        if (!msg) return res.status(404).json(createResponse(false, 'Message not found'));
        if (![String(msg.toUserId), String(msg.fromUserId)].includes(String(req.userId))) {
            return res.status(403).json(createResponse(false, 'Not allowed'));
        }
        const existing = msg.reactions.find(r => String(r.userId) === String(req.userId) && r.emoji === emoji);
        if (existing) {
            msg.reactions = msg.reactions.filter(r => !(String(r.userId) === String(req.userId) && r.emoji === emoji));
        } else {
            msg.reactions.push({ userId: req.userId, emoji });
        }
        await msg.save();
        return res.json(createResponse(true, 'Reaction updated', msg));
    } catch (err) {
        console.error('React error', err);
        return res.status(500).json(createResponse(false, 'Failed to update reaction'));
    }
});

// POST /social/chat/:userId/delete - delete message (me/everyone)
router.post('/chat/:userId/delete', checkAuth, async (req, res) => {
    try {
        const { messageId, forEveryone = false } = req.body;
        const msg = await SocialMessage.findById(messageId);
        if (!msg) return res.status(404).json(createResponse(false, 'Message not found'));
        const isSender = String(msg.fromUserId) === String(req.userId);
        const withinWindow = Date.now() - msg.createdAt.getTime() <= DELETE_WINDOW_MS;

        if (forEveryone) {
            if (!isSender) return res.status(403).json(createResponse(false, 'Only sender can delete for everyone'));
            if (!withinWindow) return res.status(400).json(createResponse(false, 'Delete window expired'));
            msg.deletedForEveryone = true;
        } else {
            if (!msg.deletedFor.includes(req.userId)) {
                msg.deletedFor.push(req.userId);
            }
        }
        await msg.save();
        return res.json(createResponse(true, 'Deleted', msg));
    } catch (err) {
        console.error('Delete error', err);
        return res.status(500).json(createResponse(false, 'Failed to delete message'));
    }
});

// POST /social/chat/:userId/star - toggle star
router.post('/chat/:userId/star', checkAuth, async (req, res) => {
    try {
        const { messageId } = req.body;
        const msg = await SocialMessage.findById(messageId);
        if (!msg) return res.status(404).json(createResponse(false, 'Message not found'));
        if (![String(msg.toUserId), String(msg.fromUserId)].includes(String(req.userId))) {
            return res.status(403).json(createResponse(false, 'Not allowed'));
        }
        const hasStar = msg.starredBy.some(id => String(id) === String(req.userId));
        msg.starredBy = hasStar
            ? msg.starredBy.filter(id => String(id) !== String(req.userId))
            : [...msg.starredBy, req.userId];
        await msg.save();
        return res.json(createResponse(true, 'Star updated', msg));
    } catch (err) {
        console.error('Star error', err);
        return res.status(500).json(createResponse(false, 'Failed to star message'));
    }
});

// GET /social/chat/:userId/search?q= - search messages in chat
router.get('/chat/:userId/search', checkAuth, async (req, res) => {
    try {
        const otherId = req.params.userId;
        const q = req.query.q || '';
        if (!q.trim()) return res.json(createResponse(true, 'Results', []));
        const allowed = await canMessage(req.userId, otherId);
        if (!allowed) return res.status(403).json(createResponse(false, 'Not allowed'));
        const messages = await SocialMessage.find({
            $or: [
                { fromUserId: req.userId, toUserId: otherId },
                { fromUserId: otherId, toUserId: req.userId },
            ],
            text: { $regex: q, $options: 'i' },
        })
            .sort({ createdAt: -1 })
            .limit(50)
            .lean();
        return res.json(createResponse(true, 'Results', messages));
    } catch (err) {
        console.error('Search error', err);
        return res.status(500).json(createResponse(false, 'Failed to search messages'));
    }
});

module.exports = router;


const express = require('express');
const router = express.Router();
const SocialPost = require('../Models/SocialPost');
const SocialNotification = require('../Models/SocialNotification');
const SocialFollow = require('../Models/SocialFollow');
const User = require('../Models/UserSchema');
const checkAuth = require('../Middlewares/checkAuthToken');
const mongoose = require('mongoose');

const createResponse = (ok, message, data = null) => ({ ok, message, data });

async function notify(userId, fromUserId, type, payload = {}) {
    try {
        await SocialNotification.create({ userId, fromUserId, type, payload });
    } catch (err) {
        console.error('Notification error', err.message);
    }
}

async function canViewUserContent(viewerId, targetUserId) {
    if (!targetUserId) return false;
    if (String(viewerId) === String(targetUserId)) return true;
    const user = await User.findById(targetUserId).select('isPrivate').lean();
    if (!user) return false;
    if (!user.isPrivate) return true;
    const accepted = await SocialFollow.findOne({
        followerId: viewerId,
        targetUserId,
        status: 'accepted',
    }).lean();
    return !!accepted;
}

// POST /social/posts/create
router.post('/posts/create', checkAuth, async (req, res) => {
    try {
        const { caption = '', hashtags = [], location = '', visibility = 'public', media = [] } = req.body;
        if (!Array.isArray(media) || media.length === 0) {
            return res.status(400).json(createResponse(false, 'Media is required'));
        }
        const trimmedHashtags = (hashtags || []).map((h) => h.replace('#', '').toLowerCase());
        const post = await SocialPost.create({
            userId: req.userId,
            caption,
            hashtags: trimmedHashtags,
            location,
            visibility,
            media,
        });
        return res.json(createResponse(true, 'Post created', post));
    } catch (err) {
        console.error('Create post error', err);
        return res.status(500).json(createResponse(false, 'Failed to create post'));
    }
});

// GET /social/posts/feed
router.get('/posts/feed', checkAuth, async (req, res) => {
    try {
        const limit = Math.min(parseInt(req.query.limit) || 20, 50);
        const following = await SocialFollow.find({ followerId: req.userId, status: 'accepted' }).select('targetUserId').lean();
        const followingIds = following.map((f) => f.targetUserId);

        const posts = await SocialPost.find({
            $or: [
                { userId: req.userId },
                { userId: { $in: followingIds } },
                { visibility: 'public' },
            ],
        })
            .sort({ createdAt: -1 })
            .limit(limit)
            .populate('userId', 'name username avatarUrl')
            .lean();

        return res.json(createResponse(true, 'Feed fetched', posts));
    } catch (err) {
        console.error('Feed error', err);
        return res.status(500).json(createResponse(false, 'Failed to fetch feed'));
    }
});

// GET /social/posts/saved (must be before /posts/:id to avoid route collision)
router.get('/posts/saved', checkAuth, async (req, res) => {
    try {
        const posts = await SocialPost.find({ saves: req.userId })
            .sort({ createdAt: -1 })
            .populate('userId', 'name username avatarUrl')
            .lean();
        return res.json(createResponse(true, 'Saved posts', posts));
    } catch (err) {
        console.error('Saved posts error', err);
        return res.status(500).json(createResponse(false, 'Failed to fetch saved posts'));
    }
});

// GET /social/posts/:id (populated detail)
router.get('/posts/:id', checkAuth, async (req, res) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json(createResponse(false, 'Invalid post id'));
        }
        const post = await SocialPost.findById(req.params.id)
            .populate('userId', 'name username avatarUrl isPrivate')
            .populate('comments.userId', 'name username avatarUrl')
            .lean();
        if (!post) return res.status(404).json(createResponse(false, 'Post not found'));
        const canView = post.visibility === 'public'
            ? (!post.userId?.isPrivate || String(post.userId?._id) === req.userId || await canViewUserContent(req.userId, post.userId?._id))
            : await canViewUserContent(req.userId, post.userId?._id);
        if (!canView) return res.status(403).json(createResponse(false, 'This account is private'));
        return res.json(createResponse(true, 'Post fetched', post));
    } catch (err) {
        console.error('Post detail error', err);
        return res.status(500).json(createResponse(false, 'Failed to fetch post'));
    }
});

// GET /social/posts/user/:id
router.get('/posts/user/:id', checkAuth, async (req, res) => {
    try {
        const userId = req.params.id;
        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json(createResponse(false, 'Invalid user id'));
        }
        const canView = await canViewUserContent(req.userId, userId);
        if (!canView) return res.status(403).json(createResponse(false, 'This account is private'));
        const posts = await SocialPost.find({ userId })
            .sort({ createdAt: -1 })
            .populate('userId', 'name username avatarUrl')
            .lean();
        return res.json(createResponse(true, 'User posts', posts));
    } catch (err) {
        console.error('User posts error', err);
        return res.status(500).json(createResponse(false, 'Failed to fetch posts'));
    }
});

// POST /social/posts/like
router.post('/posts/like', checkAuth, async (req, res) => {
    try {
        const { postId } = req.body;
        const post = await SocialPost.findById(postId);
        if (!post) return res.status(404).json(createResponse(false, 'Post not found'));
        const hasLiked = post.likes.some((id) => id.toString() === req.userId);
        if (hasLiked) {
            post.likes = post.likes.filter((id) => id.toString() !== req.userId);
        } else {
            post.likes.push(req.userId);
            await notify(post.userId, req.userId, 'post_like', { postId });
        }
        await post.save();
        return res.json(createResponse(true, hasLiked ? 'Unliked' : 'Liked', { likes: post.likes.length }));
    } catch (err) {
        console.error('Like error', err);
        return res.status(500).json(createResponse(false, 'Failed to like'));
    }
});

// POST /social/posts/comment
router.post('/posts/comment', checkAuth, async (req, res) => {
    try {
        const { postId, text } = req.body;
        if (!text) return res.status(400).json(createResponse(false, 'Comment text required'));
        const post = await SocialPost.findById(postId);
        if (!post) return res.status(404).json(createResponse(false, 'Post not found'));
        post.comments.push({ userId: req.userId, text });
        await post.save();
        await notify(post.userId, req.userId, 'post_comment', { postId });
        return res.json(createResponse(true, 'Comment added', post.comments));
    } catch (err) {
        console.error('Comment error', err);
        return res.status(500).json(createResponse(false, 'Failed to comment'));
    }
});

// POST /social/posts/save
router.post('/posts/save', checkAuth, async (req, res) => {
    try {
        const { postId } = req.body;
        const post = await SocialPost.findById(postId);
        if (!post) return res.status(404).json(createResponse(false, 'Post not found'));
        const hasSaved = post.saves.some((id) => id.toString() === req.userId);
        if (hasSaved) {
          post.saves = post.saves.filter((id) => id.toString() !== req.userId);
        } else {
          post.saves.push(req.userId);
        }
        await post.save();
        return res.json(createResponse(true, hasSaved ? 'Unsaved' : 'Saved', { saves: post.saves.length }));
    } catch (err) {
        console.error('Save error', err);
        return res.status(500).json(createResponse(false, 'Failed to save post'));
    }
});


// DELETE /social/posts/delete/:id
router.delete('/posts/delete/:id', checkAuth, async (req, res) => {
    try {
        const post = await SocialPost.findById(req.params.id);
        if (!post) return res.status(404).json(createResponse(false, 'Post not found'));
        if (post.userId.toString() !== req.userId) return res.status(403).json(createResponse(false, 'Not allowed'));
        await post.deleteOne();
        return res.json(createResponse(true, 'Post deleted'));
    } catch (err) {
        console.error('Delete post error', err);
        return res.status(500).json(createResponse(false, 'Failed to delete post'));
    }
});
// GET /social/explore/trending (basic stub: recent public posts)
router.get('/explore/trending', checkAuth, async (req, res) => {
    try {
        const limit = Math.min(parseInt(req.query.limit) || 20, 50);
        const posts = await SocialPost.find({ visibility: 'public' })
            .sort({ createdAt: -1 })
            .limit(limit)
            .populate('userId', 'name username avatarUrl')
            .lean();
        return res.json(createResponse(true, 'Trending', posts));
    } catch (err) {
        console.error('Trending error', err);
        return res.status(500).json(createResponse(false, 'Failed to fetch trending'));
    }
});

// GET /social/search/users
router.get('/search/users', checkAuth, async (req, res) => {
    try {
        const q = (req.query.q || '').toString().trim();
        if (!q) return res.json(createResponse(true, 'Results', []));
        const users = await User.find({
            $or: [
                { name: new RegExp(q, 'i') },
                { username: new RegExp(q, 'i') },
                { email: new RegExp(q, 'i') },
            ]
        }).select('name username avatarUrl').limit(20).lean();
        return res.json(createResponse(true, 'Results', users));
    } catch (err) {
        console.error('Search users error', err);
        return res.status(500).json(createResponse(false, 'Failed to search users'));
    }
});

// GET /social/search/hashtags
router.get('/search/hashtags', checkAuth, async (req, res) => {
    try {
        const q = (req.query.q || '').toString().replace('#', '').toLowerCase();
        if (!q) return res.json(createResponse(true, 'Results', []));
        const posts = await SocialPost.find({ hashtags: { $regex: q, $options: 'i' }, visibility: 'public' })
            .select('hashtags')
            .limit(50)
            .lean();
        const hashtags = Array.from(new Set(posts.flatMap((p) => p.hashtags || []))).slice(0, 20);
        return res.json(createResponse(true, 'Results', hashtags));
    } catch (err) {
        console.error('Search hashtags error', err);
        return res.status(500).json(createResponse(false, 'Failed to search hashtags'));
    }
});

module.exports = router;


const express = require('express');
const router = express.Router();
const SocialStory = require('../Models/SocialStory');
const checkAuth = require('../Middlewares/checkAuthToken');
const SocialFollow = require('../Models/SocialFollow');
const User = require('../Models/UserSchema');

const createResponse = (ok, message, data = null) => ({ ok, message, data });

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

// POST /social/stories/create
router.post('/stories/create', checkAuth, async (req, res) => {
    try {
        const { url, type = 'image', caption = '' } = req.body;
        if (!url) return res.status(400).json(createResponse(false, 'Story media url required'));
        const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);
        const story = await SocialStory.create({
            userId: req.userId,
            media: { url, type },
            caption,
            expiresAt,
        });
        return res.json(createResponse(true, 'Story created', story));
    } catch (err) {
        console.error('Create story error', err);
        return res.status(500).json(createResponse(false, 'Failed to create story'));
    }
});

// GET /social/stories/feed
router.get('/stories/feed', checkAuth, async (req, res) => {
    try {
        const rawStories = await SocialStory.find({ expiresAt: { $gt: new Date() } })
            .sort({ createdAt: -1 })
            .limit(50)
            .populate('userId', 'name username avatarUrl isPrivate')
            .lean();

        const filtered = [];
        for (const s of rawStories) {
            if (!s.userId) continue;
            const allowed = await canViewUserContent(req.userId, s.userId._id);
            if (allowed || !s.userId.isPrivate) {
                filtered.push(s);
            }
        }
        return res.json(createResponse(true, 'Stories feed', filtered));
    } catch (err) {
        console.error('Stories feed error', err);
        return res.status(500).json(createResponse(false, 'Failed to fetch stories'));
    }
});

// GET /social/stories/user/:id
router.get('/stories/user/:id', checkAuth, async (req, res) => {
    try {
        const userId = req.params.id;
        const allowed = await canViewUserContent(req.userId, userId);
        if (!allowed) return res.status(403).json(createResponse(false, 'This account is private'));
        const stories = await SocialStory.find({ userId, expiresAt: { $gt: new Date() } })
            .sort({ createdAt: -1 })
            .lean();
        return res.json(createResponse(true, 'User stories', stories));
    } catch (err) {
        console.error('User stories error', err);
        return res.status(500).json(createResponse(false, 'Failed to fetch stories'));
    }
});

// DELETE /social/stories/:id (owner only)
router.delete('/stories/:id', checkAuth, async (req, res) => {
    try {
        const story = await SocialStory.findById(req.params.id);
        if (!story) return res.status(404).json(createResponse(false, 'Story not found'));
        if (story.userId.toString() !== req.userId) return res.status(403).json(createResponse(false, 'Not allowed'));
        await story.deleteOne();
        return res.json(createResponse(true, 'Story deleted'));
    } catch (err) {
        console.error('Delete story error', err);
        return res.status(500).json(createResponse(false, 'Failed to delete story'));
    }
});

module.exports = router;


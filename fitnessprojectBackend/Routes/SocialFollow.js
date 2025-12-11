const express = require('express');
const router = express.Router();
const SocialFollow = require('../Models/SocialFollow');
const SocialNotification = require('../Models/SocialNotification');
const User = require('../Models/UserSchema');
const checkAuth = require('../Middlewares/checkAuthToken');

const createResponse = (ok, message, data = null) => ({ ok, message, data });

async function notify(userId, fromUserId, type, payload = {}) {
    try {
        await SocialNotification.create({ userId, fromUserId, type, payload });
    } catch (err) {
        console.error('Notification error', err.message);
    }
}

router.post('/request', checkAuth, async (req, res) => {
    try {
        const { targetUserId } = req.body;
        if (!targetUserId) return res.status(400).json(createResponse(false, 'targetUserId required'));
        if (targetUserId === req.userId) return res.status(400).json(createResponse(false, 'Cannot follow yourself'));

        const target = await User.findById(targetUserId).lean();
        if (!target) return res.status(404).json(createResponse(false, 'User not found'));

        const status = target.isPrivate ? 'requested' : 'accepted';
        const follow = await SocialFollow.findOneAndUpdate(
            { followerId: req.userId, targetUserId },
            { $set: { status } },
            { upsert: true, new: true }
        );

        if (status === 'requested') await notify(targetUserId, req.userId, 'follow_request', {});
        if (status === 'accepted') await notify(targetUserId, req.userId, 'new_follower', {});

        return res.json(createResponse(true, `Follow ${status}`, follow));
    } catch (err) {
        console.error('Follow request error', err);
        return res.status(500).json(createResponse(false, 'Failed to follow'));
    }
});

router.post('/accept', checkAuth, async (req, res) => {
    try {
        const { followerId } = req.body;
        if (!followerId) return res.status(400).json(createResponse(false, 'followerId required'));
        const follow = await SocialFollow.findOneAndUpdate(
            { followerId, targetUserId: req.userId },
            { $set: { status: 'accepted' } },
            { new: true }
        );
        if (!follow) return res.status(404).json(createResponse(false, 'Request not found'));
        await notify(followerId, req.userId, 'follow_accept', {});
        await notify(req.userId, followerId, 'new_follower', {});
        return res.json(createResponse(true, 'Follow accepted', follow));
    } catch (err) {
        console.error('Accept follow error', err);
        return res.status(500).json(createResponse(false, 'Failed to accept'));
    }
});

router.post('/reject', checkAuth, async (req, res) => {
    try {
        const { followerId } = req.body;
        if (!followerId) return res.status(400).json(createResponse(false, 'followerId required'));
        await SocialFollow.findOneAndDelete({ followerId, targetUserId: req.userId, status: 'requested' });
        return res.json(createResponse(true, 'Follow rejected'));
    } catch (err) {
        console.error('Reject follow error', err);
        return res.status(500).json(createResponse(false, 'Failed to reject'));
    }
});

router.post('/unfollow', checkAuth, async (req, res) => {
    try {
        const { targetUserId } = req.body;
        if (!targetUserId) return res.status(400).json(createResponse(false, 'targetUserId required'));
        await SocialFollow.findOneAndDelete({ followerId: req.userId, targetUserId });
        return res.json(createResponse(true, 'Unfollowed'));
    } catch (err) {
        console.error('Unfollow error', err);
        return res.status(500).json(createResponse(false, 'Failed to unfollow'));
    }
});

router.get('/list/:userId', checkAuth, async (req, res) => {
    try {
        const userId = req.params.userId;
        const followers = await SocialFollow.find({ targetUserId: userId, status: 'accepted' }).populate('followerId', 'name username avatarUrl').lean();
        const following = await SocialFollow.find({ followerId: userId, status: 'accepted' }).populate('targetUserId', 'name username avatarUrl').lean();
        const requests = await SocialFollow.find({ targetUserId: userId, status: 'requested' }).populate('followerId', 'name username avatarUrl').lean();
        return res.json(createResponse(true, 'Follow lists', { followers, following, requests }));
    } catch (err) {
        console.error('List follow error', err);
        return res.status(500).json(createResponse(false, 'Failed to fetch follow lists'));
    }
});

module.exports = router;


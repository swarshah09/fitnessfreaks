const express = require('express');
const router = express.Router();
const SocialNotification = require('../Models/SocialNotification');
const checkAuth = require('../Middlewares/checkAuthToken');

const createResponse = (ok, message, data = null) => ({ ok, message, data });

// GET /social/notifications
router.get('/notifications', checkAuth, async (req, res) => {
    try {
        const limit = Math.min(parseInt(req.query.limit) || 50, 100);
        const notifications = await SocialNotification.find({ userId: req.userId })
            .sort({ createdAt: -1 })
            .limit(limit)
            .populate('fromUserId', 'name username avatarUrl')
            .lean();
        return res.json(createResponse(true, 'Notifications fetched', notifications));
    } catch (err) {
        console.error('Notifications fetch error', err);
        return res.status(500).json(createResponse(false, 'Failed to fetch notifications'));
    }
});

// PATCH /social/notifications/mark-read
router.patch('/notifications/mark-read', checkAuth, async (req, res) => {
    try {
        await SocialNotification.updateMany({ userId: req.userId, read: false }, { $set: { read: true } });
        return res.json(createResponse(true, 'Notifications marked as read'));
    } catch (err) {
        console.error('Notifications mark-read error', err);
        return res.status(500).json(createResponse(false, 'Failed to mark notifications'));
    }
});

module.exports = router;


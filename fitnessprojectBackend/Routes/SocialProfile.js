const express = require('express');
const router = express.Router();
const User = require('../Models/UserSchema');
const SocialFollow = require('../Models/SocialFollow');
const checkAuth = require('../Middlewares/checkAuthToken');

const createResponse = (ok, message, data = null) => ({ ok, message, data });

// GET /social/user/:id
router.get('/user/:id', checkAuth, async (req, res) => {
    try {
        const userId = req.params.id;
        if (!userId || !require('mongoose').Types.ObjectId.isValid(userId)) {
            return res.status(400).json(createResponse(false, 'Invalid user id'));
        }
        const user = await User.findById(userId).lean();
        if (!user) return res.status(404).json(createResponse(false, 'User not found'));

        const followerCount = await SocialFollow.countDocuments({ targetUserId: user._id, status: 'accepted' });
        const followingCount = await SocialFollow.countDocuments({ followerId: user._id, status: 'accepted' });

        delete user.password;
        return res.json(createResponse(true, 'User fetched', { ...user, followerCount, followingCount }));
    } catch (err) {
        console.error('Error fetching user', err);
        return res.status(500).json(createResponse(false, 'Failed to fetch user'));
    }
});

// PATCH /social/user/update
router.patch('/user/update', checkAuth, async (req, res) => {
    try {
        const { name, bio, username, isPrivate, avatarUrl, coverUrl } = req.body;
        const updates = {};
        if (name !== undefined) updates.name = name;
        if (bio !== undefined) updates.bio = bio;
        if (username !== undefined) updates.username = username;
        if (isPrivate !== undefined) updates.isPrivate = isPrivate;
        if (avatarUrl !== undefined) updates.avatarUrl = avatarUrl;
        if (coverUrl !== undefined) updates.coverUrl = coverUrl;

        const updated = await User.findByIdAndUpdate(req.userId, { $set: updates }, { new: true, runValidators: true }).lean();
        if (!updated) return res.status(404).json(createResponse(false, 'User not found'));

        delete updated.password;
        return res.json(createResponse(true, 'Profile updated', updated));
    } catch (err) {
        console.error('Error updating profile', err);
        return res.status(500).json(createResponse(false, err.message || 'Failed to update profile'));
    }
});

// Suggestions endpoint
router.get('/users/suggestions', checkAuth, async (req, res) => {
    try {
        const limit = Math.min(parseInt(req.query.limit) || 10, 20);

        // collect users already connected (followed/requested) to avoid suggesting them again
        const existingFollows = await SocialFollow.find({
            followerId: req.userId,
        }).select('targetUserId').lean();
        const excludeIds = new Set([
            String(req.userId),
            ...existingFollows.map(f => String(f.targetUserId)),
        ]);

        const users = await User.find({ _id: { $nin: Array.from(excludeIds) } })
            .select('name username avatarUrl bio isPrivate')
            .limit(limit)
            .lean();

        return res.json(createResponse(true, 'Suggestions', users));
    } catch (err) {
        console.error('Suggestions error', err);
        return res.status(500).json(createResponse(false, 'Failed to fetch suggestions'));
    }
});

module.exports = router;

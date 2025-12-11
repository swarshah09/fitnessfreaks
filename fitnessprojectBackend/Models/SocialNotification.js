const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // recipient
    fromUserId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    type: {
        type: String,
        enum: [
            'follow_request',
            'follow_accept',
            'new_follower',
            'post_like',
            'post_comment',
            'mention'
        ],
        required: true
    },
    payload: { type: Object, default: {} },
    read: { type: Boolean, default: false },
}, { timestamps: true });

notificationSchema.index({ userId: 1, createdAt: -1 });

module.exports = mongoose.model('SocialNotification', notificationSchema);


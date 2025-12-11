const mongoose = require('mongoose');

const reactionSchema = new mongoose.Schema(
    {
        emoji: { type: String, required: true },
        userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    },
    { _id: false }
);

const messageSchema = new mongoose.Schema(
    {
        fromUserId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
        toUserId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
        text: { type: String, trim: true },
        type: {
            type: String,
            enum: ['text', 'image', 'video', 'doc', 'audio', 'voice'],
            default: 'text',
        },
        mediaUrl: { type: String },
        caption: { type: String, trim: true },
        replyTo: { type: mongoose.Schema.Types.ObjectId, ref: 'SocialMessage' },
        forwardedFrom: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        status: {
            type: String,
            enum: ['sent', 'delivered', 'read'],
            default: 'sent',
        },
        reactions: { type: [reactionSchema], default: [] },
        deletedFor: { type: [mongoose.Schema.Types.ObjectId], ref: 'User', default: [] },
        deletedForEveryone: { type: Boolean, default: false },
        starredBy: { type: [mongoose.Schema.Types.ObjectId], ref: 'User', default: [] },
    },
    { timestamps: true }
);

messageSchema.index({ fromUserId: 1, toUserId: 1, createdAt: -1 });
messageSchema.index({ toUserId: 1, fromUserId: 1, createdAt: -1 });
messageSchema.index({ createdAt: -1 });

module.exports = mongoose.model('SocialMessage', messageSchema);


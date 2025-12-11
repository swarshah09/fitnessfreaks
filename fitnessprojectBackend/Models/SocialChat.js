const mongoose = require('mongoose');

const chatSchema = new mongoose.Schema(
    {
        participants: {
            type: [
                { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
            ],
            validate: [(arr) => arr.length === 2, 'Chat must have exactly two participants'],
        },
        pinnedBy: { type: [mongoose.Schema.Types.ObjectId], ref: 'User', default: [] },
        mutedBy: { type: [mongoose.Schema.Types.ObjectId], ref: 'User', default: [] },
        wallpaper: { type: String },
        customTone: { type: String },
        lastMessage: { type: mongoose.Schema.Types.ObjectId, ref: 'SocialMessage' },
        lastMessageAt: { type: Date },
        unreadCounts: {
            type: Map,
            of: Number,
            default: {},
        },
    },
    { timestamps: true }
);

chatSchema.index({ participants: 1 });

module.exports = mongoose.model('SocialChat', chatSchema);


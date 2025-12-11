const mongoose = require('mongoose');

const storySchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    media: {
        url: { type: String, required: true },
        type: { type: String, enum: ['image', 'video'], default: 'image' },
    },
    caption: { type: String, default: '' },
    viewers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    expiresAt: { type: Date, required: true },
}, { timestamps: true });

storySchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });
storySchema.index({ createdAt: -1 });

module.exports = mongoose.model('SocialStory', storySchema);


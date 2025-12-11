const mongoose = require('mongoose');

const followSchema = new mongoose.Schema({
    followerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    targetUserId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    status: { type: String, enum: ['requested', 'accepted'], default: 'requested' },
}, { timestamps: true });

followSchema.index({ followerId: 1, targetUserId: 1 }, { unique: true });

module.exports = mongoose.model('SocialFollow', followSchema);


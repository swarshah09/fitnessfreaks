const mongoose = require('mongoose');

const dailyActivitySchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true,
    },
    date: {
        type: String, // YYYY-MM-DD
        required: true,
        index: true,
    },
    workout: {
        type: String,
        default: '',
        trim: true,
    },
    notes: {
        type: String,
        default: '',
        trim: true,
    },
    checkIn: {
        type: Boolean,
        default: false,
    },
}, {
    timestamps: true,
});

dailyActivitySchema.index({ userId: 1, date: 1 }, { unique: true });

const DailyActivity = mongoose.model('DailyActivity', dailyActivitySchema);

module.exports = DailyActivity;


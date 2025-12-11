const express = require('express');
const router = express.Router();
const checkAuth = require('../Middlewares/checkAuthToken');
const DailyActivity = require('../Models/DailyActivity');

const createResponse = (ok, message, data = null) => ({ ok, message, data });

// Normalize date to YYYY-MM-DD in UTC to avoid timezone drift
const todayKey = () => new Date().toISOString().slice(0, 10);

// Upsert today's activity (workout/notes/check-in). Past days cannot be modified/created.
router.post('/today', checkAuth, async (req, res) => {
    try {
        const { workout = '', notes = '', checkIn = false } = req.body || {};
        const date = todayKey();

        const payload = {
            workout: workout.trim(),
            notes: notes.trim(),
        };
        if (checkIn) payload.checkIn = true; // once true, stays true

        const entry = await DailyActivity.findOneAndUpdate(
            { userId: req.userId, date },
            { $set: payload, $setOnInsert: { userId: req.userId, date } },
            { new: true, upsert: true }
        );

        return res.json(createResponse(true, 'Activity saved', entry));
    } catch (err) {
        console.error('Error saving daily activity:', err);
        return res.status(500).json(createResponse(false, err.message || 'Failed to save activity'));
    }
});

// Get history (recent first). Default limit 30.
router.get('/', checkAuth, async (req, res) => {
    try {
        const limit = Math.min(parseInt(req.query.limit) || 30, 90);
        const entries = await DailyActivity.find({ userId: req.userId })
            .sort({ date: -1 })
            .limit(limit)
            .lean();

        return res.json(createResponse(true, 'Activity history', entries));
    } catch (err) {
        console.error('Error fetching daily activity:', err);
        return res.status(500).json(createResponse(false, err.message || 'Failed to fetch activity'));
    }
});

// Get streak computed server-side (consecutive check-ins up to today)
router.get('/streak', checkAuth, async (req, res) => {
    try {
        const entries = await DailyActivity.find({ userId: req.userId, checkIn: true }).select('date').lean();
        const dateSet = new Set(entries.map(e => e.date));

        let streak = 0;
        let cursor = new Date(todayKey());

        while (true) {
            const key = cursor.toISOString().slice(0, 10);
            if (dateSet.has(key)) {
                streak += 1;
                cursor.setDate(cursor.getDate() - 1);
            } else {
                break;
            }
        }

        return res.json(createResponse(true, 'Streak computed', { streak }));
    } catch (err) {
        console.error('Error computing streak:', err);
        return res.status(500).json(createResponse(false, err.message || 'Failed to compute streak'));
    }
});

module.exports = router;


const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require('socket.io');

const bodyParser = require('body-parser');
const cors = require('cors');
const PORT = process.env.PORT || 8000;
const cookieParser = require('cookie-parser');

const authRoutes = require('./Routes/Auth');
const calorieIntakeRoutes = require('./Routes/CalorieIntake');
const adminRoutes = require('./Routes/Admin');
const imageUploadRoutes = require('./Routes/imageUploadRoutes');
const sleepTrackRoutes = require('./Routes/SleepTrack');
const stepTrackRoutes = require('./Routes/StepTrack');
const weightTrackRoutes = require('./Routes/WeightTrack');
const waterTrackRoutes = require('./Routes/WaterTrack');
const workoutTrackRoutes = require('./Routes/WorkoutTrack');
const workoutRoutes = require('./Routes/WorkoutPlans');
const reportRoutes = require('./Routes/Report');
const exerciseRoutes = require('./Routes/Exercises');
const dailyActivityRoutes = require('./Routes/DailyActivity');
const recipeRoutes = require('./Routes/Recipes');
const socialProfileRoutes = require('./Routes/SocialProfile');
const socialFollowRoutes = require('./Routes/SocialFollow');
const socialPostsRoutes = require('./Routes/SocialPosts');
const socialNotificationsRoutes = require('./Routes/SocialNotifications');
const socialStoriesRoutes = require('./Routes/SocialStories');
const socialChatRoutes = require('./Routes/SocialChat');
const SocialMessage = require('./Models/SocialMessage');
const SocialFollow = require('./Models/SocialFollow');
const User = require('./Models/UserSchema');
const SocialChat = require('./Models/SocialChat');
console.log('Recipes routes imported');


require('dotenv').config();
require('./db')

app.use(bodyParser.json());
const allowedOrigins = [
    process.env.FRONTEND_URL || 'http://localhost:5173',
    'http://localhost:5173',
    'http://127.0.0.1:5173',
    'http://localhost:4173',
    'http://127.0.0.1:4173',
    'http://localhost:8080'
];

app.use(
    cors({
        origin: allowedOrigins,
        methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        allowedHeaders: ["Content-Type", "Authorization"],
        credentials: true,
    })
);
app.use(cookieParser());

// Socket.io setup
const io = new Server(server, {
    cors: {
        origin: allowedOrigins,
        credentials: true,
    },
});
app.set('io', io);

const onlineUsers = new Map(); // userId -> socketId

io.on('connection', (socket) => {
    const userId = socket.handshake.query.userId;
    if (userId) {
        onlineUsers.set(userId, socket.id);
        socket.join(userId);
        User.findByIdAndUpdate(userId, { $set: { lastSeen: new Date() } }).catch(() => {});
        // Mark undelivered messages to this user as delivered on connect
        SocialMessage.updateMany(
            { toUserId: userId, status: 'sent' },
            { $set: { status: 'delivered' } }
        ).catch(() => {});
    }

    socket.on('chat:message', async (payload) => {
        try {
            const { to, text, fromUserId, type = 'text', mediaUrl, caption, replyTo, forwardedFrom } = payload;
            if (!to || (!text && !mediaUrl) || !fromUserId) return;
            if (fromUserId !== userId) return;

            const targetUser = await User.findById(to).lean();
            if (!targetUser) return;
            if (targetUser.isPrivate) {
                const accepted = await SocialFollow.findOne({
                    followerId: fromUserId,
                    targetUserId: to,
                    status: 'accepted',
                }).lean();
                if (!accepted) return;
            }

            const msg = await SocialMessage.create({
                fromUserId,
                toUserId: to,
                text,
                type,
                mediaUrl,
                caption,
                replyTo,
                forwardedFrom,
            });
            await SocialChat.findOneAndUpdate(
                { participants: { $all: [fromUserId, to] } },
                {
                    $set: { lastMessage: msg._id, lastMessageAt: msg.createdAt },
                    $inc: { [`unreadCounts.${to}`]: 1 },
                    $setOnInsert: { participants: [fromUserId, to] },
                },
                { upsert: true }
            );
            const safeMsg = {
                _id: msg._id,
                fromUserId: msg.fromUserId,
                toUserId: msg.toUserId,
                text: msg.text,
                type: msg.type,
                mediaUrl: msg.mediaUrl,
                caption: msg.caption,
                replyTo: msg.replyTo,
                status: msg.status,
                createdAt: msg.createdAt,
            };
            io.to(to).emit('chat:message', safeMsg);
            io.to(fromUserId).emit('chat:message', safeMsg);
        } catch (err) {
            console.error('chat:message error', err);
        }
    });

    socket.on('chat:read', async ({ from }) => {
        if (!from || !userId) return;
        try {
            await SocialMessage.updateMany(
                { toUserId: userId, fromUserId: from, status: { $ne: 'read' } },
                { $set: { status: 'read' } }
            );
            await SocialChat.findOneAndUpdate(
                { participants: { $all: [userId, from] } },
                { $set: { [`unreadCounts.${userId}`]: 0 } }
            );
            io.to(from).emit('chat:read', { from: userId });
        } catch (err) {
            console.error('chat:read error', err);
        }
    });

    socket.on('chat:typing', ({ to, isTyping }) => {
        if (!to || !userId) return;
        io.to(to).emit('chat:typing', { from: userId, isTyping: !!isTyping });
    });

    socket.on('disconnect', () => {
        if (userId) {
            onlineUsers.delete(userId);
            User.findByIdAndUpdate(userId, { $set: { lastSeen: new Date() } }).catch(() => {});
        }
    });
});


app.use('/auth', authRoutes);
app.use('/calorieintake', calorieIntakeRoutes);
app.use('/admin', adminRoutes);
app.use('/image-upload', imageUploadRoutes);
app.use('/sleeptrack', sleepTrackRoutes);
app.use('/steptrack', stepTrackRoutes);
app.use('/weighttrack', weightTrackRoutes);
app.use('/watertrack', waterTrackRoutes);
app.use('/workouttrack', workoutTrackRoutes);
app.use('/workoutplans', workoutRoutes);
app.use('/report', reportRoutes);
app.use('/exercises', exerciseRoutes);
app.use('/daily-activity', dailyActivityRoutes);
app.use('/recipes', recipeRoutes);
app.use('/social', socialProfileRoutes);
app.use('/social/follow', socialFollowRoutes);
app.use('/social', socialPostsRoutes);
app.use('/social', socialNotificationsRoutes);
app.use('/social', socialStoriesRoutes);
app.use('/social', socialChatRoutes);
console.log('Recipes routes registered at /recipes');


app.get('/', (req, res) => {
    res.json({ message: 'The API is working' });
});


server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
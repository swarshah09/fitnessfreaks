const mongoose = require('mongoose')
require('dotenv').config();

// Optimized MongoDB connection with connection pooling
const mongoOptions = {
    dbName: process.env.DB_NAME,
    maxPoolSize: 10, // Maintain up to 10 socket connections
    serverSelectionTimeoutMS: 5000, // Keep trying to send operations for 5 seconds
    socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
    // bufferCommands defaults to true, allowing Mongoose to buffer commands until connection is ready
    // This prevents errors when routes try to use models before connection is established
};

// Connect to MongoDB and return a promise
async function connectDB() {
    try {
        if (mongoose.connection.readyState === 1) {
            console.log('Database already connected');
            return Promise.resolve();
        }
        
        await mongoose.connect(process.env.MONGO_URL, mongoOptions);
        console.log('Connected to database');
        return Promise.resolve();
    } catch (err) {
        console.error('Error connecting to database:', err);
        return Promise.reject(err);
    }
}

// Handle connection events for better performance monitoring
mongoose.connection.on('connected', () => {
    console.log('MongoDB connected');
});

mongoose.connection.on('error', (err) => {
    console.error('MongoDB connection error:', err);
});

mongoose.connection.on('disconnected', () => {
    console.log('MongoDB disconnected');
});

// Export the connection function
module.exports = connectDB;
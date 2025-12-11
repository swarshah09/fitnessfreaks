const express = require('express');
const router = express.Router();
const Admin = require('../Models/AdminSchema'); // Import the Admin model
const User = require('../Models/UserSchema');
const Workout = require('../Models/WorkoutSchema');
const bcrypt = require('bcryptjs');
const errorHandler = require('../Middlewares/errorMiddleware');
const adminTokenHandler = require('../Middlewares/checkAdminToken');

const jwt = require('jsonwebtoken');

function createResponse(ok, message, data) {
    return {
        ok,
        message,
        data,
    };
}

router.post('/register', async (req, res, next) => {
    try {
        const { name, email, password } = req.body;

        // Check if the admin with the same email already exists
        const existingAdmin = await Admin.findOne({ email });

        if (existingAdmin) {
            return res.status(409).json(createResponse(false, 'Admin with this email already exists'));
        }

        // Hash the admin's password before saving it to the database


        const newAdmin = new Admin({
            name,
            email,
            password
        });

        await newAdmin.save(); // Await the save operation

        res.status(201).json(createResponse(true, 'Admin registered successfully'));
    } catch (err) {
        // Pass the error to the error middleware
        next(err);
    }
});


router.post('/login', async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const admin = await Admin.findOne({ email });

        if (!admin) {
            return res.status(400).json(createResponse(false, 'Invalid admin credentials'));
        }

        const isMatch = await bcrypt.compare(password, admin.password);
        if (!isMatch) {
            return res.status(400).json(createResponse(false, 'Invalid admin credentials'));
        }

        // Generate an authentication token for the admin
        const adminAuthToken = jwt.sign({ adminId: admin._id }, process.env.JWT_ADMIN_SECRET_KEY, { expiresIn: '24h' });

        res.cookie('adminAuthToken', adminAuthToken, { httpOnly: true });
        res.status(200).json(createResponse(true, 'Admin login successful', { 
            adminAuthToken,
            admin: {
                id: admin._id,
                name: admin.name,
                email: admin.email
            }
        }));
    } catch (err) {
        next(err);
    }
});



router.get('/checklogin', adminTokenHandler, async (req, res) => {
    res.json({
        adminId: req.adminId,
        ok: true,
        message: 'Admin authenticated successfully'
    })
});

// User Management Endpoints
router.get('/users', adminTokenHandler, async (req, res) => {
    try {
        const users = await User.find({}).select('-password');
        res.json(createResponse(true, 'Users fetched successfully', users));
    } catch (err) {
        res.status(500).json(createResponse(false, err.message));
    }
});

router.get('/users/:id', adminTokenHandler, async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select('-password');
        if (!user) {
            return res.status(404).json(createResponse(false, 'User not found'));
        }
        res.json(createResponse(true, 'User fetched successfully', user));
    } catch (err) {
        res.status(500).json(createResponse(false, err.message));
    }
});

router.delete('/users/:id', adminTokenHandler, async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id);
        if (!user) {
            return res.status(404).json(createResponse(false, 'User not found'));
        }
        res.json(createResponse(true, 'User deleted successfully'));
    } catch (err) {
        res.status(500).json(createResponse(false, err.message));
    }
});

router.put('/users/:id', adminTokenHandler, async (req, res) => {
    try {
        const { name, email, goal, activityLevel } = req.body;
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json(createResponse(false, 'User not found'));
        }
        
        if (name) user.name = name;
        if (email) user.email = email;
        if (goal) user.goal = goal;
        if (activityLevel) user.activityLevel = activityLevel;
        
        await user.save();
        res.json(createResponse(true, 'User updated successfully', user));
    } catch (err) {
        res.status(500).json(createResponse(false, err.message));
    }
});

// Workout Management Endpoints (already exist but ensuring they're here)
router.get('/workouts', adminTokenHandler, async (req, res) => {
    try {
        const workouts = await Workout.find({});
        res.json(createResponse(true, 'Workouts fetched successfully', workouts));
    } catch (err) {
        res.status(500).json(createResponse(false, err.message));
    }
});

router.get('/workouts/:id', adminTokenHandler, async (req, res) => {
    try {
        const workout = await Workout.findById(req.params.id);
        if (!workout) {
            return res.status(404).json(createResponse(false, 'Workout not found'));
        }
        res.json(createResponse(true, 'Workout fetched successfully', workout));
    } catch (err) {
        res.status(500).json(createResponse(false, err.message));
    }
});

router.post('/workouts', adminTokenHandler, async (req, res) => {
    try {
        const { name, description, durationInMinutes, exercises, imageURL } = req.body;
        const workout = new Workout({
            name,
            description,
            durationInMinutes,
            exercises,
            imageURL,
        });
        await workout.save();
        res.json(createResponse(true, 'Workout created successfully', workout));
    } catch (err) {
        res.status(500).json(createResponse(false, err.message));
    }
});

router.put('/workouts/:id', adminTokenHandler, async (req, res) => {
    try {
        const workout = await Workout.findById(req.params.id);
        if (!workout) {
            return res.status(404).json(createResponse(false, 'Workout not found'));
        }
        const { name, description, durationInMinutes, exercises, imageURL } = req.body;
        if (name) workout.name = name;
        if (description) workout.description = description;
        if (durationInMinutes) workout.durationInMinutes = durationInMinutes;
        if (exercises) workout.exercises = exercises;
        if (imageURL) workout.imageURL = imageURL;
        await workout.save();
        res.json(createResponse(true, 'Workout updated successfully', workout));
    } catch (err) {
        res.status(500).json(createResponse(false, err.message));
    }
});

router.delete('/workouts/:id', adminTokenHandler, async (req, res) => {
    try {
        const workout = await Workout.findByIdAndDelete(req.params.id);
        if (!workout) {
            return res.status(404).json(createResponse(false, 'Workout not found'));
        }
        res.json(createResponse(true, 'Workout deleted successfully'));
    } catch (err) {
        res.status(500).json(createResponse(false, err.message));
    }
});

// Statistics Endpoint
router.get('/stats', adminTokenHandler, async (req, res) => {
    try {
        const totalUsers = await User.countDocuments();
        const totalWorkouts = await Workout.countDocuments();
        
        // Get users registered in last 30 days
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        const recentUsers = await User.countDocuments({ createdAt: { $gte: thirtyDaysAgo } });
        
        res.json(createResponse(true, 'Statistics fetched successfully', {
            totalUsers,
            totalWorkouts,
            recentUsers
        }));
    } catch (err) {
        res.status(500).json(createResponse(false, err.message));
    }
});

router.use(errorHandler)

module.exports = router;
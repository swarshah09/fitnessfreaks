// authRoutes.js

const express = require('express');
const router = express.Router();
const User = require('../Models/UserSchema');
const errorHandler = require('../Middlewares/errorMiddleware');
const authTokenHandler = require('../Middlewares/checkAuthToken');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');
const { authCookieOptions, refreshCookieOptions, baseCookieOptions } = require('../utils/cookieOptions');

//ardo snju okez dpwp
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'sswar3939@gmail.com',
        pass: 'lylthahyxjuyzyhn'
    }
});

const sanitizeUser = (user) => {
    if (!user) return null;
    const userObj = user.toObject ? user.toObject() : { ...user };
    delete userObj.password;
    return userObj;
};

const normalizeEmail = (email = '') => email.trim().toLowerCase();

function validateRegistrationPayload(payload) {
    const {
        name,
        email,
        password,
        weightInKg,
        heightInCm,
        gender,
        dob,
        goal,
        activityLevel,
    } = payload;

    if (!name?.trim()) return 'Name is required';
    if (!email) return 'Email is required';
    if (!password || password.length < 6) return 'Password must be at least 6 characters';
    if (!Number.isFinite(weightInKg) || weightInKg <= 0) return 'Weight must be a positive number';
    if (!Number.isFinite(heightInCm) || heightInCm <= 0) return 'Height must be a positive number';
    if (!gender) return 'Gender is required';
    if (!dob) return 'Date of birth is required';
    if (!goal) return 'Goal is required';
    if (!activityLevel) return 'Activity level is required';
    return null;
}

router.get('/test', async (req, res) => {
    res.json({
        message: "Auth api is working"
    });
});

function createResponse(ok, message, data) {
    return {
        ok,
        message,
        data,
    };
}

router.get('/user', authTokenHandler, async (req, res) => {
    try {
        const user = await User.findById(req.userId).lean();
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        delete user.password;
        res.status(200).json(user);
    } catch (error) {
        console.error('Error fetching user details:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

router.post('/register', async (req, res, next) => {
    try {
        const {
            name,
            email,
            password,
            weightInKg,
            heightInCm,
            gender,
            dob,
            goal,
            activityLevel
        } = req.body;

        const normalizedEmail = normalizeEmail(email || '');
        const numericWeight = Number(weightInKg);
        const numericHeight = Number(heightInCm);

        const validationError = validateRegistrationPayload({
            name,
            email: normalizedEmail,
            password,
            weightInKg: numericWeight,
            heightInCm: numericHeight,
            gender,
            dob,
            goal,
            activityLevel,
        });

        if (validationError) {
            return res.status(400).json(createResponse(false, validationError));
        }

        const existingUser = await User.findOne({ email: normalizedEmail });

        if (existingUser) {
            return res.status(409).json(createResponse(false, 'Email already exists'));
        }
        const newUser = new User({
            name: name.trim(),
            password,
            email: normalizedEmail,
            weight: [
                {
                    weight: numericWeight,
                    unit: "kg",
                    date: new Date()
                }
            ],
            height: [
                {
                    height: numericHeight,
                    date: new Date(),
                    unit: "cm"
                }
            ],
            gender,
            dob,
            goal,
            activityLevel
        });
        await newUser.save();

        res.status(201).json(createResponse(true, 'User registered successfully', {
            user: sanitizeUser(newUser)
        }));

    }
    catch (err) {
        next(err);
    }
});

router.post('/login', async (req, res, next) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json(createResponse(false, 'Email and password are required'));
        }

        const user = await User.findOne({ email: normalizeEmail(email) });
        if (!user) {
            return res.status(400).json(createResponse(false, 'Invalid credentials'));
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json(createResponse(false, 'Invalid credentials'));
        }

        const authToken = jwt.sign({ userId: user._id }, process.env.JWT_SECRET_KEY, { expiresIn: '50m' });
        const refreshToken = jwt.sign({ userId: user._id }, process.env.JWT_REFRESH_SECRET_KEY, { expiresIn: '100m' });

        res.cookie('authToken', authToken, authCookieOptions);
        res.cookie('refreshToken', refreshToken, refreshCookieOptions);
        res.status(200).json(createResponse(true, 'Login successful', {
            authToken,
            refreshToken,
            user: sanitizeUser(user)
        }));
    }
    catch (err) {
        next(err);
    }
});

router.post('/sendotp', async (req, res, next) => {
    try {
        const { email } = req.body;
        const otp = Math.floor(100000 + Math.random() * 900000);

        const mailOptions = {
            from: 'virajj014@gmail.com',
            to: email,
            subject: 'OTP for verification',
            text: `Your OTP is ${otp}`
        };

        transporter.sendMail(mailOptions, async (err, info) => {
            if (err) {
                console.log(err);
                res.status(500).json(createResponse(false, err.message));
            } else {
                res.json(createResponse(true, 'OTP sent successfully', { otp }));
            }
        });
    }
    catch (err) {
        next(err);
    }
});

router.post('/checklogin', authTokenHandler, async (req, res, next) => {
    res.json({
        ok: true,
        message: 'User authenticated successfully'
    });
});

// Logout - clear auth cookies
router.post('/logout', async (req, res) => {
    try {
        res.clearCookie('authToken', baseCookieOptions);
        res.clearCookie('refreshToken', baseCookieOptions);
        return res.status(200).json(createResponse(true, 'Logged out successfully'));
    } catch (err) {
        return res.status(500).json(createResponse(false, 'Failed to logout'));
    }
});

router.use(errorHandler);

module.exports = router;

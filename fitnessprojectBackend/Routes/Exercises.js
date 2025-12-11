const express = require('express');
const router = express.Router();
const errorHandler = require('../Middlewares/errorMiddleware');
const authTokenHandler = require('../Middlewares/checkAuthToken');

// Import exercise data (we'll create this as a JSON file or keep it in the route)
// For now, we'll serve it directly. In production, you might want to store this in a database

function createResponse(ok, message, data) {
    return {
        ok,
        message,
        data,
    };
}

// Get all muscle groups
router.get('/muscle-groups', authTokenHandler, async (req, res) => {
    try {
        // This will be populated from the frontend data file
        // For now, return the structure
        const muscleGroups = [
            { id: 'chest', name: 'Chest' },
            { id: 'abs', name: 'Abs' },
            { id: 'shoulders', name: 'Shoulders' },
            { id: 'biceps', name: 'Biceps' },
            { id: 'triceps', name: 'Triceps' },
            { id: 'back', name: 'Back' },
            { id: 'legs', name: 'Legs' },
            { id: 'abductors', name: 'Abductors' },
            { id: 'adductors', name: 'Adductors' },
            { id: 'neck', name: 'Neck' },
        ];
        
        res.json(createResponse(true, 'Muscle groups retrieved successfully', muscleGroups));
    } catch (err) {
        res.status(500).json(createResponse(false, 'Error fetching muscle groups', null));
    }
});

// Get exercises by muscle group
router.get('/muscle-group/:groupId', authTokenHandler, async (req, res) => {
    try {
        const { groupId } = req.params;
        
        // In a real implementation, you would fetch from database
        // For now, we'll return a message indicating the frontend should use its data file
        res.json(createResponse(true, `Exercises for ${groupId}`, {
            message: 'Exercise data is served from frontend data file. Use the exercises.ts file.',
            muscleGroupId: groupId
        }));
    } catch (err) {
        res.status(500).json(createResponse(false, 'Error fetching exercises', null));
    }
});

// Get single exercise by ID
router.get('/:exerciseId', authTokenHandler, async (req, res) => {
    try {
        const { exerciseId } = req.params;
        
        res.json(createResponse(true, `Exercise ${exerciseId}`, {
            message: 'Exercise data is served from frontend data file. Use the exercises.ts file.',
            exerciseId: exerciseId
        }));
    } catch (err) {
        res.status(500).json(createResponse(false, 'Error fetching exercise', null));
    }
});

router.use(errorHandler);

module.exports = router;


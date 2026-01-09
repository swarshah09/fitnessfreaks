const express = require('express');
const router = express.Router();
const User = require('../Models/UserSchema');
const authTokenHandler = require('../Middlewares/checkAuthToken');

function createResponse(ok, message, data) {
    return {
        ok,
        message,
        data
    };
}

// Optimized dashboard endpoint - combines all dashboard data in one API call
router.get('/summary', authTokenHandler, async (req, res) => {
    try {
        const userId = req.userId;
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);
        
        // Fetch only necessary fields for dashboard
        const user = await User.findById(userId).select(
            'calorieIntake sleep steps water workouts weight height gender dob goal activityLevel'
        ).lean();

        if (!user) {
            return res.status(404).json(createResponse(false, 'User not found', null));
        }

        // Calculate today's metrics using optimized date filtering
        let calorieIntake = 0;
        let protein = 0;
        let carbs = 0;
        
        const todayCalories = user.calorieIntake?.filter(entry => {
            const entryDate = new Date(entry.date);
            return entryDate >= today && entryDate < tomorrow;
        }) || [];
        
        todayCalories.forEach(entry => {
            calorieIntake += entry.calorieIntake || 0;
            protein += entry.protein || 0;
            carbs += entry.carbs || 0;
        });

        let sleep = 0;
        const todaySleep = user.sleep?.filter(entry => {
            const entryDate = new Date(entry.date);
            return entryDate >= today && entryDate < tomorrow;
        }) || [];
        
        if (todaySleep.length > 0) {
            sleep = todaySleep.reduce((sum, entry) => sum + (entry.durationInHrs || 0), 0) / todaySleep.length;
        }

        let water = 0;
        const todayWater = user.water?.filter(entry => {
            const entryDate = new Date(entry.date);
            return entryDate >= today && entryDate < tomorrow;
        }) || [];
        
        water = todayWater.reduce((sum, entry) => sum + (entry.amountInMilliliters || 0), 0);

        let steps = 0;
        const todaySteps = user.steps?.filter(entry => {
            const entryDate = new Date(entry.date);
            return entryDate >= today && entryDate < tomorrow;
        }) || [];
        
        steps = todaySteps.reduce((sum, entry) => sum + (entry.steps || 0), 0);

        // Get latest weight and height
        const sortedWeight = [...(user.weight || [])].sort((a, b) => new Date(b.date) - new Date(a.date));
        const sortedHeight = [...(user.height || [])].sort((a, b) => new Date(b.date) - new Date(a.date));
        const currentWeight = sortedWeight.length > 0 ? sortedWeight[0].weight : null;
        const currentHeight = sortedHeight.length > 0 ? sortedHeight[0].height : null;

        // Calculate this week's workouts
        const weekAgo = new Date(today);
        weekAgo.setDate(weekAgo.getDate() - 7);
        
        const weekWorkouts = user.workouts?.filter(entry => {
            const entryDate = new Date(entry.date);
            return entryDate >= weekAgo && entryDate < tomorrow;
        }) || [];
        const workoutCount = weekWorkouts.length;

        // Calculate goal calories (BMR calculation)
        let maxCalorieIntake = 0;
        let goalWater = 4000;
        let goalSleep = 8;
        
        if (currentHeight && currentWeight) {
            const heightInCm = parseFloat(currentHeight);
            const weightInKg = parseFloat(currentWeight);
            const age = new Date().getFullYear() - new Date(user.dob).getFullYear();
            let BMR = 0;
            
            if (user.gender === 'male') {
                BMR = 88.362 + (13.397 * weightInKg) + (4.799 * heightInCm) - (5.677 * age);
            } else {
                BMR = 447.593 + (9.247 * weightInKg) + (3.098 * heightInCm) - (4.330 * age);
            }
            
            // Activity multiplier
            const activityMultipliers = {
                sedentary: 1.2,
                light: 1.375,
                moderate: 1.55,
                active: 1.725,
                extra: 1.9
            };
            const multiplier = activityMultipliers[user.activityLevel] || 1.2;
            const TDEE = BMR * multiplier;
            
            if (user.goal === 'weightLoss') {
                maxCalorieIntake = Math.round(TDEE - 500);
            } else if (user.goal === 'weightGain') {
                maxCalorieIntake = Math.round(TDEE + 500);
            } else {
                maxCalorieIntake = Math.round(TDEE);
            }
        }

        // Calculate streak (simplified - checks last 7 days)
        let streak = 0;
        const datesWithActivity = new Set();
        
        [...(user.calorieIntake || []), ...(user.sleep || []), ...(user.steps || []), ...(user.water || []), ...(user.workouts || [])]
            .forEach(entry => {
                const entryDate = new Date(entry.date);
                if (entryDate >= weekAgo && entryDate < tomorrow) {
                    const dateStr = entryDate.toISOString().split('T')[0];
                    datesWithActivity.add(dateStr);
                }
            });
        
        streak = datesWithActivity.size;

        const dashboardData = {
            calories: {
                total: Math.round(calorieIntake),
                goal: maxCalorieIntake,
                protein: Math.round(protein),
                carbs: Math.round(carbs),
            },
            water: {
                total: water,
                goal: goalWater,
            },
            sleep: {
                total: Math.round(sleep * 10) / 10,
                goal: goalSleep,
            },
            steps: {
                total: steps,
                goal: 10000,
            },
            weight: {
                current: currentWeight,
                goal: null, // Can be set separately
            },
            workouts: {
                count: workoutCount,
                thisWeek: workoutCount,
            },
            streak: streak,
            height: currentHeight,
        };

        res.json(createResponse(true, 'Dashboard data retrieved successfully', dashboardData));
    } catch (error) {
        console.error('Dashboard summary error:', error);
        res.status(500).json(createResponse(false, 'Error fetching dashboard data', null));
    }
});

module.exports = router;

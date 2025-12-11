const express = require('express');
const router = express.Router();
const authTokenHandler = require('../Middlewares/checkAuthToken');
const jwt = require('jsonwebtoken');
const errorHandler = require('../Middlewares/errorMiddleware');
const request = require('request');
//from node.js if you want to call some other API for that we use request module
//for ex. we are going to use nutrition api inside node.js 
const User = require('../Models/UserSchema');
require('dotenv').config();


function createResponse(ok, message, data) {
    return {
        ok,
        message,
        data,
    };
}


router.get('/test', authTokenHandler, async (req, res) => {
    res.json(createResponse(true, 'Test API works for calorie intake report'));
});


//below all are the API's which we are going to use for calorie intake 
router.post('/addcalorieintake', authTokenHandler, async (req, res) => {
    try {
        const { item, date, quantity, quantitytype } = req.body;
        if (!item || !date || !quantity || !quantitytype) {
            return res.status(400).json(createResponse(false, 'Please provide all the details'));
        }

        // Validate quantity is a number
        const parsedQuantity = parseFloat(quantity);
        if (isNaN(parsedQuantity) || parsedQuantity <= 0) {
            return res.status(400).json(createResponse(false, 'Invalid quantity. Please provide a valid positive number'));
        }

        // Calculate qtyingrams based on quantity type
        let qtyingrams = 0;
        if (quantitytype === 'g') {
            qtyingrams = parsedQuantity;
        } else if (quantitytype === 'kg') {
            qtyingrams = parsedQuantity * 1000;
        } else if (quantitytype === 'ml') {
            qtyingrams = parsedQuantity;
        } else if (quantitytype === 'l') {
            qtyingrams = parsedQuantity * 1000;
        } else {
            return res.status(400).json(createResponse(false, 'Invalid quantity type'));
        }

        if (isNaN(qtyingrams) || qtyingrams <= 0) {
            return res.status(400).json(createResponse(false, 'Invalid quantity calculation'));
        }

        // Use Edamam Nutrition Analysis via RapidAPI
        const rapidApiKey = process.env.RAPIDAPI_KEY;
        if (!rapidApiKey) {
            return res.status(500).json(createResponse(false, 'Nutrition API key not configured. Please contact administrator.'));
        }

        // Build query string for Edamam Nutrition Analysis API (RapidAPI)
        // Format: ingr=100g apple with nutrition-type=cooking
        const ingrText = `${qtyingrams}g ${item}`;
        const apiUrl = `https://edamam-edamam-nutrition-analysis.p.rapidapi.com/api/nutrition-data?nutrition-type=cooking&ingr=${encodeURIComponent(ingrText)}`;

        console.log('Calling Edamam RapidAPI for:', item, 'Quantity:', qtyingrams, 'g');
        console.log('Query text:', ingrText);

        request.get({
            url: apiUrl,
            headers: {
                'Accept': 'application/json',
                'X-RapidAPI-Key': rapidApiKey.trim(),
                'X-RapidAPI-Host': 'edamam-edamam-nutrition-analysis.p.rapidapi.com',
            },
        }, async function (error, response, body) {
            if (error) {
                return res.status(500).json(createResponse(false, 'Error fetching nutrition data: ' + error.message));
            }
            
            if (response.statusCode !== 200) {
                let errorMessage = `Nutrition API error: ${response.statusCode}`;
                try {
                    const errorBody = JSON.parse(body);
                    if (errorBody.message) {
                        errorMessage = errorBody.message;
                    } else if (errorBody.error) {
                        errorMessage = errorBody.error;
                    }
                    console.error('Edamam RapidAPI Error Response:', errorBody);
                } catch (e) {
                    console.error('Edamam RapidAPI Error Body (raw):', body);
                }
                return res.status(response.statusCode).json(createResponse(false, errorMessage));
            }
            
            try {
                const nutritionData = JSON.parse(body);
                
                // Validate API response structure
                if (!nutritionData || typeof nutritionData.calories === 'undefined') {
                    return res.status(400).json(createResponse(false, 'No nutrition data found for this food item. Please try a more specific item name (e.g., "chicken breast" instead of "chicken").'));
                }
                
                const calories = parseFloat(nutritionData.calories);
                
                // Validate calories
                if (isNaN(calories) || calories < 0) {
                    return res.status(400).json(createResponse(false, 'Invalid nutrition data received. Please try a different food item.'));
                }
                
                // Extract detailed nutrition information
                const totalNutrients = nutritionData.totalNutrients || {};
                
                const protein = totalNutrients.PROCNT?.quantity || 0;
                const carbs = totalNutrients.CHOCDF?.quantity || 0;
                const fat = totalNutrients.FAT?.quantity || 0;
                const fiber = totalNutrients.FIBTG?.quantity || 0;
                const sugar = totalNutrients.SUGAR?.quantity || 0;
                const sodium = totalNutrients.NA?.quantity ? totalNutrients.NA.quantity / 1000 : 0; // mg to g
                
                const calorieIntake = Math.round(calories);
                
                if (isNaN(calorieIntake) || !isFinite(calorieIntake) || calorieIntake < 0) {
                    return res.status(400).json(createResponse(false, 'Error calculating calories. Please check your input values.'));
                }
                
                const userId = req.userId;
                const user = await User.findOne({ _id: userId });
                if (!user) {
                    return res.status(404).json(createResponse(false, 'User not found'));
                }
                
                // Store comprehensive nutrition data
                user.calorieIntake.push({
                    item,
                    date: new Date(date),
                    quantity: parsedQuantity,
                    quantitytype,
                    calorieIntake: calorieIntake,
                    protein: Math.round(protein * 10) / 10,
                    carbs: Math.round(carbs * 10) / 10,
                    fat: Math.round(fat * 10) / 10,
                    fiber: Math.round(fiber * 10) / 10,
                    sugar: Math.round(sugar * 10) / 10,
                    sodium: Math.round(sodium * 10) / 10,
                });
                
                await user.save();
                res.json(createResponse(true, 'Calorie intake added successfully', {
                    calories: calorieIntake,
                    protein: Math.round(protein * 10) / 10,
                    carbs: Math.round(carbs * 10) / 10,
                    fat: Math.round(fat * 10) / 10,
                }));
            } catch (parseError) {
                console.error('Error parsing nutrition data:', parseError);
                return res.status(500).json(createResponse(false, 'Error processing nutrition data: ' + parseError.message));
            }
        });
    } catch (err) {
    
        res.status(500).json(createResponse(false, err.message));
    }
});



router.post('/getcalorieintakebydate', authTokenHandler, async (req, res) => {
    const { date } = req.body;
    const userId = req.userId; // getting the user id from the authtokenhandler 
    const user = await User.findById({ _id: userId });// fing the user with that id 
    if (!date) {
        let date = new Date();   // sept 1 2021 12:00:00
        user.calorieIntake = filterEntriesByDate(user.calorieIntake, date);

        return res.json(createResponse(true, 'Calorie intake for today', user.calorieIntake));
    }
    user.calorieIntake = filterEntriesByDate(user.calorieIntake, new Date(date));
    // if date is provided you are going to simply going to send that date for comparision
    res.json(createResponse(true, 'Calorie intake for the date', user.calorieIntake));// The response 

})

router.post('/getcalorieintakebylimit', authTokenHandler, async (req, res) => {
    const { limit } = req.body;
    const userId = req.userId;
    const user = await User.findById({ _id: userId });
    if (!limit) {
        return res.status(400).json(createResponse(false, 'Please provide limit'));
    } else if (limit === 'all') {
        return res.json(createResponse(true, 'Calorie intake', user.calorieIntake));
    }
    else {
        let date = new Date();
        let currentDate = new Date(date.setDate(date.getDate() - parseInt(limit))).getTime();

        user.calorieIntake = user.calorieIntake.filter((item) => {
            return new Date(item.date).getTime() >= currentDate;
        })
        return res.json(createResponse(true, `Calorie intake for the last ${limit} days`, user.calorieIntake));
    }
})

router.delete('/deletecalorieintake', authTokenHandler, async (req, res) => {
        const { item, date } = req.body;
        if (!item || !date) {
            return res.status(400).json(createResponse(false, 'Please provide all the details'));
        }

        const userId = req.userId;
        const user = await User.findById({ _id: userId });

        user.calorieIntake = user.calorieIntake.filter((entry) => {
            return entry.date.toString() != new Date(date).toString(); //apply this is every api where we have user delete function
        })
        await user.save();
        res.json(createResponse(true, 'Calorie intake deleted successfully'));

})

router.get('/getgoalcalorieintake', authTokenHandler, async (req, res) => {
        const userId = req.userId;
        const user = await User.findById({ _id: userId });
        let maxCalorieIntake = 0;
        let heightInCm = parseFloat(user.height[user.height.length - 1].height);
        let weightInKg = parseFloat(user.weight[user.weight.length - 1].weight);
        let age = new Date().getFullYear() - new Date(user.dob).getFullYear();
        let BMR = 0;
        let gender = user.gender;
        if (gender == 'male') {
            BMR = 88.362 + (13.397 * weightInKg) + (4.799 * heightInCm) - (5.677 * age)

        }
        else if (gender == 'female') {
            BMR = 447.593 + (9.247 * weightInKg) + (3.098 * heightInCm) - (4.330 * age)

        }
        else {
            BMR = 447.593 + (9.247 * weightInKg) + (3.098 * heightInCm) - (4.330 * age)
        }
        if (user.goal == 'weightLoss') {
            maxCalorieIntake = BMR - 500;
        }
        else if (user.goal == 'weightGain') {
            maxCalorieIntake = BMR + 500;
        }
        else {
            maxCalorieIntake = BMR;
        }

        res.json(createResponse(true, 'max calorie intake', { maxCalorieIntake }));

})

    function filterEntriesByDate(entries, targetDate) {
        return entries.filter(entry => {
            const entryDate = new Date(entry.date);//getting the date of the calorie intake object 
            //comparing the dates to see if they match 
            return (
                entryDate.getDate() === targetDate.getDate() &&
                entryDate.getMonth() === targetDate.getMonth() &&
                entryDate.getFullYear() === targetDate.getFullYear()
            );
        });
    }
    module.exports = router;
const express = require('express');
const router = express.Router();
const request = require('request');

const createResponse = (ok, message, data = null) => ({ ok, message, data });

console.log('Recipes route loaded');

// Test endpoint
router.get('/test', (req, res) => {
    return res.json(createResponse(true, 'Recipes route is working'));
});

// Fetch recipes from Muscle & Strength website
// Note: Due to CORS and scraping limitations, we'll return curated recipes
// In production, you might want to use a proper API or scrape with a service
router.get('/', async (req, res) => {
    try {
        const { page = 1, limit = 20 } = req.query;
        
        // Return curated recipes from Muscle & Strength
        const recipes = getFallbackRecipes();
        
        // Apply pagination
        const startIndex = (parseInt(page) - 1) * parseInt(limit);
        const endIndex = startIndex + parseInt(limit);
        const paginatedRecipes = recipes.slice(startIndex, endIndex);

        return res.json(createResponse(true, 'Recipes fetched successfully', {
            recipes: paginatedRecipes,
            total: recipes.length,
            page: parseInt(page),
            limit: parseInt(limit),
            totalPages: Math.ceil(recipes.length / parseInt(limit))
        }));

    } catch (err) {
        console.error('Error fetching recipes:', err);
        const fallbackRecipes = getFallbackRecipes();
        return res.json(createResponse(true, 'Recipes fetched', {
            recipes: fallbackRecipes,
            total: fallbackRecipes.length,
            page: 1,
            limit: 20,
            totalPages: 1
        }));
    }
});

// Get a single recipe details
router.get('/:recipeId', async (req, res) => {
    try {
        const { recipeId } = req.params;
        const recipes = getFallbackRecipes();
        const recipe = recipes.find(r => r.id === recipeId);
        
        if (!recipe) {
            return res.status(404).json(createResponse(false, 'Recipe not found'));
        }

        return res.json(createResponse(true, 'Recipe fetched successfully', recipe));
    } catch (err) {
        console.error('Error fetching recipe details:', err);
        return res.status(500).json(createResponse(false, 'Failed to fetch recipe details'));
    }
});

// Health check endpoint
router.get('/health', (req, res) => {
    return res.json(createResponse(true, 'Recipes service is healthy'));
});

// Curated recipes from Muscle & Strength
function getFallbackRecipes() {
    return [
        {
            id: "high-protein-chicken-rice",
            title: "High Protein Chicken and Rice",
            link: "https://www.youtube.com/watch?v=rANPCqOvYdc",
            image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=900&q=80",
            description: "A simple, high-protein meal perfect for muscle building. This classic combination provides all the essential amino acids your body needs for recovery and growth.",
            meta: "High Protein • Main Course",
            category: "Main Course",
            isVeg: false,
            calories: 450,
            protein: 45,
            carbs: 50,
            fat: 8
        },
        {
            id: "protein-pancakes",
            title: "Protein Pancakes",
            link: "https://www.youtube.com/watch?v=EyFcGkeL_kA",
            image: "https://images.unsplash.com/photo-1587731556938-38755b4803a6?auto=format&fit=crop&w=900&q=80",
            description: "Fluffy pancakes packed with protein. Start your day right with this delicious breakfast that fuels your muscles and satisfies your sweet tooth.",
            meta: "Breakfast • High Protein",
            category: "Breakfast",
            isVeg: true,
            calories: 320,
            protein: 35,
            carbs: 30,
            fat: 5
        },
        {
            id: "greek-yogurt-parfait",
            title: "Greek Yogurt Parfait",
            link: "https://www.youtube.com/watch?v=INTTHoPR60g",
            image: "https://images.unsplash.com/photo-1505253216365-4f5a1c7c1e0f?auto=format&fit=crop&w=900&q=80",
            description: "Delicious and protein-rich breakfast option. Layer Greek yogurt with fresh berries and granola for a nutritious start to your day.",
            meta: "Breakfast • High Protein",
            category: "Breakfast",
            isVeg: true,
            calories: 280,
            protein: 25,
            carbs: 35,
            fat: 4
        },
        {
            id: "lean-beef-stir-fry",
            title: "Lean Beef Stir Fry",
            link: "https://www.youtube.com/watch?v=Nhk6CkkPiRs",
            image: "https://images.unsplash.com/photo-1604908177446-009c037c0959?auto=format&fit=crop&w=900&q=80",
            description: "Quick and easy stir fry loaded with protein and vegetables. Perfect for post-workout recovery.",
            meta: "Main Course • High Protein",
            category: "Main Course",
            isVeg: false,
            calories: 380,
            protein: 40,
            carbs: 25,
            fat: 12
        },
        {
            id: "salmon-sweet-potato",
            title: "Baked Salmon with Sweet Potato",
            link: "https://www.youtube.com/watch?v=H4TSJsSMPwc",
            image: "https://images.unsplash.com/photo-1612874472278-5c1f9b5f7c54?auto=format&fit=crop&w=900&q=80",
            description: "Omega-3 rich salmon paired with complex carbs. Ideal for muscle recovery and overall health.",
            meta: "Main Course • High Protein",
            category: "Main Course",
            isVeg: false,
            calories: 420,
            protein: 38,
            carbs: 45,
            fat: 10
        },
        {
            id: "protein-smoothie",
            title: "Post-Workout Protein Smoothie",
            link: "https://www.youtube.com/watch?v=INTTHoPR60g",
            image: "https://images.unsplash.com/photo-1464306076886-da185f6a9d05?auto=format&fit=crop&w=900&q=80",
            description: "Refuel after training with this delicious protein-packed smoothie. Quick to make and perfect for recovery.",
            meta: "Smoothie • Post-Workout",
            category: "Smoothie",
            isVeg: true,
            calories: 250,
            protein: 30,
            carbs: 20,
            fat: 3
        },
        {
            id: "turkey-meatballs",
            title: "Turkey Meatballs",
            link: "https://www.youtube.com/watch?v=eg7absDxZTs",
            image: "https://images.unsplash.com/photo-1604908177524-4024b0f06d8b?auto=format&fit=crop&w=900&q=80",
            description: "Lean turkey meatballs that are high in protein and low in fat. Great for meal prep.",
            meta: "Main Course • High Protein",
            category: "Main Course",
            isVeg: false,
            calories: 290,
            protein: 35,
            carbs: 15,
            fat: 8
        },
        {
            id: "quinoa-bowl",
            title: "Protein Quinoa Bowl",
            link: "https://www.youtube.com/watch?v=Nhk6CkkPiRs",
            image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=900&q=80",
            description: "Complete protein source with quinoa, vegetables, and lean protein. Nutrient-dense and satisfying.",
            meta: "Main Course • Vegetarian",
            category: "Main Course",
            isVeg: true,
            calories: 350,
            protein: 22,
            carbs: 50,
            fat: 6
        },
        {
            id: "egg-white-omelet",
            title: "High Protein Egg White Omelet",
            link: "https://www.youtube.com/watch?v=mSQuprthIaU",
            image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=900&q=80",
            description: "Low-calorie, high-protein breakfast option. Packed with essential amino acids.",
            meta: "Breakfast • High Protein",
            category: "Breakfast",
            isVeg: true,
            calories: 180,
            protein: 28,
            carbs: 5,
            fat: 4
        },
        {
            id: "chicken-vegetables",
            title: "Grilled Chicken with Vegetables",
            link: "https://www.youtube.com/watch?v=rANPCqOvYdc",
            image: "https://images.unsplash.com/photo-1511690656952-34342bb7c2f2?auto=format&fit=crop&w=900&q=80",
            description: "Simple grilled chicken with roasted vegetables. A staple meal for any fitness enthusiast.",
            meta: "Main Course • High Protein",
            category: "Main Course",
            isVeg: false,
            calories: 320,
            protein: 42,
            carbs: 20,
            fat: 7
        },
        {
            id: "cottage-cheese-bowl",
            title: "Cottage Cheese Protein Bowl",
            link: "https://www.youtube.com/watch?v=INTTHoPR60g",
            image: "https://images.unsplash.com/photo-1495195134817-aeb325a55b65?auto=format&fit=crop&w=900&q=80",
            description: "Casein-rich cottage cheese with fruits and nuts. Perfect for sustained protein release.",
            meta: "Snack • High Protein",
            category: "Snack",
            isVeg: true,
            calories: 220,
            protein: 25,
            carbs: 15,
            fat: 5
        },
        {
            id: "tuna-salad",
            title: "High Protein Tuna Salad",
            link: "https://www.youtube.com/watch?v=Nhk6CkkPiRs",
            image: "https://images.unsplash.com/photo-1467003909585-2f8a72700288?auto=format&fit=crop&w=900&q=80",
            description: "Quick and easy tuna salad loaded with protein. Great for lunch or a post-workout meal.",
            meta: "Main Course • High Protein",
            category: "Main Course",
            isVeg: false,
            calories: 240,
            protein: 35,
            carbs: 8,
            fat: 6
        },
        {
            id: "protein-muffins",
            title: "Protein Muffins",
            link: "https://www.youtube.com/watch?v=EyFcGkeL_kA",
            image: "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=900&q=80",
            description: "Delicious muffins packed with protein powder. Perfect for on-the-go nutrition.",
            meta: "Snack • High Protein",
            category: "Snack",
            isVeg: true,
            calories: 180,
            protein: 20,
            carbs: 18,
            fat: 4
        },
        {
            id: "beef-chili",
            title: "Lean Beef Chili",
            link: "https://www.youtube.com/watch?v=Nhk6CkkPiRs",
            image: "https://images.unsplash.com/photo-1528838062688-04a87c08c187?auto=format&fit=crop&w=900&q=80",
            description: "Hearty chili made with lean ground beef. High in protein and perfect for meal prep.",
            meta: "Main Course • High Protein",
            category: "Main Course",
            isVeg: false,
            calories: 340,
            protein: 38,
            carbs: 28,
            fat: 8
        },
        {
            id: "protein-ice-cream",
            title: "Protein Ice Cream",
            link: "https://www.youtube.com/watch?v=EyFcGkeL_kA",
            image: "https://images.unsplash.com/photo-1505253758473-96b7015fcd40?auto=format&fit=crop&w=900&q=80",
            description: "Guilt-free ice cream made with protein powder. Satisfy your sweet tooth while hitting your macros.",
            meta: "Dessert • High Protein",
            category: "Dessert",
            isVeg: true,
            calories: 150,
            protein: 25,
            carbs: 12,
            fat: 2
        },
        {
            id: "chicken-wraps",
            title: "High Protein Chicken Wraps",
            link: "https://www.youtube.com/watch?v=rANPCqOvYdc",
            image: "https://images.unsplash.com/photo-1604908177742-a75562a10460?auto=format&fit=crop&w=900&q=80",
            description: "Quick and portable chicken wraps. Perfect for lunch or a post-workout meal on the go.",
            meta: "Main Course • High Protein",
            category: "Main Course",
            isVeg: false,
            calories: 310,
            protein: 32,
            carbs: 30,
            fat: 6
        },
        {
            id: "overnight-oats",
            title: "Protein Overnight Oats",
            link: "https://www.youtube.com/watch?v=mSQuprthIaU",
            image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=900&q=80",
            description: "Prepare the night before for a quick, protein-rich breakfast. Customize with your favorite toppings.",
            meta: "Breakfast • High Protein",
            category: "Breakfast",
            isVeg: true,
            calories: 290,
            protein: 28,
            carbs: 35,
            fat: 5
        },
        {
            id: "shrimp-stir-fry",
            title: "Shrimp and Vegetable Stir Fry",
            link: "https://www.youtube.com/watch?v=H4TSJsSMPwc",
            image: "https://images.unsplash.com/photo-1467003909585-2f8a72700288?auto=format&fit=crop&w=900&q=80",
            description: "Low-calorie, high-protein shrimp stir fry. Quick to prepare and packed with nutrients.",
            meta: "Main Course • High Protein",
            category: "Main Course",
            isVeg: false,
            calories: 260,
            protein: 32,
            carbs: 22,
            fat: 4
        },
        {
            id: "protein-brownies",
            title: "Protein Brownies",
            link: "https://www.youtube.com/watch?v=EyFcGkeL_kA",
            image: "https://images.unsplash.com/photo-1497051788611-2c64812349f5?auto=format&fit=crop&w=900&q=80",
            description: "Fudgy brownies made with protein powder. Indulge without derailing your diet.",
            meta: "Dessert • High Protein",
            category: "Dessert",
            isVeg: true,
            calories: 140,
            protein: 18,
            carbs: 15,
            fat: 3
        },
        {
            id: "chicken-quinoa",
            title: "Chicken and Quinoa Bowl",
            link: "https://www.youtube.com/watch?v=Nhk6CkkPiRs",
            image: "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?auto=format&fit=crop&w=900&q=80",
            description: "Balanced meal with complete proteins from chicken and quinoa. Perfect for muscle recovery.",
            meta: "Main Course • High Protein",
            category: "Main Course",
            isVeg: false,
            calories: 400,
            protein: 40,
            carbs: 45,
            fat: 8
        }
    ];
}

module.exports = router;


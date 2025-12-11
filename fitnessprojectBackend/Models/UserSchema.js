const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    username: {
        type: String,
        unique: true,
        sparse: true,
        trim: true,
    },
    bio: {
        type: String,
        default: ''
    },
    isPrivate: {
        type: Boolean,
        default: false
    },
    lastSeen: {
        type: Date,
    },
    avatarUrl: {
        type: String,
        default: ''
    },
    coverUrl: {
        type: String,
        default: ''
    },
    weight: [
        {
            weight: {
                type: Number,
                required: true,
            },
            date: {
                type: Date,
                required: true,
            },
        }
    ],
    height: [
        {
            height: {
                type: Number,
                required: true,
            },
            date: {
                type: Date,
                required: true,
            },
        }
    ],
    gender: {
        type: String,
        required: true,
    },
    dob: {
        type: String,
        required: true,
    },
    goal: {
        type: String,
        required: true,
    },
    calorieIntake: [
        {
            // item,
            // date,
            // quantity,
            // quantitytype,
            // calorieIntake:

            item: {
                type: String,
                required: true,
            },
            date: {
                type: Date,
                required: true,
            },
            quantity: {
                type: Number,
                required: true,
            },
            quantitytype: {
                type: String,
                required: true,
            },
            calorieIntake: {
                type: Number,
                required: true,
            },
            // Additional nutrition details (optional)
            protein: {
                type: Number,
                default: 0,
            },
            carbs: {
                type: Number,
                default: 0,
            },
            fat: {
                type: Number,
                default: 0,
            },
            fiber: {
                type: Number,
                default: 0,
            },
            sugar: {
                type: Number,
                default: 0,
            },
            sodium: {
                type: Number,
                default: 0,
            },

        }
    ],
    activityLevel: {
        type: String,
        required: true,
    },
    sleep: [
        {
            date: {
                type: Date,
                required: true,
            },
            durationInHrs: {
                type: Number,
                required: true,
            },
        },
    ],
    steps: [
        {
            date: {
                type: Date,
                required: true,
            },
            steps: {
                type: Number,
                required: true,
            },
        },
    ],
    workouts: [
        {
            date: {
                type: Date,
                required: true,
            },
            exercise: {
                type: String,
                required: true,
            },
            durationInMinutes: {
                type: Number,
                required: true,
            },
        },
    ],
    water: [
        {
            date: {
                type: Date,
                required: true,
            },
            amountInMilliliters: {
                type: Number,
                required: true,
            },
        },
    ],
}, {timestamps: true});

userSchema.pre('save', async function (next) {
    const user = this;

    if (user.isModified('password')) {
        user.password = await bcrypt.hash(user.password, 8);
    }
    
    next();
});
// userSchema.pre('save', ...) registers a pre-save hook for the 'save' event on the userSchema. 
//This means that the specified function will be executed every time a document of this schema is about to be saved to the database.

// The function provided as the second argument (async function (next) {...}) is the middleware function 
//that will be executed before saving the document.

// Inside the middleware function:

// const user = this;: This line initializes a reference to the current document instance.
// if (user.isModified('password')) { ... }: This condition checks if the 'password' field of the document has been modified. 
//It's common practice to only hash the password if it's being modified to avoid unnecessary hashing on every save.
// user.password = await bcrypt.hash(user.password, 8);: If the password is being modified, this line hashes the password using 
//bcrypt with a cost factor of 8. Bcrypt is a popular library for hashing passwords securely.
// next();: This function is called to move to the next middleware function in the save process. 
//It's important to call next() to ensure that the middleware chain continues to execute and the save operation proceeds.


const User = mongoose.model('User', userSchema);
module.exports = User;
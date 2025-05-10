const { Schema, model } = require("mongoose");
const bcrypt = require("bcryptjs");
const { createTokenuser } = require('../service/authentication1'); // JWT token generation
const mongoose = require("mongoose");

const userSchema = new Schema({
    username: { 
        type: String, 
        required: true 
    },
    password: {
        type: String,
        required: true,
        minlength: 8,  // Ensure password length
        // Removed the password validation from the schema
    },
    email: { 
        type: String, 
        required: true, 
        unique: true, 
        match: [/\S+@\S+\.\S+/, 'Please use a valid email address'] // Validate email format
    },
    resetPasswordToken: { type: String }, // Field for reset token
    resetPasswordExpires: { type: Date }, // Expiration time for reset token
    name: { type: String },  // New field for name
    profilePicture: { type: String },  // New field for profile picture URL
    bio: { type: String },  // New field for bio
    jobTitle: { type: String },  // New field for job title
    company: { type: String },  // New field for company
    pendingRequests: { type: [mongoose.Schema.Types.ObjectId], ref: 'User', default: [] },
    connections: { type: [mongoose.Schema.Types.ObjectId], ref: 'User', default: [] },
    connectionRequests: { type: [mongoose.Schema.Types.ObjectId], ref: 'User', default: [] },
    blockedUsers: { type: [mongoose.Schema.Types.ObjectId], ref: 'User', default: [] },
});

// Password Validation (Plain Text) Middleware before saving
userSchema.pre('save', async function (next) {
    if (this.isModified('password')) {
        const password = this.password;
        console.log("Password before hashing: ", password); // Add this line for debugging

        // Password strength validation using regex
        const regex = /^(?=.*[a-zA-Z])(?=.*\d).{8,}$/;
        if (!regex.test(password)) {
            return next(new Error('Password must contain at least 1 uppercase letter, 1 number, and 1 special character'));
        }

        try {
            const salt = await bcrypt.genSalt(10);
            console.log("Salt: ", salt); // Add this line for debugging
            this.password = await bcrypt.hash(password, salt); // Hash password
            console.log("Password after hashing: ", this.password); // Add this line for debugging
            next();
        } catch (err) {
            next(err); // Pass error to next middleware
        }
    } else {
        next(); // No password change, continue to save
    }
});



// Static method to verify password and generate token
userSchema.statics.matchPasswordandGenerateToken = async function (identifier, password) {
    const user = await this.findOne({ $or: [{ username: identifier }, { email: identifier }] });
    if (!user) {
        throw new Error('User not found');
    }

    const isMatch = await bcrypt.compare(password, user.password);
    console.log("Password provided for validation: ", password); // Add this line for debugging
    console.log("Password after hashing: ", user.password);
    // Compare hashed password
    if (!isMatch) {
        throw new Error('Password does not match');
    }

    // Generate a token for the user
    const token = createTokenuser(user);
    return token;
};

// Create the User model
const User = mongoose.models.user || model("user", userSchema);

// Ensure User is properly exported
module.exports = User;

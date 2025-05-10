const mongoose = require("mongoose");

// Define the User schema
const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    profilePicture: { 
      type: String, 
      validate: { 
        validator: (url) => /^https?:\/\/.+$/.test(url), 
        message: 'Invalid URL' 
      } 
    },
    bio: { type: String, trim: true },
    jobTitle: { type: String, trim: true },
    company: { type: String, trim: true },
    email: { 
      type: String, 
      required: true, 
      unique: true, 
      match: [/\S+@\S+\.\S+/, 'Please use a valid email address'] // Validate email format
    },
  },
  { 
    timestamps: true, // Adds `createdAt` and `updatedAt` 
    versionKey: false, // Optional: Disable version key (_v) in the schema if not needed
    strictPopulate: false, // Allow population of fields not in schema
  }
);

// Check if the model already exists to prevent OverwriteModelError
module.exports = mongoose.models.User || mongoose.model('User', userSchema); 

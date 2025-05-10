const mongoose = require("mongoose");

const userDetailsSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: false },
  backgroundImage: { type: String, required: false },
  socialLinks: {
    linkedin: { type: String },
    github: { type: String },
    instagram: { type: String }, 
    facebook: { type: String },
    twitter: { type: String },
    website: { type: String },
    youtube: { type: String },
    medium: { type: String },
    other: { type: String },
},
  interests: { type: [String], required: false },
    location: { type: String, required: false },
    occupation: { type: String, required: false },
    achievements: { type: [String], required: false },
    hobbies: { type: [String], required: false }, 
    
 
});

module.exports = mongoose.model("UserDetails", userDetailsSchema);

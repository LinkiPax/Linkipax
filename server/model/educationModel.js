const mongoose = require("mongoose");

const educationSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  collegeName: { type: String, required: true },
  degree: { type: String, required: true },
  fieldOfStudy: { type: String },
  startDate: { type: Date, required: true },
  endDate: { type: Date }, // Optional for ongoing education
  logo: { type: String }, // URL for the college logo
});

module.exports = mongoose.model("Education", educationSchema);

const express = require("express");
const { addEducation, getEducation } = require("../controller/educationController");
const router = express.Router();

// Routes for Education
router.post("/:userId", addEducation); // Add education
router.get("/:userId", getEducation); // Get education

module.exports = router; 

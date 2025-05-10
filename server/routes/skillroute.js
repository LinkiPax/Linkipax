const express = require('express');
const Skill = require('../model/skillmodel');
const router = express.Router();

// Add or Update Skills
router.post('/:userId', async (req, res) => {
  const { userId } = req.params;
  const { skills } = req.body;

  try {
    const existingSkills = await Skill.findOne({ userId });

    if (existingSkills) {
      // Update skills
      existingSkills.skills = skills;
      await existingSkills.save();
      return res.json({ message: "Skills updated successfully.", skills: existingSkills.skills });
    }

    // Add new skills
    const newSkills = new Skill({ userId, skills });
    await newSkills.save();
    res.json({ message: "Skills added successfully.", skills: newSkills.skills });
  } catch (error) {
    console.error("Error managing skills:", error);
    res.status(500).json({ error: "Internal server error." });
  }
});

// Get Skills
router.get('/:userId', async (req, res) => {
  const { userId } = req.params;

  try {
    const skills = await Skill.findOne({ userId });
    if (!skills) return res.status(404).json({ message: "Skills not found." });
    res.json({ skills: skills.skills });
  } catch (error) {
    console.error("Error fetching skills:", error);
    res.status(500).json({ error: "Internal server error." });
  }
});

module.exports = router;

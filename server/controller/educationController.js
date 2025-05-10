const Education = require("../model/educationModel");
const colleges = require("../data/colleges.json"); // Load the JSON file

// Add Education
const addEducation = async (req, res) => {
  const { userId } = req.params;
  const { collegeName, degree, fieldOfStudy, startDate, endDate } = req.body;

  try {
    if (!collegeName) {
      return res.status(400).json({ message: "College name is required" });
    }

    // Check if colleges.json is loaded and structured properly
    if (!colleges || !Array.isArray(colleges)) {
      return res.status(500).json({ message: "Colleges data not available" });
    }

    // Find the logo for the college
    const college = colleges.find( 
      (c) => c.name && collegeName.toLowerCase().includes(c.name.toLowerCase())
    );
    const logo = college ? college.logo : null;

    const newEducation = new Education({
      userId,
      collegeName,
      degree,
      fieldOfStudy,
      startDate,
      endDate,
      logo,
    });

    const savedEducation = await newEducation.save();
    res.status(201).json(savedEducation);
  } catch (error) {
    console.error("Error adding education:", error);
    res.status(500).json({ message: "Error adding education", error });
  }
};
// Get Education
const getEducation = async (req, res) => {
  const { userId } = req.params;

  try {
    const education = await Education.find({ userId });
    res.status(200).json(education);
  } catch (error) {
    console.error("Error fetching education:", error);
    res.status(500).json({ message: "Error fetching education", error });
  }
};

module.exports = {
  addEducation,
  getEducation,
};

// routes/aboutRoutes.js
const express = require("express");
const About = require("../models/aboutModel");
const router = express.Router();

// Get about info
router.get("/", async (req, res) => {
  try {
    const about = await About.findOne();
    res.json(about);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create or update about info
router.post("/", async (req, res) => {
  const {
    title,
    description,
    vision,
    coreValues,
    storyAndBackground,
    foundersAndTeam,
  } = req.body;
  const about = new About({
    title,
    description,
    vision,
    coreValues,
    storyAndBackground,
    foundersAndTeam,
  });
  try {
    const newAbout = await about.save();
    res.status(201).json(newAbout);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;

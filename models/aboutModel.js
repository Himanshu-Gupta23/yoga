// models/aboutModel.js
const mongoose = require("mongoose");

const aboutSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  vision: { type: String }, // New field for vision
  coreValues: { type: [String] }, // New field for core values as an array of strings
  storyAndBackground: { type: String }, // New field for institute's story and background
  foundersAndTeam: {
    // New field for founders and team information
    type: [
      {
        name: { type: String },
        role: { type: String },
        bio: { type: String },
        f: { type: String },
      },
    ],
  },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("About", aboutSchema);

const About = mongoose.model("About", aboutSchema);

module.exports = About;

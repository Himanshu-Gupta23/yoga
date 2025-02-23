const express = require("express");
const upload = require("../utils/multer");
const Image = require("../models/Image"); // Assuming you have an Image model
const router = express.Router();

// Upload Image
router.post("/upload", upload.single("image"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No image file uploaded." });
    }

    const newImage = new Image({
      imageUrl: req.file.path,
      title: req.body.title || "Untitled",
      description: req.body.description || "No description",
    });

    await newImage.save();
    res.json({ message: "Image uploaded successfully!", image: newImage });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Get All Images
router.get("/", async (req, res) => {
  try {
    const images = await Image.find().sort({ uploadedAt: -1 }); // Sort by uploadedAt in descending order
    res.json(images);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});


module.exports = router;

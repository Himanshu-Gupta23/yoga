const mongoose = require("mongoose");

const ImageSchema = new mongoose.Schema({
  imageUrl: { type: String, required: true },
  title: { type: String },
  description: { type: String },
  uploadedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Image", ImageSchema);

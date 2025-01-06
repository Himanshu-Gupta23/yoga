// models/serviceModel.js
const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  duration: { type: String, required: true }, // e.g., "1 hour"
  createdAt: { type: Date, default: Date.now },
  imageUrl: { type: String, required: true } // Added imageUrl field
});

const Service = mongoose.model('Service', serviceSchema);

module.exports = Service;

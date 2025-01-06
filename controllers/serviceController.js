const Service = require("../models/serviceModel");

// Get all services
const getAllServices = async (req, res) => {
  try {
    const services = await Service.find();
    res.json(services);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get a single service
const getServiceById = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);
    if (!service) {
      return res.status(404).json({ message: "Service not found" });
    }
    res.json(service);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Create a new service
const createService = async (req, res) => {
  const { name, description, price, duration, imageUrl } = req.body;
  const service = new Service({ name, description, price, duration, imageUrl });
  try {
    const newService = await service.save();
    res.status(201).json(newService);
  } catch (err) {
    console.log(err);
    res.status(400).json({ message: err.message });
  }
};

// Update a service
const updateService = async (req, res) => {
  try {
    const updatedService = await Service.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json(updatedService);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Delete a service
const deleteService = async (req, res) => {
  try {
    await Service.findByIdAndDelete(req.params.id);
    res.json({ message: "Service deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  getAllServices,
  getServiceById,
  createService,
  updateService,
  deleteService,
};

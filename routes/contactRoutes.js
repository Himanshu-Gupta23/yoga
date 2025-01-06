// routes/contactRoutes.js
const express = require('express');
const Contact = require('../models/contactModel');
const router = express.Router();

// Get contact info
router.get('/', async (req, res) => {
  try {
    const contact = await Contact.findOne();
    res.json(contact);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create or update contact info
router.post('/', async (req, res) => {
  const { address, phone, email, socialMediaLinks } = req.body;
  const contact = new Contact({ address, phone, email, socialMediaLinks });
  try {
    const newContact = await contact.save();
    res.status(201).json(newContact);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;

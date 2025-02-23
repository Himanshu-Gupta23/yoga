const express = require("express");
const router = express.Router();
const User = require("../models/User");
const authMiddleware = require("../middleware/authMiddleware");

// View Profile Route (GET)
router.get("/profile", authMiddleware(), async (req, res) => {
  console.log("requets aa gyi");
  try {
    // Extract user ID from JWT token
    const userId = req.user.id;
    console.log("User ID : ", userId);

    // Fetch user details from DB excluding password
    const user = await User.findById(userId).select("-password");

    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    // Return user details
    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Server error" });
  }
});

// Update Profile Route (PUT)
router.put("/profile", authMiddleware(), async (req, res) => {
  const { name, email } = req.body;

  // Extract user ID from JWT token
  const userId = req.user.id;

  try {
    // Check if the user exists
    let user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    // Update user profile
    if (name) user.name = name;
    if (email) user.email = email;
    // if (role) user.role = role;

    // Save the updated user profile
    await user.save();

    // Return success message
    res.json({ msg: "Profile updated successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Server error" });
  }
});

router.get("/instructor", authMiddleware(), async (req, res) => {
  try {
    const instructors = await User.find({ role: "instructor" });
    res.json(instructors);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put("/profile/:userId", authMiddleware("admin"), async (req, res) => {
  try {
    const { userId } = req.params;
    const { name, email, role } = req.body;

    // Validate input (you can add more fields and validation as needed)
    if (!name && !email && !role) {
      return res.status(400).json({ msg: "No valid fields to update" });
    }

    // Find user and update details
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    // Update user details
    if (name) user.name = name;
    if (email) user.email = email;
    if (role) user.role = role;

    await user.save();

    // Return updated user details
    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Server error" });
  }
});

router.get("/users", authMiddleware("admin"), async (req, res) => {
  try {
    // Fetch all users excluding the ones with role 'admin'
    const users = await User.find({ role: { $ne: "admin" } });

    if (users.length === 0) {
      return res.status(404).json({ msg: "No users found" });
    }

    // Return users details
    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Server error" });
  }
});

router.delete("/users/:userId", authMiddleware("admin"), async (req, res) => {
  try {
    const { userId } = req.params;

    // Find and delete the user
    const user = await User.findByIdAndDelete(userId);
    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    // Return success message
    res.json({ msg: "User deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Server error" });
  }
});

module.exports = router;

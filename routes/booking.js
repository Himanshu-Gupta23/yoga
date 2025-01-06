const express = require("express");
const Booking = require("../models/Booking");
const Session = require("../models/sessionModel");
const User = require("../models/User");
const authMiddleware = require("../middleware/authMiddleware"); // Protect routes
const { body, validationResult } = require("express-validator");

const router = express.Router();

// 1. Create a Booking
router.post(
  "/",
  authMiddleware(),
  [
    body("sessionId").not().isEmpty().withMessage("Session ID is required"),
    body("bookingDate").not().isEmpty().withMessage("Booking date is required"),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { sessionId, bookingDate } = req.body;

    try {
      // Check if the session exists
      const session = await Session.findById(sessionId);
      if (!session) {
        return res.status(400).json({ msg: "Session not found" });
      }

      // Check if the user is already enrolled in the session
      const existingBooking = await Booking.findOne({
        user: req.user.id,
        session: sessionId,
      });

      if (existingBooking) {
        return res.status(400).json({
          msg: "You are already enrolled in this session",
        });
      }

      // Create the booking
      const newBooking = new Booking({
        user: req.user.id,
        session: sessionId,
        bookingDate,
      });

      await newBooking.save();

      res.status(201).json({ msg: "Booking created successfully", newBooking });
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server error");
    }
  }
);

// 2. Get All Bookings for a User
router.get("/user", authMiddleware(), async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user.id })
      .populate({
        path: "session", // Populate session
        populate: {
          path: "instructor", // Populate instructor within session
          select: "name email", // Select only name and email fields of the instructor
        },
      })
      .exec();
    res.json(bookings);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

//.populate("instructor", "name email");

// 3. Get All Bookings (Admin Only)
router.get("/", authMiddleware("admin"), async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate("session user instructor")
      .exec();
    res.json(bookings);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

// 4. Update a Booking
router.put("/:id", authMiddleware(), async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({ msg: "Booking not found" });
    }

    // Check if the user is the one who made the booking or is an admin
    if (booking.user.toString() !== req.user.id && req.user.role !== "admin") {
      return res
        .status(403)
        .json({ msg: "Not authorized to update this booking" });
    }

    const { status } = req.body;
    booking.status = status || booking.status;

    await booking.save();

    res.json(booking);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

// 5. Cancel a Booking
router.delete("/:id", authMiddleware(), async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({ msg: "Booking not found" });
    }

    // Check if the user is the one who made the booking or is an admin
    if (booking.user.toString() !== req.user.id && req.user.role !== "admin") {
      return res
        .status(403)
        .json({ msg: "Not authorized to cancel this booking" });
    }

    await booking.deleteOne();

    res.json({ msg: "Booking cancelled" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

module.exports = router;

const Session = require("../models/sessionModel");
const User = require("../models/User"); // If needed for validation

// Create a new session
const createSession = async (req, res) => {
  try {
    const { name, description, dateTime, instructor } = req.body;

    // Validate if instructor exists
    const instructorExists = await User.findById(instructor);
    if (!instructorExists || instructorExists.role !== "instructor") {
      return res.status(400).json({ message: "Invalid instructor." });
    }

    const newSession = new Session({
      name,
      description,
      dateTime,
      instructor,
    });

    await newSession.save();
    return res.status(201).json(newSession);
  } catch (error) {
    return res.status(500).json({ message: "Error creating session.", error });
  }
};

// Get all sessions
const getAllSessions = async (req, res) => {
  try {
    const sessions = await Session.find().populate("instructor", "name email"); // Populate instructor details
    return res.status(200).json(sessions);
  } catch (error) {
    return res.status(500).json({ message: "Error fetching sessions.", error });
  }
};

// Get a single session by ID
const getSessionById = async (req, res) => {
  try {
    const session = await Session.findById(req.params.id).populate(
      "instructor",
      "name email"
    );
    if (!session) {
      return res.status(404).json({ message: "Session not found." });
    }
    return res.status(200).json(session);
  } catch (error) {
    return res.status(500).json({ message: "Error fetching session.", error });
  }
};

// Update session by ID
const updateSession = async (req, res) => {
  try {
    const { name, description, dateTime, instructor } = req.body;

    const updatedSession = await Session.findByIdAndUpdate(
      req.params.id,
      { name, description, dateTime, instructor },
      { new: true }
    ).populate("instructor", "name email");

    if (!updatedSession) {
      return res.status(404).json({ message: "Session not found." });
    }

    return res.status(200).json(updatedSession);
  } catch (error) {
    return res.status(500).json({ message: "Error updating session.", error });
  }
};

// Delete session by ID
const deleteSession = async (req, res) => {
  try {
    const deletedSession = await Session.findByIdAndDelete(req.params.id);
    if (!deletedSession) {
      return res.status(404).json({ message: "Session not found." });
    }
    return res.status(200).json({ message: "Session deleted successfully." });
  } catch (error) {
    return res.status(500).json({ message: "Error deleting session.", error });
  }
};

module.exports = {
  createSession,
  getAllSessions,
  getSessionById,
  updateSession,
  deleteSession,
};

const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const sessionController = require("../controllers/sessionController");

const router = express.Router();

// Route to create a session (only accessible by admins)
router.post("/", authMiddleware("admin"), sessionController.createSession);

// Route to get all sessions (accessible by any authenticated user)
router.get("/", authMiddleware(), sessionController.getAllSessions);

// Route to get a specific session by ID (accessible by any authenticated user)
router.get("/:id", authMiddleware(), sessionController.getSessionById);

// Route to update a session by ID (only accessible by admins)
router.put("/:id", authMiddleware("admin"), sessionController.updateSession);

// Route to delete a session by ID (only accessible by admins)
router.delete("/:id", authMiddleware("admin"), sessionController.deleteSession);

// Example route for instructors to view their sessions
router.get(
  "/instructor-sessions",
  authMiddleware("instructor"),
  async (req, res) => {
    try {
      // Logic to fetch sessions specifically for the instructor (e.g., sessions they are teaching)
      const instructorSessions = await Session.find({
        instructor: req.user._id,
      }).populate("instructor", "name email");
      res.json(instructorSessions);
    } catch (error) {
      res
        .status(500)
        .json({ message: "Error fetching instructor's sessions.", error });
    }
  }
);

// Example route for authenticated users to view their sessions (any user)
router.get("/my-sessions", authMiddleware(), async (req, res) => {
  try {
    const userSessions = await Session.find({
      instructor: req.user._id,
    }).populate("instructor", "name email");
    res.json(userSessions);
  } catch (error) {
    res.status(500).json({ message: "Error fetching user's sessions.", error });
  }
});

module.exports = router;

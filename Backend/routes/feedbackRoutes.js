const express = require("express");
const router = express.Router();
const Feedback = require("../models/Feedback");

// POST: Create new feedback
router.post("/feedback", async (req, res) => {
  try {
    const { firstName, lastName, email, message } = req.body;

    const feedback = new Feedback({
      firstName,
      lastName,
      email,
      message,
    });

    await feedback.save();

    res.status(201).json({
      success: true,
      message: "Feedback submitted successfully",
      data: feedback,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Failed to submit feedback",
      error: error.message,
    });
  }
});

// GET: All feedbacks
router.get("/feedback", async (req, res) => {
  try {
    const feedbacks = await Feedback.find().sort({ createdAt: -1 });
    res.json({ success: true, data: feedbacks });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// GET: Single feedback by ID
router.get("/feedback/:id", async (req, res) => {
  try {
    const feedback = await Feedback.findById(req.params.id);
    if (!feedback) {
      return res.status(404).json({ success: false, message: "Feedback not found" });
    }
    res.json({ success: true, data: feedback });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// DELETE: Remove feedback
router.delete("/feedback/:id", async (req, res) => {
  try {
    const feedback = await Feedback.findByIdAndDelete(req.params.id);
    if (!feedback) {
      return res.status(404).json({ success: false, message: "Feedback not found" });
    }
    res.json({ success: true, message: "Feedback deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;

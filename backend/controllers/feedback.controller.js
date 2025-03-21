import { Feedback } from "../models/Feedback.model.js";

export const submitFeedback = async (req, res) => {
  try {
    const { userId, userName, rating, feedback } = req.body;

    if (!userId || !userName || !rating) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields",
      });
    }

    const newFeedback = new Feedback({
      userId,
      userName,
      rating,
      feedback,
      submittedAt: new Date(),
    });

    await newFeedback.save();

    res.status(200).json({
      success: true,
      message: "Feedback submitted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to submit feedback",
    });
  }
};

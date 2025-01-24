import express from "express";
import { User } from "../models/User.model.js";
import {
  requestOTP,
  verifyOTP,
  login,
} from "../controllers/auth.controller.js";

const router = express.Router();

router.post("/check-user", async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required",
      });
    }

    const existingUser = await User.findOne({ email });

    return res.json({
      success: true,
      exists: !!existingUser,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error checking user existence",
    });
  }
});

router.post("/login", login);
router.post("/request-otp", requestOTP);
router.post("/verify-otp", verifyOTP);

export default router;

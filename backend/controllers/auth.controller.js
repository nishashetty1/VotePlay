import { User } from "../models/User.model.js";
import nodemailer from "nodemailer";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";

dotenv.config();

const pendingVerifications = new Map();

const verifyEnvironment = () => {
  const required = ["EMAIL_USER", "EMAIL_PASSWORD"];
  const missing = required.filter((key) => !process.env[key]);
  if (missing.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missing.join(", ")}`
    );
  }
};

const initializeEmailTransport = () => {
  return nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  });
};

const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

const sendOTPEmail = async (email, otp) => {
  const transporter = initializeEmailTransport();

  const mailOptions = {
    from: `"VotePlay" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "Verify Your Email",
    html: `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Email Verification</title>
            <!--[if mso]>
            <style type="text/css">
                table {border-collapse: collapse;}
                .container {width: 600px !important;}
            </style>
            <![endif]-->
        </head>
        <body style="margin: 0; padding: 0; background-color: #161A1D;">
            <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color: #161A1D;">
                <tr>
                    <td align="center" style="padding: 32px 16px;">
                        <!-- Main Container -->
                        <table role="presentation" class="container" width="600" cellspacing="0" cellpadding="0" border="0" style="background-color: #1E2328; border-radius: 16px; border: 1px solid rgba(104, 149, 210, 0.1);">
                            <tr>
                                <td style="padding: 32px;">
                                    <!-- Header -->
                                    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
                                        <tr>
                                            <td align="center" style="padding-bottom: 32px;">
                                                <h1 style="font-size: 28px; color: #D04848; margin: 0; font-family: Arial, sans-serif;">
                                                    VotePlay Simulator
                                                </h1>
                                                <p style="color: #9CA3AF; font-size: 16px; margin-top: 8px;">
                                                    Email OTP Verification
                                                </p>
                                            </td>
                                        </tr>
                                    </table>

                                    <!-- OTP Container -->
                                    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background: rgba(22, 26, 29, 0.5); border: 1px solid rgba(208, 72, 72, 0.2); border-radius: 12px;">
                                        <tr>
                                            <td style="padding: 24px;">
                                                <h2 style="color: #F3F4F6; font-size: 20px; text-align: center; margin: 0 0 24px 0;">
                                                    Your One Time Password (OTP)
                                                </h2>
                                                
                                                <!-- OTP Display -->
                                                <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
                                                    <tr>
                                                        <td align="center">
                                                            <table role="presentation" cellspacing="0" cellpadding="0" border="0">
                                                                <tr>
                                                                    ${otp
                                                                      .split("")
                                                                      .map(
                                                                        (
                                                                          digit
                                                                        ) => `
                                                                        <td style="padding: 0 4px;">
                                                                            <table role="presentation" cellspacing="0" cellpadding="0" border="0" style="background: #1E2328; border-radius: 8px; width: 45px; height: 45px;">
                                                                                <tr>
                                                                                    <td align="center" valign="middle" style="font-size: 24px; font-weight: bold; color: #F3B95F;">
                                                                                        ${digit}
                                                                                    </td>
                                                                                </tr>
                                                                            </table>
                                                                        </td>
                                                                    `
                                                                      )
                                                                      .join("")}
                                                                </tr>
                                                            </table>
                                                        </td>
                                                    </tr>
                                                </table>

                                                <!-- Info Box -->
                                                <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="margin-top: 24px; background: #161A1D; border: 1px solid rgba(208, 72, 72, 0.1); border-radius: 8px;">
                                                    <tr>
                                                        <td style="padding: 16px;">
                                                            <p style="color: #9CA3AF; text-align: center; margin: 0; font-size: 14px; line-height: 1.6;">
                                                                <strong style="color: #D04848;">Note:</strong> This OTP will expire in 10 minutes.<br>
                                                                You have 3 attempts to enter the correct OTP.
                                                            </p>
                                                        </td>
                                                    </tr>
                                                </table>
                                            </td>
                                        </tr>
                                    </table>

                                    <!-- Footer -->
                                    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="margin-top: 24px;">
                                        <tr>
                                            <td align="center" style="color: #F3F4F6; font-size: 12px;">
                                                <p style="margin: 0 0 8px 0;">
                                                    If you didn't request this verification, please ignore this email.
                                                </p>
                                                <p style="margin: 0; color: #6895D2;">
                                                    © ${new Date().getFullYear()} VotePlay. All rights reserved.
                                                </p>
                                            </td>
                                        </tr>
                                    </table>
                                </td>
                            </tr>
                        </table>
                    </td>
                </tr>
            </table>
        </body>
        </html>
    `,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    return true;
  } catch (error) {
    throw new Error(`Failed to send email: ${error.message}`);
  }
};

export const requestOTP = async (req, res) => {
  try {
    verifyEnvironment();
    const { email, userData } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "Email already registered",
      });
    }

    const otp = generateOTP();

    pendingVerifications.set(email, {
      otp,
      userData,
      attempts: 3,
      timestamp: Date.now(),
    });

    await sendOTPEmail(email, otp);

    res.json({
      success: true,
      message: "Verification code sent successfully",
    });
  } catch (error) {
    console.error("OTP request error:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const verifyOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;

    const verification = pendingVerifications.get(email);
    if (!verification) {
      return res.status(400).json({
        success: false,
        message: "Verification session expired or not found",
      });
    }

    if (Date.now() - verification.timestamp > 10 * 60 * 1000) {
      pendingVerifications.delete(email);
      return res.status(400).json({
        success: false,
        message: "Verification code expired",
      });
    }

    if (verification.otp !== otp) {
      verification.attempts--;

      if (verification.attempts <= 0) {
        pendingVerifications.delete(email);
        return res.status(400).json({
          success: false,
          message: "Maximum attempts reached. Please request a new code.",
          maxAttemptsReached: true,
        });
      }

      return res.status(400).json({
        success: false,
        message: `Incorrect OTP. Try Again. ${verification.attempts} attempts remaining`,
        attemptsLeft: verification.attempts,
      });
    }

    const { userData } = verification;
    const hashedPassword = await bcrypt.hash(userData.password, 10);

    const user = new User({
      ...userData,
      password: hashedPassword,
    });

    await user.save();
    pendingVerifications.delete(email);

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET || "votingsimulator"
    );

    res.json({
      success: true,
      message: "Email verified and registration completed successfully",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        dob: user.dob,
        gender: user.gender,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "User does not exist. Please sign up.",
      });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    const token = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET || "votingsimulator",
      { expiresIn: "24h" }
    );

    res.json({
      success: true,
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        dob: user.dob,
        gender: user.gender,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Login failed. Please try again.",
    });
  }
};

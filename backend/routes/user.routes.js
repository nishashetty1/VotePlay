import express from "express";
import { User } from "../models/User.model.js";
import { verifyToken } from "../middleware/auth.js";
import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import multer from 'multer';
import dotenv from 'dotenv';

dotenv.config();

const userRouter = express.Router();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'voteplay',
    allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
    transformation: [
      { width: 500, height: 500, crop: 'limit' },
      { quality: 'auto' }
    ]
  }
});

const upload = multer({ storage: storage });

userRouter.post("/users", async (req, res) => {
  try {
    const { name, gender, email, dob } = req.body;

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: "Invalid Email format" });
    }

    const newUser = new User({
      name,
      gender,
      email,
      dob: new Date(dob),
    });

    const savedUser = await newUser.save();
    res.status(201).json(savedUser);
  } catch (err) {
    res
      .status(400)
      .json({ error: "Error creating user", details: err.message });
  }
});

userRouter.get("/users", async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    res
      .status(500)
      .json({ error: "Error fetching users", details: err.message });
  }
});

userRouter.get("/users/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.json(user);
  } catch (err) {
    res
      .status(500)
      .json({ error: "Error fetching user", details: err.message });
  }
});

userRouter.put("/users/:id", async (req, res) => {
  try {
    const { name, gender, email, dob } = req.body;

    if (email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return res.status(400).json({ error: "Invalid email format" });
      }
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      {
        ...(name && { name }),
        ...(gender && { gender }),
        ...(email && { email }),
        ...(dob && { dob: new Date(dob) }),
      },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json(updatedUser);
  } catch (err) {
    res
      .status(500)
      .json({ error: "Error updating user", details: err.message });
  }
});

userRouter.get("/user/votecoins", verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.json({
      success: true,
      votecoins: user.votecoins || 0,
      lastUpdated: user.lastUpdated || new Date().toISOString(),
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Error fetching votecoins",
      error: err.message,
    });
  }
});

userRouter.put("/user/votecoins", verifyToken, async (req, res) => {
  try {
    const { amount, operation } = req.body;

    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (operation === "subtract" && user.votecoins < amount) {
      return res.status(400).json({
        success: false,
        message: "Insufficient votecoins",
      });
    }

    user.votecoins =
      operation === "add"
        ? (user.votecoins || 0) + Number(amount)
        : (user.votecoins || 0) - Number(amount);

    user.lastUpdated = new Date();
    await user.save();

    res.json({
      success: true,
      votecoins: user.votecoins,
      lastUpdated: user.lastUpdated,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Error updating votecoins",
      error: err.message,
    });
  }
});

userRouter.get("/stats", verifyToken, async (req, res) => {
  try {
    const currentUser = await User.findById(req.user.userId);
    const [totalStats] = await User.aggregate([
      {
        $group: {
          _id: null,
          totalVotes: { $sum: "$voted" },
          totalUsers: { $sum: 1 },
        },
      },
    ]);

    res.json({
      success: true,
      stats: {
        userVotes: currentUser.voted || 0,
        totalVotes: totalStats.totalVotes || 0,
        registeredVoters: totalStats.totalUsers || 0,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching voting statistics",
    });
  }
});

userRouter.put("/user/vote", verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    user.voted = (user.voted || 0) + 1;
    await user.save();

    res.json({
      success: true,
      voted: user.voted,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Error updating vote count",
      error: err.message,
    });
  }
});

userRouter.put("/user/profile-image", verifyToken, upload.single('image'), async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    if (user.image && user.image.public_id) {
      try {
        await cloudinary.uploader.destroy(user.image.public_id);
      } catch (deleteError) {
        console.error('Error deleting old image:', deleteError);
      }
    }

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No image file provided"
      });
    }

    user.image = {
      public_id: req.file.filename,
      url: req.file.path
    };

    await user.save();

    res.json({
      success: true,
      user: {
        ...user.toObject(),
        password: undefined
      }
    });

  } catch (err) {
    console.error('Profile image update error:', err);
    res.status(500).json({
      success: false,
      message: "Error updating image",
      error: err.message
    });
  }
});

userRouter.get("/user/profile-image", verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    res.json({
      success: true,
      image: user.image?.url || ""
    });
  } catch (err) {
    console.error('Error fetching image:', err);
    res.status(500).json({
      success: false,
      message: "Error fetching image",
      error: err.message
    });
  }
});

export default userRouter;

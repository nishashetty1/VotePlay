import express from "express";
import { verifyToken } from "../middleware/auth.js";
import { User } from "../models/User.model.js";
import { categoryModels } from "../models/Category.model.js";

const categoryRouter = express.Router();

categoryRouter.get("/category/:category", async (req, res) => {
  try {
    const category = req.params.category.toLowerCase();
    const Model = categoryModels[category];

    if (!Model) {
      return res.status(404).json({
        success: false,
        error: "Category not found",
      });
    }

    const items = await Model.find().select("name logo count team");

    if (!items || items.length === 0) {
      return res.status(404).json({
        success: false,
        error: "No items found in this category",
      });
    }

    res.json(items);
  } catch (err) {
    res.status(500).json({
      success: false,
      error: "Error fetching items",
      details: err.message,
    });
  }
});

categoryRouter.get("/category/:category/:id", async (req, res) => {
  try {
    const category = req.params.category.toLowerCase();
    const Model = categoryModels[category];

    if (!Model) {
      return res.status(404).json({ error: "Category not found" });
    }

    const item = await Model.findById(req.params.id);
    if (!item) {
      return res.status(404).json({ error: "Item not found" });
    }
    res.json(item);
  } catch (err) {
    res
      .status(500)
      .json({ error: "Error fetching item", details: err.message });
  }
});

categoryRouter.put(
  "/category/:category/:id/vote",
  verifyToken,
  async (req, res) => {
    try {
      const category = req.params.category.toLowerCase();
      const Model = categoryModels[category];

      if (!Model) {
        return res.status(404).json({ error: "Category not found" });
      }

      const session = await Model.startSession();
      session.startTransaction();

      try {
        const updatedItem = await Model.findByIdAndUpdate(
          req.params.id,
          { $inc: { count: 1 } },
          { new: true, session }
        );

        if (!updatedItem) {
          throw new Error("Item not found");
        }

        const user = await User.findById(req.user.userId);
        if (!user) {
          throw new Error("User not found");
        }

        user.voted = (user.voted || 0) + 1;
        await user.save({ session });

        await session.commitTransaction();
        session.endSession();

        res.json({
          success: true,
          item: updatedItem,
          userVotecoins: user.votecoins,
        });
      } catch (error) {
        await session.abortTransaction();
        session.endSession();
        throw error;
      }
    } catch (err) {
      res.status(500).json({
        success: false,
        error: err.message || "Error updating vote count",
      });
    }
  }
);

categoryRouter.get("/category/:category/stats", async (req, res) => {
  try {
    const category = req.params.category.toLowerCase();
    const Model = categoryModels[category];

    if (!Model) {
      return res.status(404).json({ error: "Category not found" });
    }

    const stats = await Model.aggregate([
      {
        $group: {
          _id: null,
          totalVotes: { $sum: "$count" },
          maxVotes: { $max: "$count" },
          minVotes: { $min: "$count" },
        },
      },
    ]);

    res.json({
      success: true,
      stats: stats[0] || { totalVotes: 0, maxVotes: 0, minVotes: 0 },
    });
  } catch (err) {
    res
      .status(500)
      .json({ error: "Error fetching statistics", details: err.message });
  }
});

export default categoryRouter;

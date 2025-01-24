import express from "express";
import { Team } from "../models/Team.model.js";

const teamRouter = express.Router();

// Get All Teams
teamRouter.get("/teams", async (req, res) => {
  try {
    const teams = await Team.find();
    res.json(teams);
  } catch (err) {
    res
      .status(500)
      .json({ error: "Error fetching teams", details: err.message });
  }
});

// Get Single Team
teamRouter.get("/teams/:id", async (req, res) => {
  try {
    const team = await Team.findById(req.params.id);
    if (!team) {
      return res.status(404).json({ error: "Team not found" });
    }
    res.json(team);
  } catch (err) {
    res
      .status(500)
      .json({ error: "Error fetching team", details: err.message });
  }
});

// Update Team Vote Count
teamRouter.put("/teams/:id/vote", async (req, res) => {
  try {
    const updatedTeam = await Team.findByIdAndUpdate(
      req.params.id,
      { $inc: { count: 1 } },
      { new: true }
    );

    if (!updatedTeam) {
      return res.status(404).json({ error: "Team not found" });
    }

    res.json(updatedTeam);
  } catch (err) {
    res
      .status(500)
      .json({ error: "Error updating vote count", details: err.message });
  }
});

export default teamRouter;

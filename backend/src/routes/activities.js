import express from "express";
import { activities } from "../data/initialIssues.js";

const router = express.Router();

router.get("/", (req, res) => {
  res.json({ success: true, count: activities.length, data: activities });
});

export default router;

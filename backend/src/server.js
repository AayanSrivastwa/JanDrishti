import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import issuesRouter from "./routes/issues.js";
import activitiesRouter from "./routes/activities.js";
import statsRouter from "./routes/stats.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Health Check
app.get("/api/health", (req, res) => {
  res.json({
    status: "online",
    system: "JanDrishti Civic API Engine",
    version: "2.0.0",
    city: "Delhi NCT & NCR",
    timestamp: new Date().toISOString(),
  });
});

// API Routes
app.use("/api/issues", issuesRouter);
app.use("/api/activities", activitiesRouter);
app.use("/api/stats", statsRouter);

// 404 Catch-All
app.use((req, res) => {
  res.status(404).json({ success: false, message: `Route ${req.originalUrl} not found on JanDrishti API` });
});

app.listen(PORT, () => {
  console.log(`🚀 JanDrishti Backend API running on http://localhost:${PORT}`);
  console.log(`📡 Health Check: http://localhost:${PORT}/api/health`);
  console.log(`📍 Issues Endpoint: http://localhost:${PORT}/api/issues`);
});

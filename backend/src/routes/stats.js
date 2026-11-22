import express from "express";
import { issues } from "../data/initialIssues.js";

const router = express.Router();

router.get("/summary", (req, res) => {
  const total = issues.length;
  const inProgress = issues.filter((i) => i.status === "progress").length;
  const verification = issues.filter((i) => i.status === "verification").length;
  const resolved = issues.filter((i) => i.status === "resolved").length;
  const underReview = issues.filter((i) => i.status === "review").length;

  const categoriesCount = {};
  issues.forEach((i) => {
    categoriesCount[i.category] = (categoriesCount[i.category] || 0) + 1;
  });

  const wardDistribution = {};
  issues.forEach((i) => {
    wardDistribution[i.ward] = (wardDistribution[i.ward] || 0) + 1;
  });

  res.json({
    success: true,
    data: {
      total,
      inProgress,
      verification,
      resolved,
      underReview,
      categoriesCount,
      wardDistribution,
      verificationRate: total > 0 ? ((resolved / total) * 100).toFixed(1) + "%" : "0%",
      avgSlaHours: 28,
    },
  });
});

export default router;

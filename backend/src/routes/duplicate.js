import express from "express";
import { issues } from "../data/initialIssues.js";

const router = express.Router();

// Haversine distance in kilometers between two lat/lng points
function haversineKm(lat1, lon1, lat2, lon2) {
  const toRad = (x) => (x * Math.PI) / 180;
  const R = 6371; // Earth radius in km
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

// POST check for duplicate/similar issues nearby
router.post(["/check", "/check-duplicate"], (req, res) => {
  const { category, latitude, longitude, title, description, ward, radiusKm = 1 } = req.body;

  if (!latitude || !longitude) {
    return res.status(400).json({ success: false, message: "Latitude and longitude are required" });
  }

  const lat = parseFloat(latitude);
  const lng = parseFloat(longitude);
  const radius = parseFloat(radiusKm);

  const catLower = (category || "").toLowerCase();
  const titleLower = (title || "").toLowerCase();
  const descLower = (description || "").toLowerCase();

  const potentialDuplicates = issues
    .map((issue) => {
      const dist = haversineKm(lat, lng, issue.latitude, issue.longitude);
      if (dist > radius) return null;

      let score = 0;
      const reasons = [];

      // Same category
      if (catLower && issue.category.toLowerCase() === catLower) {
        score += 40;
        reasons.push("Same category");
      }

      // Same ward
      if (ward && issue.ward.toLowerCase().includes(ward.toLowerCase())) {
        score += 25;
        reasons.push("Same ward/locality");
      }

      // Proximity bonus (closer = higher score)
      if (dist < 0.2) score += 20;
      else if (dist < 0.5) score += 10;
      else if (dist < 1) score += 5;

      // Title/description keyword overlap
      const titleWords = titleLower.split(/\s+/).filter((w) => w.length > 3);
      const descWords = descLower.split(/\s+/).filter((w) => w.length > 3);
      const issueText = (issue.title + " " + issue.description).toLowerCase();

      let keywordMatches = 0;
      [...titleWords, ...descWords].forEach((w) => {
        if (issueText.includes(w)) keywordMatches += 1;
      });
      if (keywordMatches > 0) {
        score += Math.min(keywordMatches * 5, 20);
        reasons.push(`${keywordMatches} matching keyword(s)`);
      }

      return { issue, distanceKm: Math.round(dist * 100) / 100, score, reasons };
    })
    .filter(Boolean)
    .filter((item) => item.score >= 30) // threshold for "potential duplicate"
    .sort((a, b) => b.score - a.score);

  const hasDuplicates = potentialDuplicates.length > 0;

  res.json({
    success: true,
    hasDuplicates,
    searchLocation: { latitude: lat, longitude: lng, radiusKm: radius },
    potentialDuplicates: potentialDuplicates.slice(0, 5),
    message: hasDuplicates
      ? `Found ${potentialDuplicates.length} similar issue(s) nearby. Consider linking to an existing report instead of creating a duplicate.`
      : "No similar issues found nearby. Safe to file a new report.",
  });
});

export default router;
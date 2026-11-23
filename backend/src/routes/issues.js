import express from "express";
import { issues, activities } from "../data/initialIssues.js";

const router = express.Router();

// GET all issues (supports ?category=&status=&ward=&search=)
router.get("/", (req, res) => {
  const { category, status, ward, search } = req.query;
  let result = [...issues];

  if (category && category !== "All Categories") {
    result = result.filter((i) => i.category.toLowerCase() === category.toLowerCase());
  }

  if (status && status !== "all") {
    result = result.filter((i) => i.status.toLowerCase() === status.toLowerCase());
  }

  if (ward) {
    result = result.filter((i) => i.ward.toLowerCase().includes(ward.toLowerCase()));
  }

  if (search) {
    const q = search.toLowerCase();
    result = result.filter(
      (i) =>
        i.title.toLowerCase().includes(q) ||
        i.description.toLowerCase().includes(q) ||
        i.ward.toLowerCase().includes(q) ||
        i.id.toLowerCase().includes(q)
    );
  }

  res.json({ success: true, count: result.length, data: result });
});

// GET single issue
router.get("/:id", (req, res) => {
  const issue = issues.find((i) => i.id === req.params.id);
  if (!issue) {
    return res.status(404).json({ success: false, message: "Issue not found" });
  }
  res.json({ success: true, data: issue });
});

// POST create issue
router.post("/", (req, res) => {
  const { id, title, category, ward, description, priority, latitude, longitude, photoUrl, reportedBy, timeline } = req.body;

  if (!title || !title.trim()) {
    return res.status(400).json({ success: false, message: "Title is required" });
  }

  const newId = id || `JD-2026-${String(issues.length + 1).padStart(2, "0")}`;
  const newIssue = {
    id: newId,
    title: title.trim(),
    category: category || "Roads & Potholes",
    ward: ward || "Ward 42 - Connaught Place (NDMC)",
    status: "review",
    latitude: Number(latitude) || 28.6139,
    longitude: Number(longitude) || 77.2090,
    description: description ? description.trim() : "Reported via JanDrishti Civic Portal.",
    reportedBy: reportedBy || "Citizen Reporter",
    reportedAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    priority: priority || "High",
    upvotes: 1,
    upvotedBy: [reportedBy || "Citizen"],
    assignedOfficer: "Assigning to Ward Engineer...",
    slaHours: priority === "Urgent" ? 12 : priority === "High" ? 24 : 48,
    evidenceBefore: photoUrl || null,
    evidenceAfter: null,
    resolutionProof: null,
    citizenVerified: false,
    timeline: [
      { step: "Reported", time: "Just now", desc: "Ticket filed with GPS coordinates and photographic geotag." }
    ]
  };

  issues.unshift(newIssue);
  activities.unshift({
    id: Date.now(),
    type: "create",
    issueId: newId,
    issueTitle: newIssue.title,
    user: reportedBy || "Citizen",
    time: "Just now"
  });

  res.status(201).json({ success: true, data: newIssue });
});

// PATCH / PUT update status (verify, dispute)
router.patch("/:id/status", (req, res) => {
  const { id } = req.params;
  const { status, userActor, disputeReason } = req.body;

  const issue = issues.find((i) => i.id === id);
  if (!issue) {
    return res.status(404).json({ success: false, message: "Issue not found" });
  }

  const isVerified = status === "resolved";
  const isDisputed = status === "progress" && issue.status === "verification";

  if (isVerified) {
    issue.timeline.push({
      step: "Citizen Verified & Closed",
      time: "Just now",
      desc: `Confirmed resolved by ${userActor || "Citizen Inspector"}. Official civic closure ledger recorded.`
    });
    issue.citizenVerified = true;
  } else if (isDisputed) {
    issue.timeline.push({
      step: "Citizen Disputed & Escalated",
      time: "Just now",
      desc: disputeReason
        ? `Disputed: "${disputeReason}". Urgent escalation sent to Executive Engineer.`
        : "Citizen disputed quality of repair. Reopened with priority escalation."
    });
  }

  issue.status = status;
  issue.updatedAt = new Date().toISOString();

  activities.unshift({
    id: Date.now(),
    type: status === "resolved" ? "verify" : "dispute",
    issueId: id,
    issueTitle: issue.title,
    user: userActor || "Citizen",
    time: "Just now"
  });

  res.json({ success: true, data: issue });
});

// POST upvote issue
router.post("/:id/upvote", (req, res) => {
  const { id } = req.params;
  const { userIdentifier } = req.body;
  const user = userIdentifier || "Anonymous Citizen";

  const issue = issues.find((i) => i.id === id);
  if (!issue) {
    return res.status(404).json({ success: false, message: "Issue not found" });
  }

  if (!Array.isArray(issue.upvotedBy)) issue.upvotedBy = [];

  const alreadyUpvoted = issue.upvotedBy.includes(user);
  if (alreadyUpvoted) {
    issue.upvotes = Math.max(0, issue.upvotes - 1);
    issue.upvotedBy = issue.upvotedBy.filter((u) => u !== user);
  } else {
    issue.upvotes += 1;
    issue.upvotedBy.push(user);
  }

  res.json({ success: true, upvoted: !alreadyUpvoted, upvotes: issue.upvotes, data: issue });
});

// POST assign officer (Admin)
router.post("/:id/assign", (req, res) => {
  const { id } = req.params;
  const { officerName, wardDivision } = req.body;

  const issue = issues.find((i) => i.id === id);
  if (!issue) {
    return res.status(404).json({ success: false, message: "Issue not found" });
  }

  issue.assignedOfficer = officerName;
  if (issue.status === "review") {
    issue.status = "progress";
  }
  issue.updatedAt = new Date().toISOString();
  issue.timeline.push({
    step: "Officer Dispatched",
    time: "Just now",
    desc: `Assigned to ${officerName} (${wardDivision || "Field Division"}). Field team mobilized.`
  });

  activities.unshift({
    id: Date.now(),
    type: "assign",
    issueId: id,
    issueTitle: issue.title,
    user: officerName,
    time: "Just now"
  });

  res.json({ success: true, data: issue });
});

// POST submit repair proof (Admin)
router.post("/:id/repair-proof", (req, res) => {
  const { id } = req.params;
  const { contractor, sealNumber, notes, photoUrl } = req.body;

  const issue = issues.find((i) => i.id === id);
  if (!issue) {
    return res.status(404).json({ success: false, message: "Issue not found" });
  }

  issue.status = "verification";
  issue.evidenceAfter = photoUrl || "https://images.unsplash.com/photo-1541888946425-d0fbb1861564?w=800&auto=format&fit=crop&q=80";
  issue.resolutionProof = {
    sealNumber: sealNumber || `SEAL #MCD-${Math.floor(1000 + Math.random() * 9000)}`,
    contractor: contractor || "Municipal Field Unit",
    notes: notes || "Work inspected and repaired by municipal engineering division."
  };
  issue.updatedAt = new Date().toISOString();
  issue.timeline.push({
    step: "Repair Proof Submitted",
    time: "Just now",
    desc: `Work claimed completed by ${contractor || "Field Team"} (${sealNumber || "Official Seal"}). Sent to citizen for verification.`
  });

  activities.unshift({
    id: Date.now(),
    type: "repair_claim",
    issueId: id,
    issueTitle: issue.title,
    user: contractor || "Municipal Engineer",
    time: "Just now"
  });

  res.json({ success: true, data: issue });
});

export default router;

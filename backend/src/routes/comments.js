import express from "express";
import { issues } from "../data/initialIssues.js";

const router = express.Router();

// In-memory comments store (mirrors issues in prototype mode)
export let comments = {};

// GET all comments for an issue
router.get("/:issueId/comments", (req, res) => {
  const { issueId } = req.params;
  const issueComments = comments[issueId] || [];
  res.json({ success: true, count: issueComments.length, data: issueComments });
});

// POST add a comment to an issue
router.post("/:issueId/comments", (req, res) => {
  const { issueId } = req.params;
  const { author, authorRole, text, avatar } = req.body;

  if (!text || !text.trim()) {
    return res.status(400).json({ success: false, message: "Comment text is required" });
  }

  const issue = issues.find((i) => i.id === issueId);
  if (!issue) {
    return res.status(404).json({ success: false, message: "Issue not found" });
  }

  const newComment = {
    id: `cmt_${Date.now()}`,
    issueId,
    author: author || "Citizen",
    authorRole: authorRole || "citizen",
    text: text.trim(),
    avatar: avatar || null,
    createdAt: new Date().toISOString(),
  };

  if (!comments[issueId]) {
    comments[issueId] = [];
  }
  comments[issueId].unshift(newComment);

  res.status(201).json({ success: true, data: newComment });
});

// DELETE a comment (author or admin)
router.delete("/:issueId/comments/:commentId", (req, res) => {
  const { issueId, commentId } = req.params;
  const author = req.query.author || req.body?.author;

  const issueComments = comments[issueId];
  if (!issueComments) {
    return res.status(404).json({ success: false, message: "No comments for this issue" });
  }

  const idx = issueComments.findIndex((c) => c.id === commentId);
  if (idx === -1) {
    return res.status(404).json({ success: false, message: "Comment not found" });
  }

  const comment = issueComments[idx];
  // Allow delete if comment author matches or caller is admin (simple prototype check)
  if (author && comment.author !== author && author !== "admin") {
    return res.status(403).json({ success: false, message: "Not authorized to delete this comment" });
  }

  issueComments.splice(idx, 1);
  res.json({ success: true, message: "Comment deleted" });
});

export default router;
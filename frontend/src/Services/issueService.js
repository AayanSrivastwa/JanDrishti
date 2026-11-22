/**
 * JanDrishti - Civic Issue Management Service
 * Dual-Mode Engine:
 * 1. Automatically communicates with the Node.js/Express Backend API
 * 2. Seamlessly falls back to localStorage store if backend is offline or during testing
 */

// In production, VITE_BACKEND_URL should be set to your deployed backend URL.
// If not set, falls back to relative /api (works when backend & frontend are co-hosted),
// or localhost for local development.
const BACKEND_API_URL =
  import.meta.env.VITE_BACKEND_URL ||
  (import.meta.env.PROD ? "/api" : "http://localhost:5000/api");

const STORAGE_KEY = "jandrishti_issues_v2";
const ACTIVITY_KEY = "jandrishti_activity_v2";
const COMMENTS_KEY = "jandrishti_comments_v2";

export const DELHI_INITIAL_ISSUES = [
  {
    id: "JD-2026-01",
    title: "Deep Pothole Crater on Outer Ring Road Flyover",
    category: "Roads & Potholes",
    ward: "Ward 58 - Lajpat Nagar",
    status: "progress",
    latitude: 28.5700,
    longitude: 77.2400,
    description: "Hazardous crater on arterial ring road causing serious vehicle damage and traffic bottleneck near Nehru Place exit.",
    reportedBy: "Ananya K.",
    reportedAt: new Date(Date.now() - 36 * 3600 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 2 * 3600 * 1000).toISOString(),
    priority: "Urgent",
    upvotes: 24,
    upvotedBy: [],
    assignedOfficer: "Rajesh Sharma, PWD South Division",
    slaHours: 36,
    evidenceBefore: "https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?w=800&auto=format&fit=crop&q=80",
    evidenceAfter: null,
    resolutionProof: null,
    citizenVerified: false,
    timeline: [
      { step: "Reported", time: "36 hrs ago", desc: "Geotagged hazard registered by citizen with photo proof." },
      { step: "Assigned", time: "18 hrs ago", desc: "Routed to PWD Delhi South Division (Officer Rajesh Sharma)." },
      { step: "Work in Progress", time: "2 hrs ago", desc: "Field road maintenance team deployed with cold-mix asphalt." }
    ]
  },
  {
    id: "JD-2026-02",
    title: "Drinking Water Pipeline Burst & Sidewalk Flooding",
    category: "Water Supply",
    ward: "Ward 42 - Connaught Place (NDMC)",
    status: "verification",
    latitude: 28.6315,
    longitude: 77.2167,
    description: "Delhi Jal Board main line rupture repaired with heavy-duty ductile sleeve. Citizen inspection needed before official closure.",
    reportedBy: "Devendra Verma",
    reportedAt: new Date(Date.now() - 20 * 3600 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 1 * 3600 * 1000).toISOString(),
    priority: "High",
    upvotes: 42,
    upvotedBy: [],
    assignedOfficer: "Sunil Meena, DJB Central Zone",
    slaHours: 24,
    evidenceBefore: "https://images.unsplash.com/photo-1584824486509-112e4181ff6b?w=800&auto=format&fit=crop&q=80",
    evidenceAfter: "https://images.unsplash.com/photo-1541888946425-d0fbb1861564?w=800&auto=format&fit=crop&q=80",
    resolutionProof: {
      sealNumber: "SEAL #DJB-2026-7714",
      contractor: "Delhi Jal Board Emergency Unit",
      notes: "High-pressure PVC sleeve installed. Pavement restored."
    },
    citizenVerified: false,
    timeline: [
      { step: "Reported", time: "20 hrs ago", desc: "Burst main reported with geotagged flood evidence." },
      { step: "Emergency Response", time: "16 hrs ago", desc: "DJB deployed emergency leak unit within 4 hours." },
      { step: "Repair Proof Submitted", time: "1 hr ago", desc: "Sleeve repair complete. Citizen verification requested." }
    ]
  },
  {
    id: "JD-2026-03",
    title: "Faulty Streetlight Pole #42 Dark Corridor",
    category: "Streetlighting",
    ward: "Ward 71 - Hauz Khas",
    status: "review",
    latitude: 28.5494,
    longitude: 77.2001,
    description: "Dark transit corridors, flickering fixtures, exposed junction wiring, and knocked-down poles.",
    reportedBy: "Priya Singh",
    reportedAt: new Date(Date.now() - 8 * 3600 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 8 * 3600 * 1000).toISOString(),
    priority: "High",
    upvotes: 18,
    upvotedBy: [],
    assignedOfficer: null,
    slaHours: 48,
    evidenceBefore: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&auto=format&fit=crop&q=80",
    evidenceAfter: null,
    resolutionProof: null,
    citizenVerified: false,
    timeline: [
      { step: "Reported", time: "8 hrs ago", desc: "Dark transit zone reported near Hauz Khas Market." }
    ]
  },
  {
    id: "JD-2026-04",
    title: "Overflowing Drain & Sewage Backflow — Rohini Sector 9",
    category: "Drainage & Sewage",
    ward: "Ward 24 - Rohini Sector 9",
    status: "progress",
    latitude: 28.7297,
    longitude: 77.1013,
    description: "MCD drain blocked with construction debris, causing sewage overflow onto residential footpath.",
    reportedBy: "Rahul Nair",
    reportedAt: new Date(Date.now() - 48 * 3600 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 4 * 3600 * 1000).toISOString(),
    priority: "High",
    upvotes: 31,
    upvotedBy: [],
    assignedOfficer: "MCD Drainage Rohini",
    slaHours: 48,
    evidenceBefore: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&auto=format&fit=crop&q=80",
    evidenceAfter: null,
    resolutionProof: null,
    citizenVerified: false,
    timeline: [
      { step: "Reported", time: "48 hrs ago", desc: "Sewage backflow reported with photo proof." },
      { step: "Assigned", time: "30 hrs ago", desc: "MCD Drainage Rohini Division assigned." },
      { step: "Jetting Machine Deployed", time: "4 hrs ago", desc: "High-pressure jetting unit clearing blocked section." }
    ]
  },
  {
    id: "JD-2026-05",
    title: "Broken Park Bench & Unsafe Playground Equipment",
    category: "Parks & Green Spaces",
    ward: "Ward 55 - Defence Colony",
    status: "resolved",
    latitude: 28.5705,
    longitude: 77.2300,
    description: "Park benches with exposed metal spikes and rusted playground slides causing injury risk repaired and replaced.",
    reportedBy: "Meena Kapoor",
    reportedAt: new Date(Date.now() - 72 * 3600 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 12 * 3600 * 1000).toISOString(),
    priority: "Normal",
    upvotes: 15,
    upvotedBy: [],
    assignedOfficer: "SDMC Horticulture",
    slaHours: 72,
    evidenceBefore: "https://images.unsplash.com/photo-1572025442646-866d16c84a54?w=800&auto=format&fit=crop&q=80",
    evidenceAfter: "https://images.unsplash.com/photo-1575783970733-1aaedde1db74?w=800&auto=format&fit=crop&q=80",
    resolutionProof: {
      sealNumber: "SEAL #SDMC-2026-4421",
      contractor: "SDMC Parks & Gardens Division",
      notes: "Three benches replaced with galvanized steel models. All slides inspected and repainted."
    },
    citizenVerified: true,
    timeline: [
      { step: "Reported", time: "72 hrs ago", desc: "Safety hazard reported by parent." },
      { step: "Assigned", time: "48 hrs ago", desc: "SDMC Horticulture dispatched." },
      { step: "Repair Proof Submitted", time: "24 hrs ago", desc: "Replacement equipment installed." },
      { step: "Citizen Verified & Closed", time: "12 hrs ago", desc: "Local parent group confirmed resolution." }
    ]
  },
  {
    id: "JD-2026-06",
    title: "Garbage Dump & Open Waste Burning Near School",
    category: "Waste Management",
    ward: "Ward 36 - Saket",
    status: "review",
    latitude: 28.5245,
    longitude: 77.2066,
    description: "Illegal garbage dump near school causing health hazard and open burning incidents.",
    reportedBy: "Teacher, DPS Saket",
    reportedAt: new Date(Date.now() - 6 * 3600 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 6 * 3600 * 1000).toISOString(),
    priority: "Urgent",
    upvotes: 55,
    upvotedBy: [],
    assignedOfficer: null,
    slaHours: 12,
    evidenceBefore: "https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=800&auto=format&fit=crop&q=80",
    evidenceAfter: null,
    resolutionProof: null,
    citizenVerified: false,
    timeline: [
      { step: "Reported", time: "6 hrs ago", desc: "Open garbage dump near school gate reported with photos." }
    ]
  }
];

/* ============================================================================
   INTERNAL HELPERS
   ============================================================================ */

function getStoredIssues() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {
    // ignore
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(DELHI_INITIAL_ISSUES));
  return DELHI_INITIAL_ISSUES;
}

function saveIssues(issues) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(issues));
}

async function apiRequest(endpoint, options = {}) {
  try {
    const res = await fetch(`${BACKEND_API_URL}${endpoint}`, {
      headers: { "Content-Type": "application/json" },
      ...options,
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch {
    return null; // Backend unavailable — caller falls back to localStorage
  }
}

/* ============================================================================
   ISSUES CRUD
   ============================================================================ */

export async function fetchIssues(filters = {}) {
  const params = new URLSearchParams();
  if (filters.category && filters.category !== "All Categories")
    params.set("category", filters.category);
  if (filters.status && filters.status !== "all")
    params.set("status", filters.status);
  if (filters.search) params.set("search", filters.search);

  const query = params.toString();
  const result = await apiRequest(`/issues${query ? `?${query}` : ""}`);
  if (result?.success) return result.data;
  return getStoredIssues();
}

export async function createIssue(issueData) {
  const result = await apiRequest("/issues", {
    method: "POST",
    body: JSON.stringify(issueData),
  });

  const issues = getStoredIssues();

  if (result?.success) {
    const newIssue = result.data;
    issues.unshift(newIssue);
    saveIssues(issues);
    return newIssue;
  }

  // Offline fallback
  const newId =
    issueData.id ||
    `JD-${new Date().getFullYear()}-${String(issues.length + 1).padStart(2, "0")}`;
  const newIssue = {
    id: newId,
    ...issueData,
    status: "review",
    reportedAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    upvotes: 1,
    upvotedBy: [issueData.reportedBy || "Citizen"],
    citizenVerified: false,
    evidenceAfter: null,
    resolutionProof: null,
    timeline: [
      {
        step: "Reported",
        time: "Just now",
        desc: "Ticket filed with GPS coordinates and photographic geotag.",
      },
    ],
  };
  issues.unshift(newIssue);
  saveIssues(issues);
  return newIssue;
}

export async function updateIssueStatusAsync(issueId, status, options = {}) {
  const result = await apiRequest(`/issues/${issueId}/status`, {
    method: "PATCH",
    body: JSON.stringify({ status, ...options }),
  });

  if (result?.success) {
    const issues = getStoredIssues();
    const idx = issues.findIndex((i) => i.id === issueId);
    if (idx !== -1) {
      issues[idx] = result.data;
      saveIssues(issues);
    }
    return result.data;
  }

  const issues = getStoredIssues();
  const idx = issues.findIndex((i) => i.id === issueId);
  if (idx === -1) return null;
  issues[idx] = { ...issues[idx], status, updatedAt: new Date().toISOString() };
  saveIssues(issues);
  return issues[idx];
}

export async function upvoteIssueAsync(issueId, userIdentifier) {
  const result = await apiRequest(`/issues/${issueId}/upvote`, {
    method: "POST",
    body: JSON.stringify({ userIdentifier }),
  });

  if (result?.success) {
    const issues = getStoredIssues();
    const idx = issues.findIndex((i) => i.id === issueId);
    if (idx !== -1) {
      issues[idx] = result.data;
      saveIssues(issues);
    }
    return result;
  }

  const issues = getStoredIssues();
  const idx = issues.findIndex((i) => i.id === issueId);
  if (idx === -1) return null;

  const issue = issues[idx];
  if (!Array.isArray(issue.upvotedBy)) issue.upvotedBy = [];
  const alreadyUpvoted = issue.upvotedBy.includes(userIdentifier);
  if (alreadyUpvoted) {
    issue.upvotes = Math.max(0, issue.upvotes - 1);
    issue.upvotedBy = issue.upvotedBy.filter((u) => u !== userIdentifier);
  } else {
    issue.upvotes += 1;
    issue.upvotedBy.push(userIdentifier);
  }
  saveIssues(issues);
  return { success: true, upvoted: !alreadyUpvoted, upvotes: issue.upvotes, data: issue };
}

export async function assignOfficerAsync(issueId, officerName, wardDivision) {
  const result = await apiRequest(`/issues/${issueId}/assign`, {
    method: "POST",
    body: JSON.stringify({ officerName, wardDivision }),
  });

  if (result?.success) {
    const issues = getStoredIssues();
    const idx = issues.findIndex((i) => i.id === issueId);
    if (idx !== -1) {
      issues[idx] = result.data;
      saveIssues(issues);
    }
    return result.data;
  }

  const issues = getStoredIssues();
  const idx = issues.findIndex((i) => i.id === issueId);
  if (idx === -1) return null;
  issues[idx].assignedOfficer = officerName;
  issues[idx].status = "progress";
  issues[idx].updatedAt = new Date().toISOString();
  saveIssues(issues);
  return issues[idx];
}

export async function submitRepairProofAsync(issueId, proofData) {
  const result = await apiRequest(`/issues/${issueId}/repair-proof`, {
    method: "POST",
    body: JSON.stringify(proofData),
  });

  if (result?.success) {
    const issues = getStoredIssues();
    const idx = issues.findIndex((i) => i.id === issueId);
    if (idx !== -1) {
      issues[idx] = result.data;
      saveIssues(issues);
    }
    return result.data;
  }

  const issues = getStoredIssues();
  const idx = issues.findIndex((i) => i.id === issueId);
  if (idx === -1) return null;
  issues[idx].status = "verification";
  issues[idx].evidenceAfter =
    proofData.photoUrl ||
    "https://images.unsplash.com/photo-1541888946425-d0fbb1861564?w=800&auto=format&fit=crop&q=80";
  issues[idx].resolutionProof = {
    sealNumber: proofData.sealNumber || `SEAL #MCD-${Math.floor(1000 + Math.random() * 9000)}`,
    contractor: proofData.contractor || "Municipal Field Unit",
    notes: proofData.notes || "Work inspected and repaired.",
  };
  issues[idx].updatedAt = new Date().toISOString();
  saveIssues(issues);
  return issues[idx];
}

/* ============================================================================
   ACTIVITIES
   ============================================================================ */

export function getStoredActivities() {
  try {
    const raw = localStorage.getItem(ACTIVITY_KEY);
    if (raw) return JSON.parse(raw);
  } catch {
    // ignore
  }
  return [];
}

export function addActivity(activity) {
  const activities = getStoredActivities();
  const updated = [{ id: Date.now(), ...activity, time: "Just now" }, ...activities];
  localStorage.setItem(ACTIVITY_KEY, JSON.stringify(updated));
  return updated;
}

export async function fetchActivities() {
  const result = await apiRequest("/activities");
  if (result?.success) return result.data;
  return getStoredActivities();
}

export async function fetchStats() {
  const result = await apiRequest("/stats/summary");
  if (result?.success) return result.data;
  return null;
}

/* ============================================================================
   COMMENTS SYSTEM (localStorage + backend sync)
   ============================================================================ */

export function getStoredComments(issueId) {
  try {
    const raw = localStorage.getItem(COMMENTS_KEY);
    const all = raw ? JSON.parse(raw) : {};
    return all[issueId] || [];
  } catch {
    return [];
  }
}

export function addIssueComment(issueId, { author, authorRole, text, avatar }) {
  const newComment = {
    id: `cmt_${Date.now()}`,
    issueId,
    author: author || "Citizen",
    authorRole: authorRole || "citizen",
    text: text.trim(),
    avatar: avatar || null,
    createdAt: new Date().toISOString(),
  };

  try {
    const raw = localStorage.getItem(COMMENTS_KEY);
    const all = raw ? JSON.parse(raw) : {};
    if (!all[issueId]) all[issueId] = [];
    all[issueId].unshift(newComment);
    localStorage.setItem(COMMENTS_KEY, JSON.stringify(all));
  } catch {
    // ignore
  }

  // Fire-and-forget to backend
  apiRequest(`/issues/${issueId}/comments`, {
    method: "POST",
    body: JSON.stringify({ author, authorRole, text, avatar }),
  });

  return newComment;
}

export function deleteIssueComment(issueId, commentId, author) {
  try {
    const raw = localStorage.getItem(COMMENTS_KEY);
    const all = raw ? JSON.parse(raw) : {};
    if (!all[issueId]) return [];
    all[issueId] = all[issueId].filter((c) => c.id !== commentId);
    localStorage.setItem(COMMENTS_KEY, JSON.stringify(all));

    apiRequest(`/issues/${issueId}/comments/${commentId}?author=${encodeURIComponent(author)}`, {
      method: "DELETE",
    });

    return all[issueId];
  } catch {
    return [];
  }
}

/* ============================================================================
   DUPLICATE CHECK
   ============================================================================ */

function haversineKm(lat1, lon1, lat2, lon2) {
  const toRad = (x) => (x * Math.PI) / 180;
  const R = 6371;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

export function findPotentialDuplicates({ category, latitude, longitude, title, description, ward, radiusKm = 1 }) {
  const issues = getStoredIssues();
  const lat = parseFloat(latitude);
  const lng = parseFloat(longitude);
  const radius = parseFloat(radiusKm);

  const catLower = (category || "").toLowerCase();
  const titleLower = (title || "").toLowerCase();
  const descLower = (description || "").toLowerCase();

  const duplicates = issues
    .map((issue) => {
      const dist = haversineKm(lat, lng, issue.latitude, issue.longitude);
      if (dist > radius) return null;

      let score = 0;
      const reasons = [];

      if (catLower && issue.category.toLowerCase() === catLower) {
        score += 40;
        reasons.push("Same category");
      }

      if (ward && issue.ward.toLowerCase().includes(ward.toLowerCase())) {
        score += 25;
        reasons.push("Same ward/locality");
      }

      if (dist < 0.2) score += 20;
      else if (dist < 0.5) score += 10;
      else if (dist < 1) score += 5;

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
    .filter((item) => item.score >= 30)
    .sort((a, b) => b.score - a.score)
    .slice(0, 5);

  return {
    hasDuplicates: duplicates.length > 0,
    duplicates,
    message: duplicates.length > 0
      ? `Found ${duplicates.length} similar issue(s) nearby. Consider linking to an existing report.`
      : "No similar issues found nearby.",
  };
}

/* ============================================================================
   SLA & DEADLINE HELPERS
   ============================================================================ */

export function computeSLAStatus(issue) {
  if (!issue.slaHours || !issue.reportedAt) {
    return { status: "unknown", hoursRemaining: null, isOverdue: false, pctElapsed: 0 };
  }

  const reported = new Date(issue.reportedAt).getTime();
  const now = Date.now();
  const slaMs = issue.slaHours * 60 * 60 * 1000;
  const elapsedMs = now - reported;
  const remainingMs = slaMs - elapsedMs;
  const hoursRemaining = Math.max(0, remainingMs / (1000 * 60 * 60));
  const isOverdue = remainingMs < 0;
  const pctElapsed = Math.min(100, Math.max(0, (elapsedMs / slaMs) * 100));

  let status = "on_track";
  if (isOverdue) status = "overdue";
  else if (pctElapsed > 80) status = "at_risk";
  else if (pctElapsed > 50) status = "warning";

  return { status, hoursRemaining, isOverdue, pctElapsed };
}

export function formatSLAHours(hours) {
  if (hours === null || hours === undefined) return "—";
  const h = Math.floor(hours);
  const m = Math.round((hours - h) * 60);
  if (h > 0) return `${h}h ${m}m`;
  return `${m}m`;
}

/* ============================================================================
   LEGACY SYNCHRONOUS API
   These functions are used by Dashboard.jsx and AdminPortal.jsx and operate
   directly on localStorage (no async/await needed). They return arrays/objects
   synchronously for immediate React state updates.
   ============================================================================ */

/** Returns all issues from localStorage (seeds defaults if empty). */
export { getStoredIssues };

/** Alias for getStoredActivities — used in Dashboard activity feed. */
export function getActivities() {
  return getStoredActivities();
}

/**
 * Creates a new civic issue, saves to localStorage, returns the full issues array.
 * Used by Dashboard.jsx handleCreateReport().
 */
export function createNewIssue(issueData) {
  const issues = getStoredIssues();
  const newId =
    issueData.id ||
    `JD-${new Date().getFullYear()}-${String(issues.length + 1).padStart(2, "0")}`;

  const newIssue = {
    id: newId,
    title: (issueData.title || "").trim(),
    category: issueData.category || "Roads & Potholes",
    ward: issueData.ward || "Ward 42 - Connaught Place (NDMC)",
    status: "review",
    latitude: Number(issueData.latitude) || 28.6139,
    longitude: Number(issueData.longitude) || 77.209,
    description: issueData.description
      ? issueData.description.trim()
      : "Reported via JanDrishti Civic Portal.",
    reportedBy: issueData.reportedBy || "Citizen Reporter",
    reportedAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    priority: issueData.priority || "High",
    upvotes: 1,
    upvotedBy: [issueData.reportedBy || "Citizen"],
    assignedOfficer: "Assigning to Ward Engineer...",
    slaHours:
      issueData.priority === "Urgent"
        ? 12
        : issueData.priority === "High"
        ? 24
        : 48,
    evidenceBefore: issueData.photoUrl || null,
    evidenceAfter: null,
    resolutionProof: null,
    citizenVerified: false,
    timeline: [
      {
        step: "Reported",
        time: "Just now",
        desc: "Ticket filed with GPS coordinates and photographic geotag.",
      },
    ],
  };

  issues.unshift(newIssue);
  saveIssues(issues);

  // Fire-and-forget sync to backend
  apiRequest("/issues", {
    method: "POST",
    body: JSON.stringify(issueData),
  });

  return newIssue;
}

/**
 * Updates the status of an issue in localStorage, returns updated issues array.
 * Used by Dashboard.jsx handleVerifyIssue / handleConfirmDispute().
 * @param {string} issueId
 * @param {string} status - "resolved" | "progress" | "review" | "verification"
 * @param {string} userActor
 * @param {string} [disputeReason]
 * @returns {Array} updated issues array
 */
export function updateIssueStatus(issueId, status, userActor, disputeReason) {
  const issues = getStoredIssues();
  const idx = issues.findIndex((i) => i.id === issueId);
  if (idx === -1) return issues;

  const issue = issues[idx];
  const isVerified = status === "resolved";
  const isDisputed = status === "progress" && issue.status === "verification";

  if (isVerified) {
    issue.timeline.push({
      step: "Citizen Verified & Closed",
      time: "Just now",
      desc: `Confirmed resolved by ${userActor || "Citizen Inspector"}.`,
    });
    issue.citizenVerified = true;
  } else if (isDisputed) {
    issue.timeline.push({
      step: "Citizen Disputed & Escalated",
      time: "Just now",
      desc: disputeReason
        ? `Disputed: "${disputeReason}". Urgent escalation sent to Executive Engineer.`
        : "Citizen disputed quality of repair. Reopened with priority escalation.",
    });
  }

  issue.status = status;
  issue.updatedAt = new Date().toISOString();
  issues[idx] = issue;
  saveIssues(issues);

  // Fire-and-forget sync to backend
  apiRequest(`/issues/${issueId}/status`, {
    method: "PATCH",
    body: JSON.stringify({ status, userActor, disputeReason }),
  });

  return issues;
}

/**
 * Toggles an upvote for a user on an issue.
 * Used by Dashboard.jsx handleUpvote().
 * @returns {{ updated: Array, hasUpvoted: boolean }}
 */
export function toggleIssueUpvote(issueId, userIdentifier) {
  const issues = getStoredIssues();
  const idx = issues.findIndex((i) => i.id === issueId);
  if (idx === -1) return { updated: issues, hasUpvoted: false };

  const issue = issues[idx];
  if (!Array.isArray(issue.upvotedBy)) issue.upvotedBy = [];

  const alreadyUpvoted = issue.upvotedBy.includes(userIdentifier);
  if (alreadyUpvoted) {
    issue.upvotes = Math.max(0, issue.upvotes - 1);
    issue.upvotedBy = issue.upvotedBy.filter((u) => u !== userIdentifier);
  } else {
    issue.upvotes += 1;
    issue.upvotedBy.push(userIdentifier);
  }
  issues[idx] = issue;
  saveIssues(issues);

  // Fire-and-forget sync
  apiRequest(`/issues/${issueId}/upvote`, {
    method: "POST",
    body: JSON.stringify({ userIdentifier }),
  });

  return { updated: issues, hasUpvoted: !alreadyUpvoted };
}

/**
 * Resets all issues to the initial Delhi dataset.
 * Used by Dashboard.jsx handleResetPrototype().
 * @returns {Array} reset issues array
 */
export function resetToDefaults() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(DELHI_INITIAL_ISSUES));
  localStorage.removeItem(ACTIVITY_KEY);
  localStorage.removeItem(COMMENTS_KEY);
  return DELHI_INITIAL_ISSUES;
}

/**
 * Assigns an officer to an issue and moves it to progress status.
 * Used by AdminPortal.jsx handleDispatchOfficer().
 * @returns {Array} updated issues array
 */
export function assignOfficerToIssue(issueId, officerName, wardDivision) {
  const issues = getStoredIssues();
  const idx = issues.findIndex((i) => i.id === issueId);
  if (idx === -1) return issues;

  issues[idx].assignedOfficer = officerName;
  if (issues[idx].status === "review") issues[idx].status = "progress";
  issues[idx].updatedAt = new Date().toISOString();
  issues[idx].timeline.push({
    step: "Officer Dispatched",
    time: "Just now",
    desc: `Assigned to ${officerName} (${wardDivision || "Field Division"}). Field team mobilized.`,
  });
  saveIssues(issues);

  // Fire-and-forget sync
  apiRequest(`/issues/${issueId}/assign`, {
    method: "POST",
    body: JSON.stringify({ officerName, wardDivision }),
  });

  return issues;
}

/**
 * Submits municipal repair proof and moves issue to verification.
 * Used by AdminPortal.jsx handleSubmitProof().
 * @returns {Array} updated issues array
 */
export function submitMunicipalRepairProof(issueId, { contractor, sealNumber, notes, photoUrl }) {
  const issues = getStoredIssues();
  const idx = issues.findIndex((i) => i.id === issueId);
  if (idx === -1) return issues;

  issues[idx].status = "verification";
  issues[idx].evidenceAfter =
    photoUrl ||
    "https://images.unsplash.com/photo-1541888946425-d0fbb1861564?w=800&auto=format&fit=crop&q=80";
  issues[idx].resolutionProof = {
    sealNumber: sealNumber || `SEAL #MCD-${Math.floor(1000 + Math.random() * 9000)}`,
    contractor: contractor || "Municipal Field Unit",
    notes: notes || "Work inspected and repaired by municipal engineering division.",
  };
  issues[idx].updatedAt = new Date().toISOString();
  issues[idx].timeline.push({
    step: "Repair Proof Submitted",
    time: "Just now",
    desc: `Work claimed completed by ${contractor || "Field Team"} (${sealNumber || "Official Seal"}). Sent to citizen for verification.`,
  });
  saveIssues(issues);

  // Fire-and-forget sync
  apiRequest(`/issues/${issueId}/repair-proof`, {
    method: "POST",
    body: JSON.stringify({ contractor, sealNumber, notes, photoUrl }),
  });

  return issues;
}

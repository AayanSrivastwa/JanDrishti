/**
 * JanDrishti - Civic Issue Management Service
 * Dual-Mode Engine:
 * 1. Automatically communicates with the Node.js/Express Backend API (http://localhost:5000/api)
 * 2. Seamlessly falls back to localStorage store if backend is offline or during testing
 */

const BACKEND_API_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000/api";
const STORAGE_KEY = "jandrishti_issues_v2";
const ACTIVITY_KEY = "jandrishti_activity_v2";

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
      sealNumber: "SEAL #NDMC-DJB-4821",
      contractor: "Delhi Jal Board Emergency Utility Div",
      notes: "High pressure ductile sleeve clamped, pressure tested at 4.2 bar, sidewalk pavers re-laid."
    },
    citizenVerified: false,
    timeline: [
      { step: "Reported", time: "20 hrs ago", desc: "Pipeline leak flooding pavement reported." },
      { step: "Assigned", time: "16 hrs ago", desc: "Priority dispatch to DJB Central Emergency Crew." },
      { step: "Work Completed", time: "1 hr ago", desc: "Repair completed. Awaiting citizen physical sign-off." }
    ]
  },
  {
    id: "JD-2026-03",
    title: "Flickering High-Mast Streetlight Corridor",
    category: "Streetlighting",
    ward: "Ward 64 - Hauz Khas",
    status: "resolved",
    latitude: 28.5494,
    longitude: 77.2001,
    description: "Discom maintenance division replaced old sodium luminaire with new energy-efficient 120W LED fixture. Verified fixed by resident welfare rep.",
    reportedBy: "Priya Sundaram",
    reportedAt: new Date(Date.now() - 48 * 3600 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 12 * 3600 * 1000).toISOString(),
    priority: "Normal",
    upvotes: 18,
    upvotedBy: [],
    assignedOfficer: "Manoj Kumar, BSES Maintenance",
    slaHours: 18,
    evidenceBefore: "https://images.unsplash.com/photo-1509114397022-ed747cca3f65?w=800&auto=format&fit=crop&q=80",
    evidenceAfter: "https://images.unsplash.com/photo-1513694203232-719a280e022f?w=800&auto=format&fit=crop&q=80",
    resolutionProof: {
      sealNumber: "SEAL #BSES-LT-902",
      contractor: "BSES Rajdhani Streetlighting Crew",
      notes: "New Philips 120W LED fixture installed. Photocell sensor calibrated."
    },
    citizenVerified: true,
    timeline: [
      { step: "Reported", time: "48 hrs ago", desc: "Dark transit zone reported near Hauz Khas Market." },
      { step: "Repaired", time: "24 hrs ago", desc: "BSES electrician squad installed LED module." },
      { step: "Citizen Verified", time: "12 hrs ago", desc: "Inspected and confirmed resolved by @priya_s." }
    ]
  },
  {
    id: "JD-2026-04",
    title: "Uncollected Garbage Accumulation near Metro Gate 3",
    category: "Waste Management",
    ward: "Ward 82 - Karol Bagh",
    status: "review",
    latitude: 28.6514,
    longitude: 77.1907,
    description: "Commercial cardboard and food waste overflow near market metro entrance. Field inspector dispatched for secondary collection.",
    reportedBy: "Amitabh Sen",
    reportedAt: new Date(Date.now() - 3 * 3600 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 3 * 3600 * 1000).toISOString(),
    priority: "High",
    upvotes: 31,
    upvotedBy: [],
    assignedOfficer: "Sanjay Gupta, MCD Sanitation Dept",
    slaHours: 12,
    evidenceBefore: "https://images.unsplash.com/photo-1605600659908-0ef719419d41?w=800&auto=format&fit=crop&q=80",
    evidenceAfter: null,
    resolutionProof: null,
    citizenVerified: false,
    timeline: [
      { step: "Reported", time: "3 hrs ago", desc: "Waste accumulation logged via JanDrishti Web App." },
      { step: "Under Review", time: "1 hr ago", desc: "Automated routing to MCD Karol Bagh Sanitation Division." }
    ]
  },
  {
    id: "JD-2026-05",
    title: "Clogged Stormwater Drain causing Street Waterlogging",
    category: "Drainage & Sewage",
    ward: "Ward 35 - Dwarka Sector 10",
    status: "progress",
    latitude: 28.5921,
    longitude: 77.0460,
    description: "MCD heavy desilting suction machines actively clearing stormwater concrete culvert ahead of weekend rain forecast.",
    reportedBy: "Kavita Rao",
    reportedAt: new Date(Date.now() - 14 * 3600 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 4 * 3600 * 1000).toISOString(),
    priority: "Urgent",
    upvotes: 19,
    upvotedBy: [],
    assignedOfficer: "Harish Chander, MCD Drainage Wing",
    slaHours: 24,
    evidenceBefore: "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=800&auto=format&fit=crop&q=80",
    evidenceAfter: null,
    resolutionProof: null,
    citizenVerified: false,
    timeline: [
      { step: "Reported", time: "14 hrs ago", desc: "Clogged drainage channel reported." },
      { step: "Dispatched", time: "8 hrs ago", desc: "Super-sucker vacuum machine sent to site." }
    ]
  },
  {
    id: "JD-2026-06",
    title: "Broken Playground Swing in District Park",
    category: "Parks & Green Spaces",
    ward: "Ward 24 - Rohini Sector 9",
    status: "resolved",
    latitude: 28.7159,
    longitude: 77.1189,
    description: "DDA Park safety chains repaired and seat replaced. Verified fixed by Resident Welfare Association president.",
    reportedBy: "Sandeep Bansal",
    reportedAt: new Date(Date.now() - 72 * 3600 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 24 * 3600 * 1000).toISOString(),
    priority: "Normal",
    upvotes: 14,
    upvotedBy: [],
    assignedOfficer: "Vikas Tyagi, DDA Horticulture & Parks",
    slaHours: 48,
    evidenceBefore: "https://images.unsplash.com/photo-1519331379826-f10be5486c6f?w=800&auto=format&fit=crop&q=80",
    evidenceAfter: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800&auto=format&fit=crop&q=80",
    resolutionProof: {
      sealNumber: "SEAL #DDA-ROHINI-402",
      contractor: "DDA Park Equipment Division",
      notes: "Stainless steel chains installed, rubber buffer seats mounted, anchor bolts torqued."
    },
    citizenVerified: true,
    timeline: [
      { step: "Reported", time: "3 days ago", desc: "Broken child swing reported." },
      { step: "Repaired", time: "Yesterday", desc: "DDA team replaced hardware." },
      { step: "Citizen Verified", time: "24 hrs ago", desc: "Signed off by RWA President Sandeep B." }
    ]
  }
];

export function getStoredIssues() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(DELHI_INITIAL_ISSUES));
      return DELHI_INITIAL_ISSUES;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : DELHI_INITIAL_ISSUES;
  } catch (err) {
    console.error("Error reading issues from storage:", err);
    return DELHI_INITIAL_ISSUES;
  }
}

export function saveStoredIssues(issues) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(issues));
  } catch (err) {
    console.error("Error writing issues to storage:", err);
  }
}

// Background sync with Express Backend
async function syncBackend(endpoint, method = "POST", body = null) {
  try {
    const res = await fetch(`${BACKEND_API_URL}${endpoint}`, {
      method,
      headers: { "Content-Type": "application/json" },
      body: body ? JSON.stringify(body) : undefined,
    });
    if (res.ok) {
      return await res.json();
    }
  } catch {
    // Backend offline or running in mock mode - smooth fallback
  }
  return null;
}

export function createNewIssue({ title, category, ward, description, priority, latitude, longitude, photoUrl, reportedBy }) {
  const issues = getStoredIssues();
  const newId = `JD-2026-${String(issues.length + 1).padStart(2, "0")}`;

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

  const updated = [newIssue, ...issues];
  saveStoredIssues(updated);

  logActivity({
    type: "create",
    issueId: newId,
    issueTitle: newIssue.title,
    user: reportedBy || "Citizen",
    time: "Just now"
  });

  // Async sync with backend
  syncBackend("/issues", "POST", newIssue);

  return newIssue;
}

export function updateIssueStatus(issueId, newStatus, userActor = "Citizen Inspector", disputeReason = "") {
  const issues = getStoredIssues();
  const updated = issues.map((item) => {
    if (item.id === issueId) {
      const isVerified = newStatus === "resolved";
      const isDisputed = newStatus === "progress" && item.status === "verification";
      
      const newTimeline = [...item.timeline];
      if (isVerified) {
        newTimeline.push({
          step: "Citizen Verified & Closed",
          time: "Just now",
          desc: `Confirmed resolved by ${userActor}. Official civic closure ledger recorded.`
        });
      } else if (isDisputed) {
        newTimeline.push({
          step: "Citizen Disputed & Escalated",
          time: "Just now",
          desc: disputeReason 
            ? `Disputed: "${disputeReason}". Urgent escalation sent to Executive Engineer.`
            : `Citizen disputed quality of repair. Reopened with priority escalation.`
        });
      }

      return {
        ...item,
        status: newStatus,
        citizenVerified: isVerified ? true : item.citizenVerified,
        updatedAt: new Date().toISOString(),
        timeline: newTimeline
      };
    }
    return item;
  });

  saveStoredIssues(updated);

  logActivity({
    type: newStatus === "resolved" ? "verify" : "dispute",
    issueId,
    issueTitle: issues.find(i => i.id === issueId)?.title || "Civic Issue",
    user: userActor,
    time: "Just now"
  });

  // Async sync with backend
  syncBackend(`/issues/${issueId}/status`, "PATCH", { status: newStatus, userActor, disputeReason });

  return updated;
}

export function toggleIssueUpvote(issueId, userIdentifier = "me") {
  const issues = getStoredIssues();
  let hasUpvoted = false;

  const updated = issues.map((item) => {
    if (item.id === issueId) {
      const upvotedBy = Array.isArray(item.upvotedBy) ? item.upvotedBy : [];
      const alreadyVoted = upvotedBy.includes(userIdentifier);
      hasUpvoted = !alreadyVoted;

      return {
        ...item,
        upvotes: alreadyVoted ? Math.max(0, item.upvotes - 1) : item.upvotes + 1,
        upvotedBy: alreadyVoted
          ? upvotedBy.filter(u => u !== userIdentifier)
          : [...upvotedBy, userIdentifier]
      };
    }
    return item;
  });

  saveStoredIssues(updated);
  syncBackend(`/issues/${issueId}/upvote`, "POST", { userIdentifier });
  return { updated, hasUpvoted };
}

export function assignOfficerToIssue(issueId, officerName, wardDivision) {
  const issues = getStoredIssues();
  const updated = issues.map((item) => {
    if (item.id === issueId) {
      const newTimeline = [...item.timeline];
      newTimeline.push({
        step: "Officer Dispatched",
        time: "Just now",
        desc: `Assigned to ${officerName} (${wardDivision || "Field Division"}). Field team mobilized.`
      });

      return {
        ...item,
        assignedOfficer: officerName,
        status: item.status === "review" ? "progress" : item.status,
        updatedAt: new Date().toISOString(),
        timeline: newTimeline
      };
    }
    return item;
  });

  saveStoredIssues(updated);

  logActivity({
    type: "assign",
    issueId,
    issueTitle: issues.find(i => i.id === issueId)?.title || "Civic Issue",
    user: officerName,
    time: "Just now"
  });

  syncBackend(`/issues/${issueId}/assign`, "POST", { officerName, wardDivision });
  return updated;
}

export function submitMunicipalRepairProof(issueId, { contractor, sealNumber, notes, photoUrl }) {
  const issues = getStoredIssues();
  const updated = issues.map((item) => {
    if (item.id === issueId) {
      const newTimeline = [...item.timeline];
      newTimeline.push({
        step: "Repair Proof Submitted",
        time: "Just now",
        desc: `Work claimed completed by ${contractor || "Field Team"} (${sealNumber || "Official Seal"}). Sent to citizen for verification.`
      });

      return {
        ...item,
        status: "verification",
        evidenceAfter: photoUrl || "https://images.unsplash.com/photo-1541888946425-d0fbb1861564?w=800&auto=format&fit=crop&q=80",
        resolutionProof: {
          sealNumber: sealNumber || `SEAL #MCD-${Math.floor(1000 + Math.random() * 9000)}`,
          contractor: contractor || "Municipal Field Unit",
          notes: notes || "Work inspected and repaired by municipal engineering division."
        },
        updatedAt: new Date().toISOString(),
        timeline: newTimeline
      };
    }
    return item;
  });

  saveStoredIssues(updated);

  logActivity({
    type: "repair_claim",
    issueId,
    issueTitle: issues.find(i => i.id === issueId)?.title || "Civic Issue",
    user: contractor || "Municipal Engineer",
    time: "Just now"
  });

  syncBackend(`/issues/${issueId}/repair-proof`, "POST", { contractor, sealNumber, notes, photoUrl });
  return updated;
}

export function resetToDefaults() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(DELHI_INITIAL_ISSUES));
  return DELHI_INITIAL_ISSUES;
}

export function getActivities() {
  try {
    const raw = localStorage.getItem(ACTIVITY_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

export function logActivity(activity) {
  try {
    const prev = getActivities();
    const updated = [
      { id: Date.now(), ...activity, timestamp: new Date().toISOString() },
      ...prev
    ].slice(0, 30);
    localStorage.setItem(ACTIVITY_KEY, JSON.stringify(updated));
  } catch {
    // silent
  }
}

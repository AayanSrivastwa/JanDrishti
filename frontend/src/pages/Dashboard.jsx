import { useState, useMemo } from "react";
import { Link, useNavigate } from "react-router";
import {
  CheckCircle2,
  Clock3,
  FileText,
  MapPin,
  Moon,
  Plus,
  ShieldCheck,
  Sun,
  AlertTriangle,
  Search,
  X,
  Crosshair,
  TrendingUp,
  Check,
  RotateCcw,
  Layers,
  Map as MapIcon,
  ListFilter,
  LogOut,
  Sparkles,
  ThumbsUp,
  Download,
  Activity,
  Building2,
} from "lucide-react";

import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Doughnut } from "react-chartjs-2";

import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import { logoutUser } from "../Services/authService";
import {
  getStoredIssues,
  createNewIssue,
  updateIssueStatus,
  toggleIssueUpvote,
  resetToDefaults,
  getActivities,
  findPotentialDuplicates,
} from "../Services/issueService";
import AnimatedBackground from "../components/AnimatedBackground";
import CivicMap from "../components/CivicMap";
import CommentSection from "../components/CommentSection";
import SLACountdown from "../components/SLACountdown";
import DuplicateWarning from "../components/DuplicateWarning";
import PhotoComparisonSlider from "../components/PhotoComparisonSlider";
import ShareIssue from "../components/ShareIssue";
import "../styles/dashboard.css";

// Register Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend);

const CATEGORIES = [
  "All Categories",
  "Roads & Potholes",
  "Water Supply",
  "Streetlighting",
  "Waste Management",
  "Drainage & Sewage",
  "Parks & Green Spaces",
];

export default function Dashboard() {
  const { user, profile } = useAuth();
  const navigate = useNavigate();

  const userName = profile?.name || user?.user_metadata?.name || "Citizen Officer";

  // Light / Dark Theme State (shared via ThemeContext)
  const { theme, toggleTheme } = useTheme();
  const darkMode = theme === "dark";

  async function handleLogout() {
    await logoutUser();
    navigate("/login");
  }

  // Dashboard View Mode: "split" | "map" | "feed"
  const [viewMode, setViewMode] = useState("split");

  // Dynamic Issues State loaded from issueService
  const [issues, setIssues] = useState(() => getStoredIssues());
  const [selectedIssue, setSelectedIssue] = useState(() => issues[1] || issues[0]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [statusFilter, setStatusFilter] = useState("all"); // "all" | "verification" | "progress" | "resolved"

  // Quick Report Modal State
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newCategory, setNewCategory] = useState("Roads & Potholes");
  const [newWard, setNewWard] = useState("Ward 42 - Connaught Place (NDMC)");
  const [newDesc, setNewDesc] = useState("");
  const [newPriority, setNewPriority] = useState("High");
  const [newPhotoUrl, setNewPhotoUrl] = useState("");
  const [gpsCoordinates, setGpsCoordinates] = useState({
    lat: 28.6139,
    lng: 77.2090,
  });
  const [gpsStatus, setGpsStatus] = useState("");

  // Dispute Dialog Modal State
  const [disputeModalOpen, setDisputeModalOpen] = useState(false);
  const [disputeIssueTarget, setDisputeIssueTarget] = useState(null);
  const [disputeReason, setDisputeReason] = useState("");

  // Duplicate check state for new report
  const [dupCheckResult, setDupCheckResult] = useState(null);
  const [dupChecking, setDupChecking] = useState(false);

  // Verification Feedback Notice
  const [bannerNotice, setBannerNotice] = useState("");

  // User Live Geolocation
  const [userLocation, setUserLocation] = useState(null);

  // Live Activity Feed derived from storage whenever issues changes
  const activities = useMemo(() => (issues ? getActivities() : []), [issues]);

  function handleLocateMe() {
    if (navigator.geolocation) {
      setGpsStatus("Detecting location...");
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const coords = [position.coords.latitude, position.coords.longitude];
          setUserLocation(coords);
          setGpsCoordinates({
            lat: Number(position.coords.latitude.toFixed(4)),
            lng: Number(position.coords.longitude.toFixed(4)),
          });
          setGpsStatus("GPS location detected!");
        },
        () => {
          setUserLocation([28.6139, 77.2090]);
          setGpsStatus("Defaulted to Delhi Central (Connaught Place).");
        }
      );
    } else {
      setGpsStatus("Geolocation not supported by browser.");
    }
  }

  function handleMapClick(latlng) {
    setGpsCoordinates({
      lat: Number(latlng.lat.toFixed(4)),
      lng: Number(latlng.lng.toFixed(4)),
    });
    setGpsStatus(`Pinned on map: ${latlng.lat.toFixed(4)}, ${latlng.lng.toFixed(4)}`);
  }

  // Verification Action Handler
  function handleVerifyIssue(issueId, newStatus) {
    if (newStatus === "progress") {
      // Open dispute reasoning modal
      const target = issues.find((i) => i.id === issueId);
      setDisputeIssueTarget(target);
      setDisputeReason("");
      setDisputeModalOpen(true);
      return;
    }

    const updated = updateIssueStatus(issueId, "resolved", userName);
    setIssues(updated);
    const updatedSelected = updated.find((i) => i.id === issueId);
    if (updatedSelected) setSelectedIssue(updatedSelected);

    setBannerNotice(
      "🎉 Resolution verified by citizen! Cryptographic audit entry saved to ledger. Ticket officially closed."
    );

    setTimeout(() => {
      setBannerNotice("");
    }, 6000);
  }

  function handleConfirmDispute() {
    if (!disputeIssueTarget) return;
    const updated = updateIssueStatus(
      disputeIssueTarget.id,
      "progress",
      userName,
      disputeReason.trim() || "Substandard repair quality flagged by citizen."
    );
    setIssues(updated);
    const updatedSelected = updated.find((i) => i.id === disputeIssueTarget.id);
    if (updatedSelected) setSelectedIssue(updatedSelected);

    setDisputeModalOpen(false);
    setDisputeIssueTarget(null);

    setBannerNotice(
      "⚠️ Issue disputed & escalated! Priority notification dispatched to Executive Engineer."
    );

    setTimeout(() => {
      setBannerNotice("");
    }, 6000);
  }

  // Upvote Handler
  function handleUpvote(issueId) {
    const { updated, hasUpvoted } = toggleIssueUpvote(issueId, userName);
    setIssues(updated);
    const updatedSelected = updated.find((i) => i.id === issueId);
    if (updatedSelected) setSelectedIssue(updatedSelected);

    if (hasUpvoted) {
      setBannerNotice("👍 Priority upvote registered! Helps ward engineers prioritize civic repairs.");
      setTimeout(() => setBannerNotice(""), 3500);
    }
  }

  // Handle New Report Submission
  function handleCreateReport(e) {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const created = createNewIssue({
      title: newTitle,
      category: newCategory,
      ward: newWard,
      description: newDesc,
      priority: newPriority,
      latitude: gpsCoordinates.lat,
      longitude: gpsCoordinates.lng,
      photoUrl: newPhotoUrl.trim() || null,
      reportedBy: userName,
    });

    setIssues(getStoredIssues());
    setSelectedIssue(created);
    setIsReportModalOpen(false);

    setNewTitle("");
    setNewDesc("");
    setNewPhotoUrl("");
    setGpsStatus("");

    setBannerNotice(`✅ New civic issue #${created.id} submitted & routed to ${created.ward}!`);
    setTimeout(() => setBannerNotice(""), 6000);
  }

  // Check for duplicate issues when user enters location
  function handleCheckDuplicate() {
    if (!newTitle.trim() || !gpsCoordinates.lat) return;
    setDupChecking(true);
    const result = findPotentialDuplicates({
      category: newCategory,
      latitude: gpsCoordinates.lat,
      longitude: gpsCoordinates.lng,
      title: newTitle,
      description: newDesc,
      ward: newWard,
      radiusKm: 1,
    });
    setDupCheckResult(result);
    setDupChecking(false);
  }

  // Export CSV Data
  function handleExportData() {
    const headers = "ID,Title,Category,Ward,Status,Priority,Upvotes,Latitude,Longitude,ReportedAt\n";
    const rows = issues
      .map(
        (i) =>
          `"${i.id}","${i.title.replace(/"/g, '""')}","${i.category}","${i.ward}","${i.status}","${i.priority}",${i.upvotes},${i.latitude},${i.longitude},"${i.reportedAt}"`
      )
      .join("\n");
    const blob = new Blob([headers + rows], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `JanDrishti_Civic_Issues_${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  }

  function handleResetPrototype() {
    if (window.confirm("Reset all issues to default verified state?")) {
      const def = resetToDefaults();
      setIssues(def);
      setSelectedIssue(def[1]);
      setBannerNotice("🔄 Prototype data reset to initial Delhi state.");
      setTimeout(() => setBannerNotice(""), 4000);
    }
  }

  // Filtered Issues Calculation
  const filteredIssues = useMemo(() => {
    return issues.filter((issue) => {
      const matchesSearch =
        issue.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        issue.ward.toLowerCase().includes(searchQuery.toLowerCase()) ||
        issue.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        issue.id.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCategory =
        selectedCategory === "All Categories" ||
        issue.category === selectedCategory;

      const matchesStatus =
        statusFilter === "all" || issue.status === statusFilter;

      return matchesSearch && matchesCategory && matchesStatus;
    });
  }, [issues, searchQuery, selectedCategory, statusFilter]);

  // Derived Statistics
  const totalCount = issues.length;
  const inProgressCount = issues.filter((i) => i.status === "progress").length;
  const verificationCount = issues.filter((i) => i.status === "verification").length;
  const resolvedCount = issues.filter((i) => i.status === "resolved").length;

  // Active Issue Awaiting Verification
  const pendingVerificationIssue = issues.find(
    (i) => i.status === "verification"
  );

  // Doughnut Chart Data
  const chartData = useMemo(() => {
    const counts = {
      "Roads & Potholes": 0,
      "Water Supply": 0,
      "Streetlighting": 0,
      "Waste Management": 0,
      "Drainage & Sewage": 0,
      "Parks & Green Spaces": 0,
    };

    issues.forEach((i) => {
      if (counts[i.category] !== undefined) {
        counts[i.category] += 1;
      }
    });

    return {
      labels: Object.keys(counts),
      datasets: [
        {
          data: Object.values(counts),
          backgroundColor: [
            "#ef4444",
            "#3b82f6",
            "#f59e0b",
            "#10b981",
            "#8b5cf6",
            "#06b6d4",
          ],
          borderWidth: 2,
          borderColor: darkMode ? "#141e18" : "#ffffff",
        },
      ],
    };
  }, [issues, darkMode]);

  return (
    <div className={`jan-page ${darkMode ? "dark-mode" : ""}`}>
      <AnimatedBackground />

      {/* NAVBAR */}
      <header className="jan-navbar">
        <div className="jan-container navbar-inner">
          <Link to="/" className="jan-brand">
            <div className="brand-mark">JD</div>
            <div className="brand-text">
              <h2>JanDrishti</h2>
              <span>Civic Intelligence Console</span>
            </div>
          </Link>

          <nav className="main-nav">
            <button
              type="button"
              className={`nav-link ${viewMode === "split" ? "active" : ""}`}
              onClick={() => setViewMode("split")}
            >
              <Layers size={15} />
              <span>Console</span>
            </button>
            <button
              type="button"
              className={`nav-link ${viewMode === "map" ? "active" : ""}`}
              onClick={() => setViewMode("map")}
            >
              <MapIcon size={15} />
              <span>Map Explorer</span>
            </button>
            <button
              type="button"
              className={`nav-link ${statusFilter === "verification" ? "active" : ""}`}
              onClick={() => {
                setStatusFilter("verification");
                setViewMode("split");
              }}
            >
              <ShieldCheck size={15} />
              <span>Verify Queue ({verificationCount})</span>
            </button>
            <a href="#analytics-section" className="nav-link">
              <TrendingUp size={15} />
              <span>Analytics</span>
            </a>
            <Link to="/admin" className="nav-link" style={{ color: "var(--jd-emerald)", fontWeight: 700 }}>
              <Building2 size={15} />
              <span>Municipal Ops</span>
            </Link>
          </nav>

          <div className="navbar-actions">
            <div className="live-network-tag">
              <span className="pulse-dot-green" />
              <span>Delhi NCR Wards Live</span>
            </div>

            <button
              type="button"
              className="theme-button"
              onClick={toggleTheme}
              aria-label="Toggle theme"
              title="Toggle light/dark mode"
            >
              {darkMode ? <Sun size={17} /> : <Moon size={17} />}
            </button>

            <button
              type="button"
              className="btn-primary-action"
              onClick={() => setIsReportModalOpen(true)}
            >
              <Plus size={16} />
              <span>Report Issue</span>
            </button>

            <div className="user-menu">
              <div className="user-avatar">
                {userName.charAt(0).toUpperCase()}
              </div>
              <div className="user-info">
                <strong>{userName}</strong>
                <span>{profile?.role || "Citizen"}</span>
              </div>
              <button
                type="button"
                className="btn-signout"
                onClick={handleLogout}
                title="Sign out"
              >
                <LogOut size={14} />
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className={`jan-container ${viewMode === "map" ? "map-mode-container" : ""}`} style={{ paddingBottom: viewMode === "map" ? "20px" : "60px" }}>
        {/* EXECUTIVE HEADER / MAP EXPLORER TOOLBAR */}
        {viewMode === "map" ? (
          <section className="map-explorer-bar">
            <div className="map-explorer-header-left">
              <div className="map-explorer-badge">
                <MapIcon size={14} color="var(--jd-emerald)" />
                <span>DELHI NCR WIDE GEOSPATIAL EXPLORER</span>
              </div>
              <h1>Civic Map Explorer 🗺️</h1>
              <p>
                Showing <strong>{filteredIssues.length}</strong> of {issues.length} active civic reports across Delhi NCT & NCR
              </p>
            </div>

            <div className="map-explorer-header-right">
              {/* Live Search on Map */}
              <div className="map-search-inline">
                <Search size={14} />
                <input
                  type="text"
                  placeholder="Filter by ward, issue title, or #JD ID..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                {searchQuery && (
                  <button type="button" className="btn-search-clear" onClick={() => setSearchQuery("")}>
                    <X size={12} />
                  </button>
                )}
              </div>

              {/* Status quick tabs */}
              <div className="map-filter-pills">
                {[
                  { id: "all", label: `All (${totalCount})` },
                  { id: "verification", label: `Verify (${verificationCount})`, cls: "purple" },
                  { id: "progress", label: `In Progress (${inProgressCount})`, cls: "amber" },
                  { id: "resolved", label: `Verified (${resolvedCount})`, cls: "green" },
                ].map((st) => (
                  <button
                    key={st.id}
                    type="button"
                    className={`map-quick-tab ${st.cls || ""} ${statusFilter === st.id ? "active" : ""}`}
                    onClick={() => setStatusFilter(st.id)}
                  >
                    {st.label}
                  </button>
                ))}
              </div>

              {/* View Mode Switcher */}
              <div className="view-mode-pills">
                <button
                  type="button"
                  className={`view-mode-btn ${viewMode === "split" ? "active" : ""}`}
                  onClick={() => setViewMode("split")}
                  title="Split Feed + Map"
                >
                  <Layers size={13} />
                  <span>Split View</span>
                </button>
                <button
                  type="button"
                  className={`view-mode-btn ${viewMode === "map" ? "active" : ""}`}
                  onClick={() => setViewMode("map")}
                  title="Full Interactive Map"
                >
                  <MapIcon size={13} />
                  <span>Map Only</span>
                </button>
                <button
                  type="button"
                  className={`view-mode-btn ${viewMode === "feed" ? "active" : ""}`}
                  onClick={() => setViewMode("feed")}
                  title="Full Issue Stream"
                >
                  <ListFilter size={13} />
                  <span>Feed Only</span>
                </button>
              </div>
            </div>
          </section>
        ) : (
          <section className="dashboard-header-area">
            <div className="header-welcome">
              <div className="header-pill">
                <Activity size={13} color="var(--jd-emerald)" />
                <span>OPERATIONAL STATUS: NOMINAL • DELHI CENTRAL</span>
              </div>
              <h1>Command Center Dashboard 🏙️</h1>
              <p>
                Inspect, track, upvote, and physically verify municipal infrastructure repairs in real time.
              </p>
            </div>

            <div className="header-actions-group">
              <button
                type="button"
                className="btn-secondary-tool"
                onClick={handleExportData}
                title="Export all civic reports as CSV"
              >
                <Download size={14} />
                <span>Export CSV</span>
              </button>

              <button
                type="button"
                className="btn-secondary-tool"
                onClick={handleResetPrototype}
                title="Reset mock data to initial state"
              >
                <RotateCcw size={14} />
                <span>Reset Data</span>
              </button>

              {/* View Mode Switcher */}
              <div className="view-mode-pills">
                <button
                  type="button"
                  className={`view-mode-btn ${viewMode === "split" ? "active" : ""}`}
                  onClick={() => setViewMode("split")}
                  title="Split Feed + Map"
                >
                  <Layers size={13} />
                  <span>Split View</span>
                </button>
                <button
                  type="button"
                  className={`view-mode-btn ${viewMode === "map" ? "active" : ""}`}
                  onClick={() => setViewMode("map")}
                  title="Full Interactive Map"
                >
                  <MapIcon size={13} />
                  <span>Map Only</span>
                </button>
                <button
                  type="button"
                  className={`view-mode-btn ${viewMode === "feed" ? "active" : ""}`}
                  onClick={() => setViewMode("feed")}
                  title="Full Issue Stream"
                >
                  <ListFilter size={13} />
                  <span>Feed Only</span>
                </button>
              </div>
            </div>
          </section>
        )}

        {/* FEEDBACK NOTICE */}
        {bannerNotice && (
          <div className="feedback-banner-pill">
            <Sparkles size={16} />
            <span>{bannerNotice}</span>
          </div>
        )}

        {/* CITIZEN VERIFICATION SPOTLIGHT (Only in Split or Feed Mode) */}
        {viewMode !== "map" && pendingVerificationIssue && (
          <div className="verification-spotlight">
            <div className="spotlight-left">
              <div className="spotlight-icon-box">
                <ShieldCheck size={24} />
              </div>
              <div className="spotlight-text">
                <div className="spotlight-badge">
                  <span>CITIZEN SIGN-OFF GATE</span>
                  <span>{pendingVerificationIssue.id}</span>
                </div>
                <h4>
                  ⚡ Verification Required: Municipal Repair Claimed Done
                </h4>
                <p>
                  <strong>{pendingVerificationIssue.title}</strong> ({pendingVerificationIssue.ward})
                  has been marked repaired by field teams. As the citizen, your inspection is required before the ticket can close.
                </p>
                {pendingVerificationIssue.resolutionProof && (
                  <div className="spotlight-proof-note">
                    <strong>{pendingVerificationIssue.resolutionProof.sealNumber}:</strong>{" "}
                    {pendingVerificationIssue.resolutionProof.notes}
                  </div>
                )}
              </div>
            </div>

            <div className="spotlight-actions">
              <button
                type="button"
                className="btn-spotlight-confirm"
                onClick={() => handleVerifyIssue(pendingVerificationIssue.id, "resolved")}
              >
                <Check size={15} />
                <span>Verify & Close Ticket</span>
              </button>
              <button
                type="button"
                className="btn-spotlight-reopen"
                onClick={() => handleVerifyIssue(pendingVerificationIssue.id, "progress")}
              >
                <RotateCcw size={15} />
                <span>Dispute & Reopen</span>
              </button>
            </div>
          </div>
        )}

        {/* KPI METRICS RIBBON (Only in Split or Feed Mode) */}
        {viewMode !== "map" && (
          <section className="dashboard-kpi-ribbon">
            <div
              className={`kpi-card ${statusFilter === "all" ? "active-kpi" : ""}`}
              onClick={() => setStatusFilter("all")}
            >
              <div className="kpi-icon-bubble">
                <FileText size={22} />
              </div>
              <div className="kpi-info-wrap">
                <span className="kpi-number">{totalCount}</span>
                <span className="kpi-label">Total Reported</span>
              </div>
            </div>

            <div
              className={`kpi-card ${statusFilter === "progress" ? "active-kpi" : ""}`}
              onClick={() => setStatusFilter("progress")}
            >
              <div className="kpi-icon-bubble amber">
                <Clock3 size={22} />
              </div>
              <div className="kpi-info-wrap">
                <span className="kpi-number">{inProgressCount}</span>
                <span className="kpi-label">Active Repairs</span>
              </div>
            </div>

            <div
              className={`kpi-card ${statusFilter === "verification" ? "active-kpi" : ""}`}
              onClick={() => setStatusFilter("verification")}
            >
              <div className="kpi-icon-bubble purple">
                <ShieldCheck size={22} />
              </div>
              <div className="kpi-info-wrap">
                <span className="kpi-number" style={{ color: "var(--jd-purple)" }}>
                  {verificationCount}
                </span>
                <span className="kpi-label">Needs Verification</span>
              </div>
              {verificationCount > 0 && (
                <span className="kpi-badge-pulse">ACTION REQ.</span>
              )}
            </div>

            <div
              className={`kpi-card ${statusFilter === "resolved" ? "active-kpi" : ""}`}
              onClick={() => setStatusFilter("resolved")}
            >
              <div className="kpi-icon-bubble green">
                <CheckCircle2 size={22} />
              </div>
              <div className="kpi-info-wrap">
                <span className="kpi-number" style={{ color: "var(--jd-emerald)" }}>
                  {resolvedCount}
                </span>
                <span className="kpi-label">Verified Resolved</span>
              </div>
            </div>
          </section>
        )}

        {/* COMMAND CENTER SPLIT SCREEN */}
        <section className={`command-center mode-${viewMode}`}>
          {/* Left Panel: Stream & Filters */}
          <div className="command-left-panel">
            <div className="feed-header-controls">
              {/* Search Bar */}
              <div className="search-box-row">
                <Search size={16} />
                <input
                  type="text"
                  className="feed-search-input"
                  placeholder="Filter by title, ward, category, or #JD ID..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                {searchQuery && (
                  <button
                    type="button"
                    className="search-clear-btn"
                    onClick={() => setSearchQuery("")}
                  >
                    <X size={14} />
                  </button>
                )}
              </div>

              {/* Category Filter Chips */}
              <div className="category-scroll-chips">
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    className={`cat-chip-btn ${selectedCategory === cat ? "active" : ""}`}
                    onClick={() => setSelectedCategory(cat)}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Status Tabs */}
            <div className="status-tab-bar">
              <button
                type="button"
                className={`tab-btn ${statusFilter === "all" ? "active" : ""}`}
                onClick={() => setStatusFilter("all")}
              >
                All ({issues.length})
              </button>
              <button
                type="button"
                className={`tab-btn ${statusFilter === "verification" ? "active" : ""}`}
                onClick={() => setStatusFilter("verification")}
              >
                Verification ({verificationCount})
              </button>
              <button
                type="button"
                className={`tab-btn ${statusFilter === "progress" ? "active" : ""}`}
                onClick={() => setStatusFilter("progress")}
              >
                In Progress ({inProgressCount})
              </button>
              <button
                type="button"
                className={`tab-btn ${statusFilter === "resolved" ? "active" : ""}`}
                onClick={() => setStatusFilter("resolved")}
              >
                Resolved ({resolvedCount})
              </button>
            </div>

            {/* Cards Stream */}
            <div className="issue-cards-stream">
              {filteredIssues.length === 0 ? (
                <div style={{ textAlign: "center", padding: "40px 10px" }}>
                  <AlertTriangle size={28} color="var(--jd-muted)" />
                  <p style={{ margin: "10px 0 14px", fontSize: "13px", color: "var(--jd-text-light)" }}>
                    No matching reports found with active filters.
                  </p>
                  <button
                    type="button"
                    className="cat-chip-btn active"
                    onClick={() => {
                      setSearchQuery("");
                      setSelectedCategory("All Categories");
                      setStatusFilter("all");
                    }}
                  >
                    Reset All Filters
                  </button>
                </div>
              ) : (
                filteredIssues.map((issue) => {
                  const isSelected = selectedIssue?.id === issue.id;
                  const hasUserUpvoted = (issue.upvotedBy || []).includes(userName);

                  return (
                    <div
                      key={issue.id}
                      className={`issue-stream-card ${isSelected ? "selected" : ""}`}
                      onClick={() => setSelectedIssue(issue)}
                    >
                      <div className="card-top-row">
                        <div className="card-id-badge">
                          <span className="badge-id">{issue.id}</span>
                          <span className="badge-category">{issue.category}</span>
                        </div>
                        <span className={`badge-status ${issue.status}`}>
                          {issue.status === "resolved" && "✅ Verified"}
                          {issue.status === "verification" && "⚡ Inspect"}
                          {issue.status === "progress" && "🛠️ Active"}
                          {issue.status === "review" && "⏳ Review"}
                        </span>
                      </div>

                      <h4 className="card-title">{issue.title}</h4>
                      <p className="card-desc">{issue.description}</p>

                      <div className="card-bottom-row">
                        <span className="card-location">
                          <MapPin size={12} /> {issue.ward}
                        </span>

                        <div className="card-actions-group">
                          <button
                            type="button"
                            className={`btn-upvote-chip ${hasUserUpvoted ? "upvoted" : ""}`}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleUpvote(issue.id);
                            }}
                            title="Upvote issue priority"
                          >
                            <ThumbsUp size={12} />
                            <span>{issue.upvotes || 0}</span>
                          </button>

                          <button
                            type="button"
                            className="btn-card-pin"
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedIssue(issue);
                            }}
                          >
                            <Crosshair size={12} />
                            <span>Pin Map</span>
                          </button>
                        </div>
                      </div>

                      {/* Evidence thumbnail preview if present */}
                      {issue.evidenceBefore && (
                        <div className="card-evidence-strip">
                          <div className="evidence-thumb">
                            <img src={issue.evidenceBefore} alt="Before repair" />
                            <span>Hazard Geotag</span>
                          </div>
                          {issue.evidenceAfter && (
                            <div className="evidence-thumb after">
                              <img src={issue.evidenceAfter} alt="After repair" />
                              <span>Repair Proof</span>
                            </div>
                          )}
                        </div>
                      )}

                      {issue.status === "verification" && (
                        <div className="inline-verify-actions">
                          <button
                            type="button"
                            className="btn-inline-verify"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleVerifyIssue(issue.id, "resolved");
                            }}
                          >
                            <Check size={13} /> Confirm Fixed
                          </button>
                          <button
                            type="button"
                            className="btn-inline-dispute"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleVerifyIssue(issue.id, "progress");
                            }}
                          >
                            <RotateCcw size={13} /> Dispute Quality
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Right Panel: Leaflet Map & Inspection Sidebar */}
          <div className="command-right-map">
            <CivicMap
              issues={filteredIssues}
              selectedIssue={selectedIssue}
              onSelectIssue={(issue) => setSelectedIssue(issue)}
              onVerifyIssue={handleVerifyIssue}
              onUpvoteIssue={handleUpvote}
              onMapClick={handleMapClick}
              darkMode={darkMode}
              userLocation={userLocation}
              onLocateMe={handleLocateMe}
              viewMode={viewMode}
            />

            {/* Selected Issue Inspection Overlay Tray */}
            {selectedIssue && (
              <div className="map-inspect-drawer">
                <div className="inspect-drawer-header">
                  <div>
                    <span className="drawer-id">{selectedIssue.id}</span>
                    <h3>{selectedIssue.title}</h3>
                  </div>
                  <div className="drawer-header-actions">
                    <span className={`badge-status ${selectedIssue.status}`}>
                      {selectedIssue.status}
                    </span>
                    <button
                      type="button"
                      className="btn-drawer-close"
                      onClick={() => setSelectedIssue(null)}
                      title="Close inspection drawer"
                    >
                      <X size={16} />
                    </button>
                  </div>
                </div>

                <div className="inspect-drawer-body">
                  <div className="drawer-metric-grid">
                    <div>
                      <span>Ward Division</span>
                      <strong>{selectedIssue.ward}</strong>
                    </div>
                    <div>
                      <span>Assigned Officer</span>
                      <strong>{selectedIssue.assignedOfficer || "MCD / NDMC"}</strong>
                    </div>
                    <div>
                      <span>Coordinates</span>
                      <strong>
                        {selectedIssue.latitude.toFixed(4)}° N, {selectedIssue.longitude.toFixed(4)}° E
                      </strong>
                    </div>
                    <div>
                      <span>Community Upvotes</span>
                      <strong>{selectedIssue.upvotes || 0} Citizens</strong>
                    </div>
                    <div>
                      <span>SLA Deadline</span>
                      <SLACountdown issue={selectedIssue} />
                    </div>
                  </div>

                  {/* Audit Timeline */}
                  {selectedIssue.timeline && selectedIssue.timeline.length > 0 && (
                    <div className="drawer-timeline">
                      <h4>Tamper-evident Audit Trail</h4>
                      <div className="timeline-stepper">
                        {selectedIssue.timeline.map((item, idx) => (
                          <div key={idx} className="timeline-step-item">
                            <div className="timeline-step-bullet" />
                            <div className="timeline-step-content">
                              <div className="step-head">
                                <strong>{item.step}</strong>
                                <span>{item.time}</span>
                              </div>
                              <p>{item.desc}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Photo Comparison Slider */}
                {(selectedIssue.evidenceBefore || selectedIssue.evidenceAfter) && (
                  <div className="drawer-evidence-compare">
                    <h4>Repair Evidence Comparison</h4>
                    <PhotoComparisonSlider
                      beforeImage={selectedIssue.evidenceBefore || undefined}
                      afterImage={selectedIssue.evidenceAfter || undefined}
                    />
                  </div>
                )}

                {/* Community Comments */}
                <div className="drawer-comments-section">
                  <h4>Community Discussion</h4>
                  <CommentSection
                    issueId={selectedIssue.id}
                    currentUser={{ user_metadata: { name: userName }, name: userName }}
                    currentUserRole="citizen"
                  />
                </div>

                {/* Share Issue */}
                <div className="drawer-share-section">
                  <h4>Share This Report</h4>
                  <ShareIssue issue={selectedIssue} />
                </div>
              </div>
            )}
          </div>
        </section>

        {/* ANALYTICS & INSIGHTS ROW */}
        <section className="dashboard-analytics-row" id="analytics-section">
          {/* Category Doughnut Chart */}
          <div className="analytics-card">
            <div className="analytics-card-header">
              <div>
                <h3>Issue Distribution by Category</h3>
                <p>Real-time civic volume breakdown in Delhi NCR</p>
              </div>
              <TrendingUp size={18} color="var(--jd-green)" />
            </div>

            <div className="chart-center-box">
              <Doughnut
                data={chartData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      position: "bottom",
                      labels: {
                        boxWidth: 12,
                        font: { size: 11 },
                        color: darkMode ? "#a4b9ad" : "#52675b",
                      },
                    },
                  },
                }}
              />
            </div>
          </div>

          {/* SLA Performance & Citizen Audit Trust */}
          <div className="analytics-card">
            <div className="analytics-card-header">
              <div>
                <h3>Governance & SLA Metrics</h3>
                <p>Civic accountability performance indicators</p>
              </div>
              <ShieldCheck size={18} color="var(--jd-emerald)" />
            </div>

            <div className="sla-stats-list">
              <div className="sla-item">
                <div className="sla-item-left">
                  <strong>Citizen Verification Rate</strong>
                  <span>Issues inspected & signed off by residents</span>
                </div>
                <div className="sla-stat-val" style={{ color: "var(--jd-emerald)" }}>
                  98.4%
                </div>
              </div>

              <div className="sla-item">
                <div className="sla-item-left">
                  <strong>Municipal SLA Compliance</strong>
                  <span>Issues resolved within targeted timeframe</span>
                </div>
                <div className="sla-stat-val">94.2%</div>
              </div>

              <div className="sla-item">
                <div className="sla-item-left">
                  <strong>Average Resolution Turnaround</strong>
                  <span>Average time from report to verification</span>
                </div>
                <div className="sla-stat-val">28 hrs</div>
              </div>
            </div>

            {/* Recent Live Activity Stream */}
            <div className="recent-activity-section">
              <h4>Recent Real-time Activity</h4>
              <div className="recent-activity-list">
                {activities.slice(0, 3).map((act) => (
                  <div key={act.id} className="activity-mini-item">
                    <span className="pulse-dot-green" />
                    <div>
                      <strong>{act.user}</strong> {act.type === "verify" ? "verified" : act.type === "dispute" ? "disputed" : "reported"} &ldquo;{act.issueTitle}&rdquo;
                      <span className="act-time">{act.time}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* QUICK REPORT CIVIC ISSUE MODAL */}
      {isReportModalOpen && (
        <div
          className="modal-overlay"
          onClick={() => setIsReportModalOpen(false)}
        >
          <div className="modal-dialog" onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              className="modal-close-btn"
              onClick={() => setIsReportModalOpen(false)}
              aria-label="Close dialog"
            >
              <X size={18} />
            </button>

            <div className="modal-header">
              <h2>Report a Civic Problem 📢</h2>
              <p>
                Provide details and location so municipal field teams can dispatch repairs.
              </p>
            </div>

            <form onSubmit={handleCreateReport} className="modal-form-grid">
              <div className="modal-field">
                <label htmlFor="issue-title">Issue Title *</label>
                <input
                  id="issue-title"
                  type="text"
                  placeholder="e.g. Hazardous pothole near metro station entrance"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  required
                />
              </div>

              <div className="modal-field">
                <label htmlFor="issue-category">Category *</label>
                <select
                  id="issue-category"
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                >
                  <option value="Roads & Potholes">Roads & Potholes</option>
                  <option value="Water Supply">Water Supply & Leakage</option>
                  <option value="Streetlighting">Streetlighting & Grid</option>
                  <option value="Waste Management">Waste & Sanitation</option>
                  <option value="Drainage & Sewage">Drainage & Sewage</option>
                  <option value="Parks & Green Spaces">Parks & Public Spaces</option>
                </select>
              </div>

              <div className="modal-field">
                <label htmlFor="issue-ward">Ward / Locality in Delhi *</label>
                <div className="location-input-group">
                  <input
                    id="issue-ward"
                    type="text"
                    placeholder="e.g. Ward 42 - Connaught Place (NDMC)"
                    value={newWard}
                    onChange={(e) => setNewWard(e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    className="btn-detect-gps"
                    onClick={handleLocateMe}
                    title="Auto-detect GPS coordinates"
                  >
                    <Crosshair size={14} />
                    <span>Auto GPS</span>
                  </button>
                </div>
                <div className="gps-indicator-row">
                  <span>
                    Pinned: {gpsCoordinates.lat}° N, {gpsCoordinates.lng}° E
                  </span>
                  {gpsStatus && (
                    <span style={{ color: "var(--jd-emerald)", fontWeight: 700 }}>
                      {gpsStatus}
                    </span>
                  )}
                </div>
                <button
                  type="button"
                  className="btn-check-duplicate"
                  onClick={handleCheckDuplicate}
                  disabled={dupChecking || !newTitle.trim()}
                >
                  {dupChecking ? "Scanning…" : (<> <AlertTriangle size={13} /> Check for Similar Issues</>)}
                </button>
              </div>

              <div className="modal-field">
                <label htmlFor="issue-priority">Urgency Level</label>
                <select
                  id="issue-priority"
                  value={newPriority}
                  onChange={(e) => setNewPriority(e.target.value)}
                >
                  <option value="Normal">Normal Priority</option>
                  <option value="High">High Priority</option>
                  <option value="Urgent">Urgent / Safety Hazard</option>
                </select>
              </div>

              <div className="modal-field">
                <label htmlFor="issue-desc">Description</label>
                <textarea
                  id="issue-desc"
                  rows={3}
                  placeholder="Describe landmarks, approximate size, or how long this problem has existed..."
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                />
              </div>

              <div className="modal-field">
                <label htmlFor="issue-photo">Photo URL (Optional)</label>
                <input
                  id="issue-photo"
                  type="url"
                  placeholder="https://example.com/photo.jpg or leave empty for default geotag"
                  value={newPhotoUrl}
                  onChange={(e) => setNewPhotoUrl(e.target.value)}
                />
              </div>

              {dupCheckResult && (
                <DuplicateWarning
                  category={newCategory}
                  latitude={gpsCoordinates.lat}
                  longitude={gpsCoordinates.lng}
                  title={newTitle}
                  description={newDesc}
                  ward={newWard}
                />
              )}
              <div className="modal-actions">
                <button
                  type="button"
                  className="btn-modal-cancel"
                  onClick={() => setIsReportModalOpen(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn-modal-submit">
                  <Plus size={16} />
                  <span>Submit Civic Report</span>
                </button>
                {dupChecking && <span className="modal-dup-checking">Scanning for similar issues…</span>}
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CITIZEN DISPUTE MODAL */}
      {disputeModalOpen && disputeIssueTarget && (
        <div className="modal-overlay" onClick={() => setDisputeModalOpen(false)}>
          <div className="modal-dialog" onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              className="modal-close-btn"
              onClick={() => setDisputeModalOpen(false)}
              aria-label="Close dialog"
            >
              <X size={18} />
            </button>

            <div className="modal-header">
              <h2>Dispute & Reopen Ticket ⚠️</h2>
              <p>
                Tell municipal authorities why the repair is incomplete or substandard.
              </p>
            </div>

            <div className="dispute-context-card">
              <strong>{disputeIssueTarget.id}: {disputeIssueTarget.title}</strong>
              <p>{disputeIssueTarget.ward}</p>
            </div>

            <div className="modal-field" style={{ marginTop: "16px" }}>
              <label htmlFor="dispute-reason">Reason for Dispute *</label>
              <textarea
                id="dispute-reason"
                rows={3}
                placeholder="e.g. Bitumen was poured unevenly and water is still pooling, or pothole not fully leveled..."
                value={disputeReason}
                onChange={(e) => setDisputeReason(e.target.value)}
                required
              />
            </div>

            <div className="modal-actions">
              <button
                type="button"
                className="btn-modal-cancel"
                onClick={() => setDisputeModalOpen(false)}
              >
                Cancel
              </button>
              <button
                type="button"
                className="btn-modal-submit dispute-btn"
                onClick={handleConfirmDispute}
              >
                <RotateCcw size={16} />
                <span>Submit Dispute & Escalate</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* FOOTER */}
      <footer className="jan-footer">
        <div className="jan-container footer-inner">
          <div>
            <strong>JanDrishti</strong> &middot; Report. Resolve. Verify.
          </div>
          <div>
            <span>Supporting SDG 11 &middot; Sustainable Cities & Communities</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

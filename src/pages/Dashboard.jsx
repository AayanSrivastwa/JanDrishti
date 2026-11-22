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
  Camera,
  Layers,
  Map as MapIcon,
  ListFilter,
  LogOut,
  Sparkles,
} from "lucide-react";

import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Doughnut } from "react-chartjs-2";

import { useAuth } from "../context/AuthContext";
import { logoutUser } from "../Services/authService";
import AnimatedBackground from "../components/AnimatedBackground";
import CivicMap from "../components/CivicMap";
import "../styles/dashboard.css";

// Register Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend);

// REALISTIC CIVIC ISSUES (Bangalore City Wards coordinates)
const INITIAL_ISSUES = [
  {
    id: 1,
    title: "Crater-sized Pothole on 80ft Road Junction",
    category: "Roads & Potholes",
    ward: "Ward 14 - Koramangala",
    status: "progress",
    latitude: 12.9352,
    longitude: 77.6245,
    description: "Deep pothole causing serious vehicle damage and bike skids during peak hours.",
    timeAgo: "2 hours ago",
    priority: "Urgent",
  },
  {
    id: 2,
    title: "Drinking Water Pipeline Burst & Sidewalk Flooding",
    category: "Water Supply",
    ward: "Ward 12 - Indiranagar",
    status: "verification",
    latitude: 12.9719,
    longitude: 77.6412,
    description: "Main line leak repaired by municipal water supply crew. Citizen verification required before ticket can close.",
    timeAgo: "4 hours ago",
    priority: "High",
    evidenceNote: "Municipal team uploaded before & after replacement photographs for your inspection.",
  },
  {
    id: 3,
    title: "Flickering High-Mast Streetlight Corridor",
    category: "Streetlighting",
    ward: "Ward 07 - Jayanagar",
    status: "resolved",
    latitude: 12.925,
    longitude: 77.5938,
    description: "Power utility division replaced old sodium luminaire with new energy-efficient LED fixture.",
    timeAgo: "Yesterday",
    priority: "Normal",
  },
  {
    id: 4,
    title: "Uncollected Garbage Accumulation near Bus Bay",
    category: "Waste Management",
    ward: "Ward 22 - Malleshwaram",
    status: "review",
    latitude: 12.9982,
    longitude: 77.5714,
    description: "Commercial cardboard and food waste overflow encroaching onto sidewalk. Field inspector assigned.",
    timeAgo: "3 hours ago",
    priority: "High",
  },
  {
    id: 5,
    title: "Clogged Stormwater Drain causing Road Flooding",
    category: "Drainage & Sewage",
    ward: "Ward 18 - HSR Layout",
    status: "progress",
    latitude: 12.9121,
    longitude: 77.6446,
    description: "Desilting and concrete culvert clearing currently in progress by municipal drainage crew.",
    timeAgo: "5 hours ago",
    priority: "Urgent",
  },
  {
    id: 6,
    title: "Broken Playground Swing in Community Park",
    category: "Parks & Green Spaces",
    ward: "Ward 04 - Sadashivanagar",
    status: "resolved",
    latitude: 13.0068,
    longitude: 77.5813,
    description: "Safety chains repaired and seat replaced. Verified fixed by neighborhood association.",
    timeAgo: "2 days ago",
    priority: "Normal",
  },
];

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

  const userName = profile?.name || user?.user_metadata?.name || "Citizen";

  // Light / Dark Theme State
  const [darkMode, setDarkMode] = useState(
    () => localStorage.getItem("jandrishti-theme") === "dark"
  );

  function toggleTheme() {
    const nextTheme = !darkMode;
    setDarkMode(nextTheme);
    localStorage.setItem("jandrishti-theme", nextTheme ? "dark" : "light");
  }

  async function handleLogout() {
    await logoutUser();
    navigate("/login");
  }

  // Dashboard View Mode: "split" | "map" | "feed"
  const [viewMode, setViewMode] = useState("split");

  // Civic Issues State
  const [issues, setIssues] = useState(INITIAL_ISSUES);
  const [selectedIssue, setSelectedIssue] = useState(INITIAL_ISSUES[1]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [statusFilter, setStatusFilter] = useState("all"); // "all" | "verification" | "progress" | "resolved"

  // Quick Report Modal State
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newCategory, setNewCategory] = useState("Roads & Potholes");
  const [newWard, setNewWard] = useState("Ward 12 - Indiranagar");
  const [newDesc, setNewDesc] = useState("");
  const [newPriority, setNewPriority] = useState("High");
  const [gpsCoordinates, setGpsCoordinates] = useState({
    lat: 12.9716,
    lng: 77.5946,
  });
  const [gpsStatus, setGpsStatus] = useState("");

  // Verification Feedback Notice
  const [bannerNotice, setBannerNotice] = useState("");

  // User Live Geolocation
  const [userLocation, setUserLocation] = useState(null);

  function handleLocateMe() {
    if (navigator.geolocation) {
      setGpsStatus("Detecting location...");
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const coords = [position.coords.latitude, position.coords.longitude];
          setUserLocation(coords);
          setGpsCoordinates({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
          setGpsStatus("GPS location detected!");
        },
        () => {
          setUserLocation([12.9716, 77.5946]);
          setGpsStatus("Defaulted to Bangalore Central.");
        }
      );
    } else {
      setGpsStatus("Geolocation not supported by browser.");
    }
  }

  // Verification Action Handler
  function handleVerifyIssue(issueId, newStatus) {
    setIssues((prev) =>
      prev.map((item) => {
        if (item.id === issueId) {
          return {
            ...item,
            status: newStatus,
            timeAgo: "Just now",
          };
        }
        return item;
      })
    );

    if (newStatus === "resolved") {
      setBannerNotice(
        "🎉 Issue resolution verified & approved by citizen! Ticket marked officially closed."
      );
    } else {
      setBannerNotice(
        "⚠️ Issue disputed & reopened! Escalation flag sent to Ward Executive Engineer."
      );
    }

    setTimeout(() => {
      setBannerNotice("");
    }, 5500);
  }

  // Handle New Report Submission
  function handleCreateReport(e) {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const newIssue = {
      id: Date.now(),
      title: newTitle.trim(),
      category: newCategory,
      ward: newWard,
      status: "review",
      latitude: gpsCoordinates.lat,
      longitude: gpsCoordinates.lng,
      description: newDesc.trim() || "Reported via Citizen Quick Dashboard.",
      timeAgo: "Just now",
      priority: newPriority,
    };

    setIssues((prev) => [newIssue, ...prev]);
    setSelectedIssue(newIssue);
    setIsReportModalOpen(false);

    setNewTitle("");
    setNewDesc("");
    setGpsStatus("");
  }

  // Filtered Issues Calculation
  const filteredIssues = useMemo(() => {
    return issues.filter((issue) => {
      const matchesSearch =
        issue.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        issue.ward.toLowerCase().includes(searchQuery.toLowerCase()) ||
        issue.category.toLowerCase().includes(searchQuery.toLowerCase());

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
            "#2563eb",
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
          </nav>

          <div className="navbar-actions">
            <div className="live-network-tag">
              <span className="pulse-dot-green" />
              <span>Bangalore Wards Live</span>
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

      <main className="jan-container" style={{ paddingBottom: "60px" }}>
        {/* EXECUTIVE HEADER */}
        <section className="dashboard-header-area">
          <div className="header-welcome">
            <h1>Command Center Dashboard 🏙️</h1>
            <p>
              Inspect, track, and verify municipal infrastructure repairs in real time.
            </p>
          </div>

          <div className="header-actions-group">
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

        {/* FEEDBACK NOTICE */}
        {bannerNotice && (
          <div
            style={{
              padding: "12px 18px",
              background: "#eaf6f0",
              border: "1px solid #16845b",
              color: "#16845b",
              borderRadius: "10px",
              marginBottom: "18px",
              fontSize: "13px",
              fontWeight: 700,
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}
          >
            <Sparkles size={16} />
            <span>{bannerNotice}</span>
          </div>
        )}

        {/* CITIZEN VERIFICATION SPOTLIGHT */}
        {pendingVerificationIssue && (
          <div className="verification-spotlight">
            <div className="spotlight-left">
              <div className="spotlight-icon-box">
                <ShieldCheck size={24} />
              </div>
              <div className="spotlight-text">
                <h4>
                  ⚡ Citizen Verification Required: Work Claimed Completed
                </h4>
                <p>
                  <strong>{pendingVerificationIssue.title}</strong> ({pendingVerificationIssue.ward})
                  has been marked repaired by field teams. As the citizen, your inspection is required.
                </p>
              </div>
            </div>

            <div className="spotlight-actions">
              <button
                type="button"
                className="btn-spotlight-confirm"
                onClick={() => handleVerifyIssue(pendingVerificationIssue.id, "resolved")}
              >
                <Check size={14} />
                <span>Verify & Close Ticket</span>
              </button>
              <button
                type="button"
                className="btn-spotlight-reopen"
                onClick={() => handleVerifyIssue(pendingVerificationIssue.id, "progress")}
              >
                <RotateCcw size={14} />
                <span>Dispute & Reopen</span>
              </button>
            </div>
          </div>
        )}

        {/* KPI METRICS RIBBON */}
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
                  placeholder="Filter by ward, title, or category..."
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
                  return (
                    <div
                      key={issue.id}
                      className={`issue-stream-card ${isSelected ? "selected" : ""}`}
                      onClick={() => setSelectedIssue(issue)}
                    >
                      <div className="card-top-row">
                        <span className="badge-category">{issue.category}</span>
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
                          <MapPin size={12} /> {issue.ward} • {issue.timeAgo}
                        </span>

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
                            <Check size={12} /> Confirm Fixed
                          </button>
                          <button
                            type="button"
                            className="btn-inline-dispute"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleVerifyIssue(issue.id, "progress");
                            }}
                          >
                            <RotateCcw size={12} /> Reopen
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Right Panel: Leaflet Map */}
          <div className="command-right-map">
            <CivicMap
              issues={filteredIssues}
              selectedIssue={selectedIssue}
              onSelectIssue={(issue) => setSelectedIssue(issue)}
              onVerifyIssue={handleVerifyIssue}
              darkMode={darkMode}
              userLocation={userLocation}
              onLocateMe={handleLocateMe}
            />
          </div>
        </section>

        {/* ANALYTICS & INSIGHTS ROW */}
        <section className="dashboard-analytics-row" id="analytics-section">
          {/* Category Doughnut Chart */}
          <div className="analytics-card">
            <div className="analytics-card-header">
              <div>
                <h3>Issue Distribution by Category</h3>
                <p>Real-time civic volume breakdown</p>
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
                <div className="sla-stat-val">32 hrs</div>
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
                  placeholder="e.g. Hazardous pothole near supermarket entrance"
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
                <label htmlFor="issue-ward">Ward / Locality *</label>
                <div className="location-input-group">
                  <input
                    id="issue-ward"
                    type="text"
                    placeholder="e.g. Ward 14 - Koramangala"
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
                {gpsStatus && (
                  <span style={{ fontSize: "11px", color: "var(--jd-green)" }}>
                    {gpsStatus}
                  </span>
                )}
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

              <div
                style={{
                  border: "1.5px dashed var(--jd-border)",
                  borderRadius: "10px",
                  padding: "16px",
                  textAlign: "center",
                  background: "var(--jd-bg)",
                  fontSize: "12px",
                  color: "var(--jd-text-light)",
                  cursor: "pointer",
                }}
              >
                <Camera
                  size={22}
                  color="var(--jd-muted)"
                  style={{ display: "block", margin: "0 auto 6px" }}
                />
                <strong>Attach Photographic Proof (Geotagged)</strong>
                <p style={{ margin: "2px 0 0", fontSize: "11px", color: "var(--jd-muted)" }}>
                  PNG, JPG up to 10MB
                </p>
              </div>

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
              </div>
            </form>
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

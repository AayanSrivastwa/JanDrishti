import { useState } from "react";
import { Link } from "react-router";
import {
  ShieldCheck,
  MapPin,
  CheckCircle2,
  AlertTriangle,
  Clock,
  ArrowRight,
  Sun,
  Moon,
  Sparkles,
  Camera,
  Check,
  X,
  RotateCcw,
  Users,
  BarChart3,
  ChevronDown,
  Building2,
  Menu,
  Zap,
  Droplets,
  Lightbulb,
  Trash2,
  TreePine,
  Hammer,
  Layers,
  HelpCircle,
  Award,
  Lock,
  Unlock,
  Radio,
  Activity,
  Eye,
  FileCheck,
} from "lucide-react";

import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import AnimatedBackground from "../components/AnimatedBackground";
import "../styles/landing.css";

// MOCK DATA FOR INTERACTIVE CIVIC RADAR
const RADAR_ISSUES = [
  {
    id: 1,
    title: "Deep Pothole on Outer Ring Road Flyover",
    category: "Roads & Potholes",
    ward: "Ward 58 - Lajpat Nagar",
    status: "resolved",
    statusText: "Citizen Verified Resolved",
    reportedAgo: "3 days ago",
    resolvedAgo: "4 hours ago",
    coords: "28.5700° N, 77.2400° E",
    sla: "Target: 36h • Actual: 28h",
    description:
      "Hazardous crater on arterial ring road repaired with hot-mix bitumen overlay. Verified by resident @ananya_k with photo confirmation.",
    x: "28%",
    y: "36%",
    icon: Hammer,
  },
  {
    id: 2,
    title: "Faulty Streetlight Pole #42 Dark Corridor",
    category: "Streetlighting",
    ward: "Ward 42 - Connaught Place",
    status: "progress",
    statusText: "In Progress (Field Team Dispatched)",
    reportedAgo: "14 hours ago",
    resolvedAgo: "Est. 6 hours",
    coords: "28.6315° N, 77.2167° E",
    sla: "Target: 18h • Remaining: 4h",
    description:
      "LED luminaire replacement initiated by NDMC electrical maintenance division. Safety barricade installed.",
    x: "64%",
    y: "28%",
    icon: Lightbulb,
  },
  {
    id: 3,
    title: "Burst Drinking Water Pipeline & Flooding",
    category: "Water Supply",
    ward: "Ward 82 - Karol Bagh",
    status: "review",
    statusText: "Under Municipal Review",
    reportedAgo: "2 hours ago",
    resolvedAgo: "Pending assignment",
    coords: "28.6514° N, 77.1907° E",
    sla: "Target: 24h • Queued",
    description:
      "High-pressure Delhi Jal Board treated line leakage flooding pedestrian sidewalk. Urgent civic priority assigned.",
    x: "42%",
    y: "68%",
    icon: Droplets,
  },
  {
    id: 4,
    title: "Overflowing Garbage Dump near Community Park",
    category: "Waste Management",
    ward: "Ward 64 - Hauz Khas",
    status: "resolved",
    statusText: "Citizen Verified Resolved",
    reportedAgo: "2 days ago",
    resolvedAgo: "Yesterday",
    coords: "28.5494° N, 77.2001° E",
    sla: "Target: 14h • Actual: 11h",
    description:
      "Segregated waste clearance completed by MCD sanitation crew and secondary containment bins placed. Confirmed clean by Resident Association.",
    x: "78%",
    y: "74%",
    icon: Trash2,
  },
];

// CIVIC CATEGORIES WITH BESPOKE METRICS
const CATEGORIES_DATA = [
  {
    name: "Roads & Potholes",
    icon: Hammer,
    count: "4,120 reports",
    avgTime: "28h avg fix",
    solveRate: "97.4%",
    desc: "Craters, fractured asphalt, damaged speed bumps, and missing road median markers.",
    badgeColor: "emerald",
  },
  {
    name: "Streetlights & Grid",
    icon: Lightbulb,
    count: "2,840 reports",
    avgTime: "18h avg fix",
    solveRate: "98.9%",
    desc: "Dark transit corridors, flickering fixtures, exposed junction wiring, and knocked-down poles.",
    badgeColor: "amber",
  },
  {
    name: "Water Supply & Leaks",
    icon: Droplets,
    count: "1,950 reports",
    avgTime: "24h avg fix",
    solveRate: "96.8%",
    desc: "Burst municipal mains, contaminated tap flow, low pressure, and open valves wasting drinking water.",
    badgeColor: "blue",
  },
  {
    name: "Waste & Sanitation",
    icon: Trash2,
    count: "3,310 reports",
    avgTime: "14h avg fix",
    solveRate: "99.1%",
    desc: "Black spots, overflowing community dumpsters, dead animal removal, and unauthorized waste dumping.",
    badgeColor: "green",
  },
  {
    name: "Parks & Green Spaces",
    icon: TreePine,
    count: "980 reports",
    avgTime: "48h avg fix",
    solveRate: "95.2%",
    desc: "Fallen tree limbs, damaged children playground equipment, encroached walkways, and broken benches.",
    badgeColor: "teal",
  },
  {
    name: "Drainage & Sewage",
    icon: Zap,
    count: "1,670 reports",
    avgTime: "26h avg fix",
    solveRate: "96.4%",
    desc: "Blocked storm drains causing monsoon street waterlogging, sewage overflow, and open manhole hazards.",
    badgeColor: "purple",
  },
];

// FAQS
const FAQS_DATA = [
  {
    q: "How does JanDrishti prevent authorities from falsely marking issues resolved?",
    a: "Unlike traditional government grievance portals where an officer's single checkbox closes a ticket, JanDrishti introduces a mandatory Citizen Verification gate. An issue only reaches 'Closed' status when the reporting citizen inspects the work and confirms it. If the fix is incomplete or cosmetic, you can reopen it with a single tap.",
  },
  {
    q: "Do I need to pay or install an app to report an issue?",
    a: "No. JanDrishti is completely free for all citizens and accessible directly from any web browser or mobile phone without complex downloads. You simply take a photo, allow GPS location, describe the problem, and submit.",
  },
  {
    q: "What happens if an authority marks an issue resolved but the problem still exists?",
    a: "You simply click 'Dispute & Reopen'. The ticket status immediately changes back to 'Reopened', alerts the ward supervisor, and marks an audit flag on that department's performance scorecard.",
  },
  {
    q: "Can I track issues reported by other people in my neighborhood?",
    a: "Yes! JanDrishti features an open Civic Map and Community Watch where you can view nearby problems, upvote priority issues, and avoid duplicate filings for the same pothole or broken streetlight.",
  },
  {
    q: "How does JanDrishti align with SDG 11?",
    a: "JanDrishti directly supports UN Sustainable Development Goal 11 (Sustainable Cities and Communities) by fostering inclusive, transparent, participatory, and responsive municipal infrastructure governance.",
  },
];

export default function LandingPage() {
  const { user } = useAuth();

  // Dark / Light Theme (shared via ThemeContext)
  const { theme, toggleTheme } = useTheme();
  const darkMode = theme === "dark";

  // Mobile menu toggle
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Hero Interactive Simulation State
  const [simState, setSimState] = useState("pending"); // "pending" | "verified" | "reopened"
  const [evidenceTab, setEvidenceTab] = useState("after"); // "before" | "after"
  const [simNotice, setSimNotice] = useState("");

  function handleSimVerify() {
    setSimState("verified");
    setSimNotice(
      "Resolution verified! Cryptographic sign-off ledger written. Ward 42 Civic Trust Score +20 awarded."
    );
  }

  function handleSimDispute() {
    setSimState("reopened");
    setSimNotice(
      "Dispute logged! Reopened with urgent escalation priority to Ward 42 Executive Engineer."
    );
  }

  function handleSimReset() {
    setSimState("pending");
    setEvidenceTab("after");
    setSimNotice("");
  }

  // Interactive Radar State
  const [radarFilter, setRadarFilter] = useState("all");
  const [selectedIssueId, setSelectedIssueId] = useState(1);

  const filteredIssues = RADAR_ISSUES.filter((issue) => {
    if (radarFilter === "all") return true;
    return issue.status === radarFilter;
  });

  const selectedIssue =
    RADAR_ISSUES.find((i) => i.id === selectedIssueId) || RADAR_ISSUES[0];

  // FAQ Accordion State
  const [openFaq, setOpenFaq] = useState(0);

  return (
    <div className={`landing-page ${darkMode ? "dark-mode" : ""}`}>
      {/* Background Ambience */}
      <AnimatedBackground />

      <div className="landing-ambient-canvas" aria-hidden="true">
        <div className="ambient-orb ambient-orb-1" />
        <div className="ambient-orb ambient-orb-2" />
        <div className="ambient-orb ambient-orb-3" />
        <div className="ambient-grid" />
      </div>

      {/* TOP ANNOUNCEMENT TICKER */}
      <div className="top-telemetry-banner">
        <div className="landing-container">
          <div className="telemetry-bar-inner">
            <div className="telemetry-item">
              <span className="telemetry-pulse" />
              <strong>LIVE PILOT NETWORK:</strong>
              <span>DELHI NCR WARD 42 & 58 • 70+ WARDS CONNECTED</span>
            </div>
            <div className="telemetry-item desktop-only">
              <Radio size={12} />
              <span>SATELLITE TELEMETRY ACTIVE</span>
              <span className="telemetry-separator">•</span>
              <span>ZERO FALSE CLOSURES GUARANTEED</span>
            </div>
          </div>
        </div>
      </div>

      {/* NAVBAR */}
      <header className="landing-nav-wrapper">
        <div className="landing-container">
          <nav className="landing-nav" aria-label="Main Navigation">
            <Link to="/" className="landing-brand">
              <div className="landing-brand-mark">
                <span>JD</span>
                <div className="brand-dot" />
              </div>
              <div className="landing-brand-text">
                <h2>JanDrishti</h2>
                <span>Civic Intelligence Console</span>
              </div>
            </Link>

            {/* Desktop Links */}
            <ul
              className={`landing-nav-links ${mobileMenuOpen ? "mobile-open" : ""}`}
            >
              <li>
                <a
                  href="#how-it-works"
                  className="landing-nav-link"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Architecture
                </a>
              </li>
              <li>
                <a
                  href="#verification"
                  className="landing-nav-link"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Citizen Verification
                </a>
              </li>
              <li>
                <a
                  href="#categories"
                  className="landing-nav-link"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Scope & Categories
                </a>
              </li>
              <li>
                <a
                  href="#radar"
                  className="landing-nav-link"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Civic Radar
                </a>
              </li>
              <li>
                <a
                  href="#faq"
                  className="landing-nav-link"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  FAQ
                </a>
              </li>
              <li>
                <Link
                  to="/admin"
                  className="landing-nav-link"
                  style={{ color: "var(--jd-emerald)", fontWeight: 700 }}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Municipal Portal
                </Link>
              </li>
            </ul>

            {/* Actions */}
            <div className="landing-nav-actions">
              <button
                type="button"
                className="theme-toggle-btn"
                onClick={toggleTheme}
                aria-label="Toggle theme"
                title="Switch dark / light mode"
              >
                {darkMode ? <Sun size={17} /> : <Moon size={17} />}
              </button>

              {user ? (
                <Link to="/dashboard" className="btn-nav-cta">
                  <span>Open Console</span>
                  <ArrowRight size={15} />
                </Link>
              ) : (
                <>
                  <Link to="/login" className="btn-nav-login">
                    Sign in
                  </Link>
                  <Link to="/register" className="btn-nav-cta">
                    <span>Report Issue</span>
                    <ArrowRight size={15} />
                  </Link>
                </>
              )}

              <button
                type="button"
                className="mobile-menu-btn"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                aria-label="Toggle navigation menu"
              >
                <Menu size={22} />
              </button>
            </div>
          </nav>
        </div>
      </header>

      {/* HERO SECTION */}
      <section className="landing-hero">
        <div className="landing-container">
          <div className="hero-grid">
            {/* Left Column: Value Prop */}
            <div className="hero-copy-col">
              <div className="hero-pill-badge">
                <span className="pulse-dot" />
                <Sparkles size={13} />
                <span>UN SDG 11: Sustainable Cities & Communities</span>
              </div>

              <h1 className="hero-headline">
                Empowering Citizens.
                <br />
                <span className="text-gradient">Citizen-Verified</span>
                <br />
                Civic Resolution.
              </h1>

              <p className="hero-description">
                A pothole isn&apos;t paved just because an office spreadsheet
                says &ldquo;resolved&rdquo;. JanDrishti ends false closures by
                placing the final verification key in the hands of the citizen who
                walks that street.
              </p>

              <div className="hero-buttons">
                <Link
                  to={user ? "/dashboard" : "/register"}
                  className="btn-primary-glow"
                >
                  <span>Report a Civic Issue</span>
                  <ArrowRight size={18} />
                </Link>

                <a href="#demo" className="btn-secondary-glass">
                  <Activity size={16} />
                  <span>Inspect Live Demo</span>
                </a>
              </div>

              {/* Refined Telemetry Badges */}
              <div className="hero-trust-badges">
                <div className="trust-item">
                  <ShieldCheck size={16} />
                  <span>100% Citizen Verified</span>
                </div>
                <div className="trust-item">
                  <CheckCircle2 size={16} />
                  <span>Zero False Closures</span>
                </div>
                <div className="trust-item">
                  <MapPin size={16} />
                  <span>GPS Geotagged Proof</span>
                </div>
              </div>
            </div>

            {/* Right Column: High-Fidelity Interactive Hero Simulation Card */}
            <div className="hero-visual-wrapper" id="demo">
              {/* Floating Ambient HUD Chips */}
              <div className="floating-chip floating-chip-1">
                <div className="chip-icon">
                  <MapPin size={15} />
                </div>
                <div>
                  <div className="chip-label">RADAR SECTOR 42</div>
                  <strong className="chip-value">18h avg resolution</strong>
                </div>
              </div>

              <div className="floating-chip floating-chip-2">
                <div className="chip-icon award-icon">
                  <Award size={15} />
                </div>
                <div>
                  <div className="chip-label">CIVIC AUDIT TRAIL</div>
                  <strong className="chip-value">Tamper-evident logs</strong>
                </div>
              </div>

              {/* Main Interactive Inspection Card */}
              <div className="hero-interactive-card">
                <div className="sim-card-header">
                  <div className="sim-header-tag">
                    <span className="sim-badge-type">CIVIC INSPECTOR</span>
                    <span className="sim-badge-id">#JD-8941</span>
                  </div>
                  <div className="sim-live-indicator">
                    <span className="pulse-dot" />
                    <span>Real-time Sync</span>
                  </div>
                </div>

                <div className="sim-title-group">
                  <h3 className="sim-issue-title">
                    Damaged Water Main & Flooded Walkway
                  </h3>
                  <div className="sim-issue-meta">
                    <span className="meta-tag">
                      <MapPin size={13} /> Connaught Place Outer Circle
                    </span>
                    <span className="meta-tag">
                      <Building2 size={13} /> Ward 42 Water Div. (NDMC / DJB)
                    </span>
                    <span className="meta-coords">28.6315° N, 77.2167° E</span>
                  </div>
                </div>

                {/* Evidence Comparison Tabs (Before vs After) */}
                <div className="sim-evidence-box">
                  <div className="sim-evidence-tabs">
                    <button
                      type="button"
                      className={`evidence-tab-btn ${
                        evidenceTab === "before" ? "active" : ""
                      }`}
                      onClick={() => setEvidenceTab("before")}
                    >
                      <Camera size={13} />
                      <span>Citizen Initial Photo</span>
                    </button>
                    <button
                      type="button"
                      className={`evidence-tab-btn ${
                        evidenceTab === "after" ? "active" : ""
                      }`}
                      onClick={() => setEvidenceTab("after")}
                    >
                      <FileCheck size={13} />
                      <span>Municipal Repair Proof</span>
                      <span className="evidence-badge-new">NEW</span>
                    </button>
                  </div>

                  {/* Simulated Visual Evidence Viewport */}
                  <div className="sim-evidence-viewport">
                    {evidenceTab === "before" ? (
                      <div className="evidence-frame before-frame">
                        <div className="evidence-overlay-hud">
                          <span className="evidence-hud-tag red">
                            ⚠️ REPORTED HAZARD
                          </span>
                          <span className="evidence-hud-time">
                            Nov 4 &bull; 08:30 AM
                          </span>
                        </div>
                        <div className="evidence-graphic-road">
                          <div className="road-pothole-svg" />
                          <div className="water-ripple-effect" />
                          <div className="hud-crosshair" />
                        </div>
                        <div className="evidence-caption">
                          Citizen Photo: High-pressure pipe rupture with surface erosion
                        </div>
                      </div>
                    ) : (
                      <div className="evidence-frame after-frame">
                        <div className="evidence-overlay-hud">
                          <span className="evidence-hud-tag green">
                            🛠️ FIELD REPAIR COMPLETED
                          </span>
                          <span className="evidence-hud-seal">
                            SEAL #NDMC-DJB-4821
                          </span>
                        </div>
                        <div className="evidence-graphic-road repaired">
                          <div className="road-repaired-overlay" />
                          <div className="seal-stamp-svg">
                            <CheckCircle2 size={18} />
                            <span>OFFICIAL REPAIR</span>
                          </div>
                        </div>
                        <div className="evidence-caption">
                          Municipal Evidence: Heavy-duty sleeve installed, bitumen re-laid
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Stepper Progress */}
                <div className="sim-stepper">
                  <div
                    className="sim-stepper-progress"
                    style={{
                      width:
                        simState === "verified"
                          ? "100%"
                          : simState === "reopened"
                          ? "35%"
                          : "75%",
                    }}
                  />

                  <div className="sim-step completed">
                    <div className="sim-step-circle">
                      <Check size={13} />
                    </div>
                    <span>01. Reported</span>
                  </div>

                  <div
                    className={`sim-step ${
                      simState === "reopened" ? "active dispute" : "completed"
                    }`}
                  >
                    <div className="sim-step-circle">
                      {simState === "reopened" ? (
                        <AlertTriangle size={13} />
                      ) : (
                        <Check size={13} />
                      )}
                    </div>
                    <span>
                      {simState === "reopened" ? "Reopened" : "02. Assigned"}
                    </span>
                  </div>

                  <div
                    className={`sim-step ${
                      simState === "verified"
                        ? "completed"
                        : simState === "pending"
                        ? "active"
                        : ""
                    }`}
                  >
                    <div className="sim-step-circle">
                      {simState === "verified" ? (
                        <Check size={13} />
                      ) : (
                        <Camera size={13} />
                      )}
                    </div>
                    <span>03. Repaired</span>
                  </div>

                  <div
                    className={`sim-step ${
                      simState === "verified"
                        ? "completed"
                        : simState === "pending"
                        ? "active pulse"
                        : ""
                    }`}
                  >
                    <div className="sim-step-circle">
                      {simState === "verified" ? (
                        <CheckCircle2 size={14} />
                      ) : (
                        <Lock size={13} />
                      )}
                    </div>
                    <span>04. Citizen Verdict</span>
                  </div>
                </div>

                {/* Interactive Action Area */}
                <div className="sim-action-box">
                  {simState === "pending" && (
                    <>
                      <div className="sim-action-prompt">
                        <Sparkles size={16} />
                        <span>Action Required: Municipal Team Requests Closure</span>
                      </div>
                      <p className="sim-action-sub">
                        Review the field team&apos;s repair photo above. Does the
                        work meet street standards?
                      </p>

                      <div className="sim-verify-buttons">
                        <button
                          type="button"
                          className="sim-btn-verify"
                          onClick={handleSimVerify}
                        >
                          <Check size={16} />
                          <span>Verify & Sign Off</span>
                        </button>
                        <button
                          type="button"
                          className="sim-btn-dispute"
                          onClick={handleSimDispute}
                        >
                          <X size={16} />
                          <span>Dispute & Reopen</span>
                        </button>
                      </div>
                    </>
                  )}

                  {simState === "verified" && (
                    <div className="sim-result-celebrate">
                      <div className="sim-result-badge verified">
                        <CheckCircle2 size={18} />
                        <span>Officially Closed by Citizen Verification</span>
                      </div>
                      <div className="sim-receipt-box">
                        <div className="receipt-row">
                          <span>AUDIT RECEIPT:</span>
                          <strong>#VER-2026-9021-OK</strong>
                        </div>
                        <div className="receipt-row">
                          <span>SIGNATURE:</span>
                          <strong>Citizen Key Verified (SHA-256)</strong>
                        </div>
                        <div className="receipt-row">
                          <span>TRUST IMPACT:</span>
                          <strong className="text-emerald">+20 pts to Ward 42 (Connaught Place)</strong>
                        </div>
                      </div>
                      <p className="sim-result-note">{simNotice}</p>
                      <button
                        type="button"
                        className="sim-reset-link"
                        onClick={handleSimReset}
                      >
                        <RotateCcw size={12} />
                        <span>Try interactive simulation again</span>
                      </button>
                    </div>
                  )}

                  {simState === "reopened" && (
                    <div className="sim-result-celebrate">
                      <div className="sim-result-badge reopened">
                        <AlertTriangle size={18} />
                        <span>Dispute Docket Logged & Escalated</span>
                      </div>
                      <div className="sim-receipt-box dispute">
                        <div className="receipt-row">
                          <span>ESCALATION ID:</span>
                          <strong>#ESC-402-URGENT</strong>
                        </div>
                        <div className="receipt-row">
                          <span>REASON:</span>
                          <strong>Citizen flagged substandard repair</strong>
                        </div>
                        <div className="receipt-row">
                          <span>ALERT ROUTED TO:</span>
                          <strong>Ward 42 Executive Engineer (NDMC)</strong>
                        </div>
                      </div>
                      <p className="sim-result-note">{simNotice}</p>
                      <button
                        type="button"
                        className="sim-reset-link"
                        onClick={handleSimReset}
                      >
                        <RotateCcw size={12} />
                        <span>Reset simulation</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* STATS IMPACT COUNTER BAR */}
      <section className="landing-stats-section">
        <div className="landing-container">
          <div className="stats-card-grid">
            <div className="stat-item">
              <div className="stat-icon-wrap">
                <BarChart3 size={24} />
              </div>
              <div>
                <div className="stat-number">14,250+</div>
                <div className="stat-label">Civic Issues Logged</div>
              </div>
            </div>

            <div className="stat-item">
              <div className="stat-icon-wrap highlight">
                <ShieldCheck size={24} />
              </div>
              <div>
                <div className="stat-number text-emerald">98.4%</div>
                <div className="stat-label">Citizen Verification Rate</div>
              </div>
            </div>

            <div className="stat-item">
              <div className="stat-icon-wrap">
                <Clock size={24} />
              </div>
              <div>
                <div className="stat-number">28 hrs</div>
                <div className="stat-label">Average Response Time</div>
              </div>
            </div>

            <div className="stat-item">
              <div className="stat-icon-wrap">
                <Building2 size={24} />
              </div>
              <div>
                <div className="stat-number">48 Wards</div>
                <div className="stat-label">Active Municipal Coverage</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS / BENTO GRID ARCHITECTURE */}
      <section className="landing-workflow-section" id="how-it-works">
        <div className="landing-container">
          <div className="section-header">
            <span className="section-tag">
              <Sparkles size={12} /> The Zero-False-Closure Architecture
            </span>
            <h2 className="section-title">
              Engineered to Prevent Paper Solutions.
              <br />
              Transparent from Snap to Sign-off.
            </h2>
            <p className="section-subtitle">
              Every civic report follows an audited, tamper-evident pipeline
              where tickets physically cannot close without direct citizen approval.
            </p>
          </div>

          {/* EDITORIAL BENTO GRID */}
          <div className="bento-grid-architecture">
            {/* Bento Card 1: Precision Geotagged Reporting (Wide) */}
            <div className="bento-card bento-wide">
              <div className="bento-header">
                <span className="bento-step-pill">01 / CAPTURE</span>
                <span className="bento-telemetry-tag">
                  GPS SAT-LOCK &bull; &plusmn;3m
                </span>
              </div>
              <h3 className="bento-title">Sub-meter Geotagged Reporting</h3>
              <p className="bento-desc">
                Citizens photograph infrastructure hazards. JanDrishti extracts
                exact satellite coordinates, timestamps, and auto-classifies the
                category to prevent vague or misfiled complaints.
              </p>

              {/* Graphic Mock inside Card */}
              <div className="bento-visual bento-capture-visual">
                <div className="viewfinder-ui">
                  <div className="vf-corner vf-tl" />
                  <div className="vf-corner vf-tr" />
                  <div className="vf-corner vf-bl" />
                  <div className="vf-corner vf-br" />
                  <div className="vf-telemetry">
                    <span>LAT 28.6315&deg; N / LON 77.2167&deg; E</span>
                    <span className="vf-badge">AUTO-AI DETECT: ROAD HAZARD (99.4%)</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Bento Card 2: Algorithmic Ward Routing */}
            <div className="bento-card">
              <div className="bento-header">
                <span className="bento-step-pill">02 / ROUTING</span>
                <Clock size={15} color="var(--jd-amber)" />
              </div>
              <h3 className="bento-title">Algorithmic SLA Routing</h3>
              <p className="bento-desc">
                Reports bypass bureaucratic bottlenecks and route directly to
                the designated Ward Assistant Executive Engineer with strict SLA
                countdowns.
              </p>

              <div className="bento-visual bento-routing-visual">
                <div className="routing-sla-chip">
                  <div className="sla-ring">
                    <span>24h</span>
                  </div>
                  <div>
                    <strong>Target Municipal SLA</strong>
                    <span>Auto-escalates at 20h</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Bento Card 3: Photographic Chain-of-Custody */}
            <div className="bento-card">
              <div className="bento-header">
                <span className="bento-step-pill">03 / EVIDENCE</span>
                <FileCheck size={15} color="var(--jd-emerald)" />
              </div>
              <h3 className="bento-title">Mandatory Repair Proof</h3>
              <p className="bento-desc">
                Field contractors cannot claim resolution with words alone. They
                must upload geotagged photographs of the completed repair.
              </p>

              <div className="bento-visual bento-evidence-visual">
                <div className="chain-custody-pill">
                  <span className="pulse-dot" />
                  <span>Before &amp; After Photo Hash Logged</span>
                </div>
              </div>
            </div>

            {/* Bento Card 4: Citizen Verification Gate (Wide Highlight) */}
            <div className="bento-card bento-wide bento-featured">
              <div className="bento-highlight-badge">
                <ShieldCheck size={13} />
                <span>CORE CIVIC INNOVATION</span>
              </div>
              <div className="bento-header">
                <span className="bento-step-pill">04 / THE VERDICT</span>
                <span className="bento-telemetry-tag green">
                  IMMUTABLE SIGN-OFF
                </span>
              </div>
              <h3 className="bento-title">
                The Citizen Holds the Final Closure Key
              </h3>
              <p className="bento-desc">
                The government cannot check a box and declare victory. The
                reporting citizen reviews the site. If the fix is genuine, you
                confirm resolution. If it was a quick cosmetic patch, tap
                dispute to reopen with top-level executive visibility.
              </p>

              <div className="bento-visual bento-gate-visual">
                <div className="gate-flow-display">
                  <div className="gate-node locked">
                    <Lock size={16} />
                    <span>Officer Closure Locked</span>
                  </div>
                  <div className="gate-connector">&rarr;</div>
                  <div className="gate-node action">
                    <Eye size={16} />
                    <span>Citizen Field Inspection</span>
                  </div>
                  <div className="gate-connector">&rarr;</div>
                  <div className="gate-node unlocked">
                    <Unlock size={16} />
                    <span>Official Closure Approved</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* THE COMPARISON: TRADITIONAL VS JANDRISHTI */}
      <section className="landing-comparison-section" id="verification">
        <div className="landing-container">
          <div className="section-header">
            <span className="section-tag">
              <AlertTriangle size={12} /> The Accountability Gap
            </span>
            <h2 className="section-title">
              Why Traditional Portals Fail
              <br />
              And How JanDrishti Fixes It
            </h2>
            <p className="section-subtitle">
              Closing a complaint on an internal database is not the same as
              actually fixing a pothole on your street.
            </p>
          </div>

          <div className="comparison-grid">
            {/* Traditional */}
            <div className="comparison-card flawed">
              <span className="comparison-badge flawed-badge">
                <X size={13} /> Traditional Grievance Systems
              </span>
              <h3 className="comparison-title">Administrative Black Hole</h3>
              <p className="comparison-desc">
                Complaints get marked &ldquo;Resolved&rdquo; internally to hit
                quotas, leaving the citizen with unresolved hazards and zero
                recourse.
              </p>

              <ul className="comparison-list">
                <li className="comparison-item bad">
                  <div className="item-icon-wrap bad">
                    <X size={14} />
                  </div>
                  <span>
                    <strong>False Paper Closures:</strong> Tickets closed without
                    independent verification.
                  </span>
                </li>
                <li className="comparison-item bad">
                  <div className="item-icon-wrap bad">
                    <X size={14} />
                  </div>
                  <span>
                    <strong>No Photo Evidence Required:</strong> Authorities
                    never provide photographic proof of actual repairs.
                  </span>
                </li>
                <li className="comparison-item bad">
                  <div className="item-icon-wrap bad">
                    <X size={14} />
                  </div>
                  <span>
                    <strong>Opaque Workflows:</strong> You submit a ticket and
                    never know which engineer is dispatched.
                  </span>
                </li>
                <li className="comparison-item bad">
                  <div className="item-icon-wrap bad">
                    <X size={14} />
                  </div>
                  <span>
                    <strong>No Dispute Recourse:</strong> Citizens are forced to
                    file brand new tickets when false closures happen.
                  </span>
                </li>
              </ul>
            </div>

            {/* JanDrishti */}
            <div className="comparison-card jandrishti">
              <span className="comparison-badge good-badge">
                <Check size={13} /> The JanDrishti Standard
              </span>
              <h3 className="comparison-title">Citizen-Verified Governance</h3>
              <p className="comparison-desc">
                Power is placed back where it belongs: in the hands of the
                residents who live in and care for their neighborhood.
              </p>

              <ul className="comparison-list">
                <li className="comparison-item good">
                  <div className="item-icon-wrap good">
                    <CheckCircle2 size={14} />
                  </div>
                  <span>
                    <strong>Citizen Holds the Final Key:</strong> Tickets cannot
                    close until verified by the reporting citizen.
                  </span>
                </li>
                <li className="comparison-item good">
                  <div className="item-icon-wrap good">
                    <CheckCircle2 size={14} />
                  </div>
                  <span>
                    <strong>Mandatory Photographic Audit:</strong> Before-and-after
                    photos logged on an immutable public ledger.
                  </span>
                </li>
                <li className="comparison-item good">
                  <div className="item-icon-wrap good">
                    <CheckCircle2 size={14} />
                  </div>
                  <span>
                    <strong>Instant One-Tap Reopening:</strong> Substandard fixes
                    are escalated immediately to higher executive engineers.
                  </span>
                </li>
                <li className="comparison-item good">
                  <div className="item-icon-wrap good">
                    <CheckCircle2 size={14} />
                  </div>
                  <span>
                    <strong>SDG 11 Alignment:</strong> Measurable improvement in
                    city infrastructure sustainability and public trust.
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* CIVIC PROBLEM CATEGORIES */}
      <section className="landing-categories-section" id="categories">
        <div className="landing-container">
          <div className="section-header">
            <span className="section-tag">
              <Layers size={12} /> Comprehensive Scope
            </span>
            <h2 className="section-title">
              Addressing Every Local Challenge
            </h2>
            <p className="section-subtitle">
              From fractured pavement to malfunctioning streetlights, JanDrishti
              organizes issues cleanly for targeted municipal intervention.
            </p>
          </div>

          <div className="categories-grid">
            {CATEGORIES_DATA.map((cat, index) => {
              const IconComp = cat.icon;
              return (
                <div key={index} className="category-card">
                  <div className="category-top">
                    <div className={`category-icon-bubble ${cat.badgeColor}`}>
                      <IconComp size={22} />
                    </div>
                    <span className="category-stat-pill">{cat.count}</span>
                  </div>

                  <h3 className="category-name">{cat.name}</h3>
                  <p className="category-desc">{cat.desc}</p>

                  <div className="category-footer">
                    <div className="cat-metric">
                      <span className="cat-metric-label">Avg Turnaround</span>
                      <strong className="cat-metric-val">
                        <Clock size={12} /> {cat.avgTime}
                      </strong>
                    </div>
                    <div className="cat-metric">
                      <span className="cat-metric-label">Resolution</span>
                      <strong className="cat-metric-val text-emerald">
                        {cat.solveRate}
                      </strong>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CIVIC RADAR / INTERACTIVE MAP PREVIEW */}
      <section className="landing-map-section" id="radar">
        <div className="landing-container">
          <div className="section-header">
            <span className="section-tag">
              <Radio size={12} /> Live Civic Radar
            </span>
            <h2 className="section-title">
              Explore Neighborhood Issues in Real Time
            </h2>
            <p className="section-subtitle">
              Click on the active radar pins below to inspect reported hazards,
              repair progress, and verified resolutions in your city.
            </p>
          </div>

          <div className="radar-console">
            <div className="radar-header">
              <div className="radar-title-group">
                <span className="pulse-dot" />
                <div className="radar-hud-title">
                  <h3>City Center &amp; Ward Radar Simulation</h3>
                  <span>GEO-EXTENT: DELHI NCT &bull; REFRESH: LIVE</span>
                </div>
              </div>

              <div className="radar-filters">
                <button
                  type="button"
                  className={`radar-filter-btn ${
                    radarFilter === "all" ? "active" : ""
                  }`}
                  onClick={() => setRadarFilter("all")}
                >
                  All Issues ({RADAR_ISSUES.length})
                </button>
                <button
                  type="button"
                  className={`radar-filter-btn ${
                    radarFilter === "resolved" ? "active" : ""
                  }`}
                  onClick={() => setRadarFilter("resolved")}
                >
                  Verified Resolved
                </button>
                <button
                  type="button"
                  className={`radar-filter-btn ${
                    radarFilter === "progress" ? "active" : ""
                  }`}
                  onClick={() => setRadarFilter("progress")}
                >
                  In Progress
                </button>
                <button
                  type="button"
                  className={`radar-filter-btn ${
                    radarFilter === "review" ? "active" : ""
                  }`}
                  onClick={() => setRadarFilter("review")}
                >
                  Under Review
                </button>
              </div>
            </div>

            <div className="radar-body">
              {/* Left: Map Radar Canvas */}
              <div className="radar-map-canvas">
                <div className="radar-map-grid" />
                <div className="radar-range-ring ring-1" />
                <div className="radar-range-ring ring-2" />
                <div className="radar-range-ring ring-3" />
                <div className="radar-sweep-beam" />

                <div className="radar-canvas-hud">
                  <span>SCALE: 1:25000</span>
                  <span>BEARING: 042&deg; NE</span>
                </div>

                {filteredIssues.map((issue) => {
                  const IconMarker = issue.icon;
                  const isSelected = issue.id === selectedIssueId;
                  return (
                    <div
                      key={issue.id}
                      className={`radar-marker ${
                        isSelected ? "selected" : ""
                      }`}
                      style={{ top: issue.y, left: issue.x }}
                      onClick={() => setSelectedIssueId(issue.id)}
                      title={issue.title}
                    >
                      <div
                        className={`marker-pulse marker-${issue.status}`}
                      >
                        <IconMarker size={15} />
                      </div>
                      <div className="marker-tooltip">
                        <strong>{issue.title}</strong>
                        <span>{issue.ward}</span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Right: Selected Detail Sidebar */}
              <div className="radar-sidebar">
                <div className="radar-detail-card">
                  <div className="detail-badge-row">
                    <span
                      className={`detail-status-pill ${selectedIssue.status}`}
                    >
                      {selectedIssue.statusText}
                    </span>
                    <span className="detail-reported-ago">
                      {selectedIssue.reportedAgo}
                    </span>
                  </div>

                  <h4 className="detail-title">{selectedIssue.title}</h4>
                  <p className="detail-desc">{selectedIssue.description}</p>

                  <div className="detail-telemetry-hud">
                    <div className="hud-line">
                      <span className="hud-label">COORDINATES:</span>
                      <span className="hud-val">{selectedIssue.coords}</span>
                    </div>
                    <div className="hud-line">
                      <span className="hud-label">SLA BENCHMARK:</span>
                      <span className="hud-val">{selectedIssue.sla}</span>
                    </div>
                  </div>

                  <div className="detail-meta-list">
                    <span>
                      <MapPin size={13} color="var(--jd-green)" />{" "}
                      {selectedIssue.ward}
                    </span>
                    <span>
                      <Clock size={13} color="var(--jd-green)" /> Resolution:{" "}
                      {selectedIssue.resolvedAgo}
                    </span>
                    <span>
                      <ShieldCheck size={13} color="var(--jd-emerald)" /> Citizen
                      Verification Audit Trail Active
                    </span>
                  </div>

                  <Link
                    to={user ? "/dashboard" : "/register"}
                    className="detail-cta-link"
                  >
                    <span>View full report details</span>
                    <ArrowRight size={14} />
                  </Link>
                </div>

                <div className="radar-footer-tip">
                  💡 <em>Select any marker on the radar to inspect details</em>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* COMMUNITY TESTIMONIALS */}
      <section className="landing-testimonials-section">
        <div className="landing-container">
          <div className="section-header">
            <span className="section-tag">
              <Users size={12} /> Community Voices
            </span>
            <h2 className="section-title">
              Loved by Residents &amp; Ward Leaders
            </h2>
            <p className="section-subtitle">
              See how JanDrishti is turning frustration into collaborative civic
              action across neighborhoods.
            </p>
          </div>

          <div className="testimonials-grid">
            <div className="testimonial-card">
              <div>
                <div className="testimonial-stars">★★★★★</div>
                <p className="testimonial-quote">
                  &ldquo;For 6 months our street had a massive open trench. On
                  traditional portals it was marked resolved twice without any
                  work. With JanDrishti, I was able to dispute the fake closure.
                  The Ward Engineer called personally, and it was filled in 36
                  hours!&rdquo;
                </p>
              </div>
              <div className="testimonial-author">
                <div className="author-avatar">RK</div>
                <div className="author-info">
                  <h4>Rahul Kulkarni</h4>
                  <span>Secretary, Lajpat Nagar Residents Welfare</span>
                </div>
              </div>
            </div>

            <div className="testimonial-card">
              <div>
                <div className="testimonial-stars">★★★★★</div>
                <p className="testimonial-quote">
                  &ldquo;As a municipal field supervisor, JanDrishti gives my
                  team clear geotagged photos and direct feedback. Having the
                  citizen verify our work also protects honest workers from
                  unfounded complaints.&rdquo;
                </p>
              </div>
              <div className="testimonial-author">
                <div className="author-avatar">SM</div>
                <div className="author-info">
                  <h4>Suresh Murthy</h4>
                  <span>Ward 42 Assistant Executive Engineer (NDMC)</span>
                </div>
              </div>
            </div>

            <div className="testimonial-card">
              <div>
                <div className="testimonial-stars">★★★★★</div>
                <p className="testimonial-quote">
                  &ldquo;The interface is so fast and intuitive. I reported a
                  flickering streetlight near my college transit stop at 8 PM,
                  and by next evening it was replaced with a new LED light with
                  photo proof.&rdquo;
                </p>
              </div>
              <div className="testimonial-author">
                <div className="author-avatar">PS</div>
                <div className="author-info">
                  <h4>Priya Sharma</h4>
                  <span>Civic Volunteer &amp; Student</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FREQUENTLY ASKED QUESTIONS */}
      <section className="landing-faq-section" id="faq">
        <div className="landing-container">
          <div className="section-header">
            <span className="section-tag">
              <HelpCircle size={12} /> Clear Answers
            </span>
            <h2 className="section-title">Frequently Asked Questions</h2>
            <p className="section-subtitle">
              Everything you need to know about reporting, verification, and data
              privacy.
            </p>
          </div>

          <div className="faq-list">
            {FAQS_DATA.map((faq, index) => {
              const isOpen = openFaq === index;
              return (
                <div
                  key={index}
                  className={`faq-item ${isOpen ? "open" : ""}`}
                >
                  <button
                    type="button"
                    className="faq-question-btn"
                    onClick={() => setOpenFaq(isOpen ? -1 : index)}
                    aria-expanded={isOpen}
                  >
                    <span>{faq.q}</span>
                    <ChevronDown
                      size={18}
                      style={{
                        transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
                        transition: "transform 0.25s ease",
                      }}
                    />
                  </button>
                  {isOpen && <div className="faq-answer">{faq.a}</div>}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* FINAL CALL TO ACTION */}
      <section className="landing-final-cta">
        <div className="landing-container">
          <div className="cta-banner">
            <div className="cta-content">
              <h2 className="cta-title">
                Be the Eyes of Your Neighborhood.
              </h2>
              <p className="cta-subtitle">
                Join thousands of active residents who are building cleaner,
                safer, and more responsive cities with verified accountability.
              </p>

              <div className="cta-buttons">
                <Link
                  to={user ? "/dashboard" : "/register"}
                  className="btn-white"
                >
                  <span>Get Started for Free</span>
                  <ArrowRight size={17} />
                </Link>
                <Link to="/login" className="btn-translucent">
                  <span>Log in to Existing Account</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="landing-footer">
        <div className="landing-container">
          <div className="footer-top">
            <div className="footer-brand">
              <div className="landing-brand">
                <div className="landing-brand-mark">
                  <span>JD</span>
                </div>
                <div className="landing-brand-text">
                  <h2 style={{ color: "#ffffff" }}>JanDrishti</h2>
                  <span style={{ color: "#8fa89b" }}>Civic Intelligence Console</span>
                </div>
              </div>
              <p>
                Transparent, citizen-verified civic issue resolution. Connecting
                residents and authorities to build sustainable, accountable
                communities.
              </p>
              <div className="footer-sdg-tag">
                <Sparkles size={13} /> Supporting UN SDG 11
              </div>
            </div>

            <div className="footer-column">
              <h4>Architecture</h4>
              <ul className="footer-links">
                <li>
                  <a href="#how-it-works">Zero False Closures</a>
                </li>
                <li>
                  <a href="#verification">Citizen Verification Key</a>
                </li>
                <li>
                  <a href="#categories">Issue Taxonomy</a>
                </li>
                <li>
                  <a href="#radar">Civic Radar Telemetry</a>
                </li>
              </ul>
            </div>

            <div className="footer-column">
              <h4>Portals</h4>
              <ul className="footer-links">
                <li>
                  <Link to="/login">Citizen Login</Link>
                </li>
                <li>
                  <Link to="/register">Register New Account</Link>
                </li>
                <li>
                  <Link to="/dashboard">GIS Command Center</Link>
                </li>
                <li>
                  <a href="#faq">Help &amp; FAQ</a>
                </li>
              </ul>
            </div>

            <div className="footer-column">
              <h4>Governance</h4>
              <ul className="footer-links">
                <li>
                  <a href="#faq">Verification Guidelines</a>
                </li>
                <li>
                  <a href="#faq">Municipal SLA Standards</a>
                </li>
                <li>
                  <a href="#faq">Privacy &amp; Geodata</a>
                </li>
                <li>
                  <a href="#faq">Open Civic API</a>
                </li>
              </ul>
            </div>
          </div>

          <div className="footer-bottom">
            <div>
              &copy; {new Date().getFullYear()} JanDrishti &bull; Report. Resolve.
              Verify. All rights reserved.
            </div>
            <div className="footer-status-pill">
              <span className="pulse-dot" />
              <span>All Civic Network Systems Operational</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

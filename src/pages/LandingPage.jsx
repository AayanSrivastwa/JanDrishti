import { useState, useEffect } from "react";
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
  ArrowUpRight,
  HelpCircle,
  ThumbsUp,
  Award,
} from "lucide-react";

import { useAuth } from "../context/AuthContext";
import AnimatedBackground from "../components/AnimatedBackground";
import "../styles/landing.css";

// MOCK DATA FOR INTERACTIVE CIVIC RADAR
const RADAR_ISSUES = [
  {
    id: 1,
    title: "Deep Pothole on 100ft Inner Ring Road",
    category: "Roads & Potholes",
    ward: "Ward 14 - Koramangala",
    status: "resolved",
    statusText: "Citizen Verified Resolved",
    reportedAgo: "3 days ago",
    resolvedAgo: "4 hours ago",
    description:
      "Hazardous crater on arterial road repaired with bitumen overlay. Verified by resident @ananya_k with photo confirmation.",
    x: "28%",
    y: "36%",
    icon: Hammer,
  },
  {
    id: 2,
    title: "Faulty Streetlight Pole #42 Dark Corridor",
    category: "Streetlighting",
    ward: "Ward 07 - Indiranagar",
    status: "progress",
    statusText: "In Progress (Field Team Dispatched)",
    reportedAgo: "14 hours ago",
    resolvedAgo: "Est. 6 hours",
    description:
      "LED luminaire replacement initiated by BESCOM field division. Safety barricade installed.",
    x: "64%",
    y: "28%",
    icon: Lightbulb,
  },
  {
    id: 3,
    title: "Burst Drinking Water Pipeline & Flooding",
    category: "Water Supply",
    ward: "Ward 22 - Malleshwaram",
    status: "review",
    statusText: "Under Municipal Review",
    reportedAgo: "2 hours ago",
    resolvedAgo: "Pending assignment",
    description:
      "High-pressure treated water leakage flooding pedestrian sidewalk. Urgent civic priority assigned.",
    x: "42%",
    y: "68%",
    icon: Droplets,
  },
  {
    id: 4,
    title: "Overflowing Garbage Dump near Community Park",
    category: "Waste Management",
    ward: "Ward 09 - Jayanagar",
    status: "resolved",
    statusText: "Citizen Verified Resolved",
    reportedAgo: "2 days ago",
    resolvedAgo: "Yesterday",
    description:
      "Segregated waste clearance completed and secondary containment bins placed. Confirmed clean by Resident Association.",
    x: "78%",
    y: "74%",
    icon: Trash2,
  },
];

// CIVIC CATEGORIES
const CATEGORIES_DATA = [
  {
    name: "Roads & Potholes",
    icon: Hammer,
    count: "4,120 reported",
    avgTime: "36 hrs avg fix",
    desc: "Craters, broken asphalt, dangerous speed bumps, and missing road median markers.",
  },
  {
    name: "Streetlights & Grid",
    icon: Lightbulb,
    count: "2,840 reported",
    avgTime: "18 hrs avg fix",
    desc: "Dark street corners, flickering sodium fixtures, exposed wiring, and knocked-down poles.",
  },
  {
    name: "Water Supply & Leaks",
    icon: Droplets,
    count: "1,950 reported",
    avgTime: "24 hrs avg fix",
    desc: "Burst municipal mains, dirty water flow, low pressure, and open valves wasting water.",
  },
  {
    name: "Waste & Sanitation",
    icon: Trash2,
    count: "3,310 reported",
    avgTime: "14 hrs avg fix",
    desc: "Black spots, uncollected community bins, dead animal disposal, and illegal dump yards.",
  },
  {
    name: "Parks & Green Spaces",
    icon: TreePine,
    count: "980 reported",
    avgTime: "48 hrs avg fix",
    desc: "Fallen tree limbs, damaged playground equipment, encroached paths, and dead foliage.",
  },
  {
    name: "Drainage & Sewage",
    icon: Zap,
    count: "1,670 reported",
    avgTime: "28 hrs avg fix",
    desc: "Blocked storm drains causing waterlogging during monsoons, sewage overflow, and missing lids.",
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

  // Dark / Light Theme
  const [darkMode, setDarkMode] = useState(
    () => localStorage.getItem("jandrishti-theme") === "dark"
  );

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  function toggleTheme() {
    const nextTheme = !darkMode;
    setDarkMode(nextTheme);
    localStorage.setItem("jandrishti-theme", nextTheme ? "dark" : "light");
  }

  // Mobile menu toggle
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Hero Interactive Simulation State
  const [simState, setSimState] = useState("pending"); // "pending" | "verified" | "reopened"
  const [simNotice, setSimNotice] = useState("");

  function handleSimVerify() {
    setSimState("verified");
    setSimNotice("Resolution confirmed! Civic Trust Score +20 awarded to Ward 12.");
  }

  function handleSimDispute() {
    setSimState("reopened");
    setSimNotice("Dispute logged! Reopened with urgent priority to Ward Executive Engineer.");
  }

  function handleSimReset() {
    setSimState("pending");
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

      {/* NAVBAR */}
      <header className="landing-nav-wrapper">
        <div className="landing-container">
          <nav className="landing-nav" aria-label="Main Navigation">
            <Link to="/" className="landing-brand">
              <div className="landing-brand-mark">JD</div>
              <div className="landing-brand-text">
                <h2>JanDrishti</h2>
                <span>Civic Issue Platform</span>
              </div>
            </Link>

            {/* Desktop Links */}
            <ul className={`landing-nav-links ${mobileMenuOpen ? "mobile-open" : ""}`}>
              <li>
                <a
                  href="#how-it-works"
                  className="landing-nav-link"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  How it Works
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
                  Issue Categories
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
            </ul>

            {/* Actions */}
            <div className="landing-nav-actions">
              <button
                type="button"
                className="theme-toggle-btn"
                onClick={toggleTheme}
                aria-label="Toggle theme"
              >
                {darkMode ? <Sun size={18} /> : <Moon size={18} />}
              </button>

              {user ? (
                <Link to="/dashboard" className="btn-nav-cta">
                  <span>Go to Dashboard</span>
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
                <Sparkles size={14} />
                <span>SDG 11: Sustainable Cities & Communities</span>
              </div>

              <h1 className="hero-headline">
                Empowering Citizens.
                <br />
                <span className="text-gradient">Citizen-Verified</span>
                <br />
                Civic Resolution.
              </h1>

              <p className="hero-description">
                A pothole isn&apos;t paved just because an office file says so.
                JanDrishti bridges the accountability gap by returning the final
                sign-off to the citizen. Report, track real-time repairs, and
                confirm actual resolutions.
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
                  <span>Try Verification Demo</span>
                  <ArrowUpRight size={16} />
                </a>
              </div>

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
                  <span>Precise GPS Geotagging</span>
                </div>
              </div>
            </div>

            {/* Right Column: Interactive Hero Mockup / Simulator */}
            <div className="hero-visual-wrapper" id="demo">
              {/* Floating badges */}
              <div className="floating-chip floating-chip-1">
                <div className="chip-icon">
                  <MapPin size={15} />
                </div>
                <div>
                  <strong>Ward 12 Active Radar</strong>
                  <div style={{ fontSize: "11px", color: "var(--jd-text-muted)" }}>
                    18 hrs avg response
                  </div>
                </div>
              </div>

              <div className="floating-chip floating-chip-2">
                <div className="chip-icon">
                  <Award size={15} />
                </div>
                <div>
                  <strong>Verified Transparency</strong>
                  <div style={{ fontSize: "11px", color: "var(--jd-text-muted)" }}>
                    Audited issue lifecycle
                  </div>
                </div>
              </div>

              {/* Main Interactive Card */}
              <div className="hero-interactive-card">
                <div className="sim-card-header">
                  <div className="sim-header-tag">
                    <span className="sim-badge-type">LIVE SIMULATOR</span>
                    <span className="sim-badge-time">
                      <Clock size={12} /> Issue #JD-8941
                    </span>
                  </div>
                  <div className="sim-live-indicator">
                    <span className="pulse-dot" />
                    <span>Real-time Sync</span>
                  </div>
                </div>

                <h3 className="sim-issue-title">
                  Damaged Water Main & Flooded Walkway
                </h3>

                <div className="sim-issue-meta">
                  <span>
                    <MapPin size={13} /> Indiranagar 12th Main
                  </span>
                  <span>
                    <Building2 size={13} /> Ward 12 Municipal Div.
                  </span>
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
                      <Check size={14} />
                    </div>
                    <span>Reported</span>
                  </div>

                  <div
                    className={`sim-step ${
                      simState === "reopened" ? "active" : "completed"
                    }`}
                  >
                    <div className="sim-step-circle">
                      {simState === "reopened" ? (
                        <AlertTriangle size={14} />
                      ) : (
                        <Check size={14} />
                      )}
                    </div>
                    <span>
                      {simState === "reopened" ? "Reopened" : "Assigned"}
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
                        <Check size={14} />
                      ) : (
                        <Camera size={14} />
                      )}
                    </div>
                    <span>Work Done</span>
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
                        <ThumbsUp size={14} />
                      ) : (
                        <ShieldCheck size={14} />
                      )}
                    </div>
                    <span>Verification</span>
                  </div>
                </div>

                {/* Interactive Action Area */}
                <div className="sim-action-box">
                  {simState === "pending" && (
                    <>
                      <div className="sim-action-prompt">
                        <Sparkles size={16} color="var(--jd-green)" />
                        Municipal Official Uploaded Repair Evidence
                      </div>
                      <p className="sim-action-sub">
                        As the reporting citizen, does this look fully fixed to you?
                      </p>

                      <div className="sim-verify-buttons">
                        <button
                          type="button"
                          className="sim-btn-verify"
                          onClick={handleSimVerify}
                        >
                          <Check size={15} />
                          <span>✅ Verify & Confirm Resolved</span>
                        </button>
                        <button
                          type="button"
                          className="sim-btn-dispute"
                          onClick={handleSimDispute}
                        >
                          <X size={15} />
                          <span>❌ Not Fixed (Reopen)</span>
                        </button>
                      </div>
                    </>
                  )}

                  {simState === "verified" && (
                    <div className="sim-result-celebrate">
                      <div className="sim-result-badge">
                        <CheckCircle2 size={16} />
                        <span>Officially Closed by Citizen Verification</span>
                      </div>
                      <p style={{ fontSize: "12px", color: "var(--jd-text-muted)" }}>
                        {simNotice}
                      </p>
                      <button
                        type="button"
                        className="sim-reset-link"
                        onClick={handleSimReset}
                      >
                        <RotateCcw size={11} style={{ verticalAlign: "middle" }} />{" "}
                        Try interactive simulation again
                      </button>
                    </div>
                  )}

                  {simState === "reopened" && (
                    <div className="sim-result-celebrate">
                      <div className="sim-result-badge reopened">
                        <AlertTriangle size={16} />
                        <span>Issue Reopened with Escalation Notice</span>
                      </div>
                      <p style={{ fontSize: "12px", color: "var(--jd-text-muted)" }}>
                        {simNotice}
                      </p>
                      <button
                        type="button"
                        className="sim-reset-link"
                        onClick={handleSimReset}
                      >
                        <RotateCcw size={11} style={{ verticalAlign: "middle" }} />{" "}
                        Reset simulation
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
              <div className="stat-icon-wrap">
                <ShieldCheck size={24} />
              </div>
              <div>
                <div className="stat-number">98.4%</div>
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

      {/* HOW IT WORKS / 4-STEP WORKFLOW */}
      <section className="landing-workflow-section" id="how-it-works">
        <div className="landing-container">
          <div className="section-header">
            <span className="section-tag">
              <Sparkles size={12} /> The Structured Lifecycle
            </span>
            <h2 className="section-title">
              Report. Resolve. Verify.
              <br />
              Transparent from Start to Finish.
            </h2>
            <p className="section-subtitle">
              Every issue follows a tamper-evident workflow ensuring prompt
              municipal action and citizen-approved completion.
            </p>
          </div>

          <div className="workflow-grid">
            <div className="workflow-card">
              <span className="workflow-step-num">01 / SUBMIT</span>
              <div className="workflow-icon-box">
                <Camera size={26} />
              </div>
              <h3 className="workflow-title">Snap & Geotag</h3>
              <p className="workflow-desc">
                Citizens photograph problems like potholes, garbage, or pipe
                leaks. Accurate GPS coordinates and categories are auto-tagged in
                seconds.
              </p>
            </div>

            <div className="workflow-card">
              <span className="workflow-step-num">02 / DISPATCH</span>
              <div className="workflow-icon-box">
                <Building2 size={26} />
              </div>
              <h3 className="workflow-title">Municipal Routing</h3>
              <p className="workflow-desc">
                Reports automatically route to the corresponding Ward Officer and
                field engineers with explicit SLA timeframes.
              </p>
            </div>

            <div className="workflow-card">
              <span className="workflow-step-num">03 / EVIDENCE</span>
              <div className="workflow-icon-box">
                <Hammer size={26} />
              </div>
              <h3 className="workflow-title">Action & Photo Proof</h3>
              <p className="workflow-desc">
                Field teams perform corrective repairs and must upload
                photographic proof of the completed work before requesting
                closure.
              </p>
            </div>

            <div className="workflow-card featured-step">
              <span className="workflow-step-num">04 / THE VERDICT</span>
              <div className="workflow-icon-box">
                <ShieldCheck size={26} />
              </div>
              <h3 className="workflow-title">Citizen Verification</h3>
              <p className="workflow-desc">
                The citizen inspects the outcome. Choose{" "}
                <strong>Resolved ✅</strong> to officially close, or{" "}
                <strong>Dispute ❌</strong> to automatically reopen with priority!
              </p>
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
              <span className="comparison-badge">
                <X size={13} /> Traditional Complaint Systems
              </span>
              <h3 className="comparison-title">Administrative Black Hole</h3>
              <p className="comparison-desc">
                Complaints get marked &ldquo;Resolved&rdquo; internally to hit
                quotas, leaving the citizen with unresolved hazards and zero
                recourse.
              </p>

              <ul className="comparison-list">
                <li className="comparison-item bad">
                  <X size={17} />
                  <span>
                    <strong>False Paper Closures:</strong> Tickets closed without
                    independent verification.
                  </span>
                </li>
                <li className="comparison-item bad">
                  <X size={17} />
                  <span>
                    <strong>No Photo Evidence Required:</strong> Authorities
                    never show proof of actual repair.
                  </span>
                </li>
                <li className="comparison-item bad">
                  <X size={17} />
                  <span>
                    <strong>Opaque Workflows:</strong> You submit a ticket and
                    never know who is assigned or when it will be fixed.
                  </span>
                </li>
                <li className="comparison-item bad">
                  <X size={17} />
                  <span>
                    <strong>No Reopening Mechanism:</strong> Forced to start a
                    whole new complaint when the issue is ignored.
                  </span>
                </li>
              </ul>
            </div>

            {/* JanDrishti */}
            <div className="comparison-card jandrishti">
              <span className="comparison-badge">
                <Check size={13} /> The JanDrishti Standard
              </span>
              <h3 className="comparison-title">Citizen-Verified Governance</h3>
              <p className="comparison-desc">
                Power is placed back where it belongs: in the hands of the
                residents who live in and care for their neighborhood.
              </p>

              <ul className="comparison-list">
                <li className="comparison-item good">
                  <CheckCircle2 size={17} />
                  <span>
                    <strong>Citizen Holds the Final Key:</strong> Tickets cannot
                    close until verified by the reporting citizen.
                  </span>
                </li>
                <li className="comparison-item good">
                  <CheckCircle2 size={17} />
                  <span>
                    <strong>Mandatory Photographic Audit:</strong> Before-and-after
                    photos logged on an immutable record.
                  </span>
                </li>
                <li className="comparison-item good">
                  <CheckCircle2 size={17} />
                  <span>
                    <strong>Instant One-Tap Reopening:</strong> Substandard fixes
                    are escalated immediately to higher supervisors.
                  </span>
                </li>
                <li className="comparison-item good">
                  <CheckCircle2 size={17} />
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
                    <div className="category-icon-bubble">
                      <IconComp size={22} />
                    </div>
                    <span className="category-stat-pill">{cat.count}</span>
                  </div>

                  <h3 className="category-name">{cat.name}</h3>
                  <p className="category-desc">{cat.desc}</p>

                  <div className="category-footer">
                    <span>Performance Target</span>
                    <span className="category-time">
                      <Clock size={12} /> {cat.avgTime}
                    </span>
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
              <MapPin size={12} /> Live Civic Radar
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
                <h3>City Center & Ward Radar Simulation</h3>
              </div>

              <div className="radar-filters">
                <button
                  type="button"
                  className={`radar-filter-btn ${
                    radarFilter === "all" ? "active" : ""
                  }`}
                  onClick={() => setRadarFilter("all")}
                >
                  All Issues
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
                <div className="radar-sweep-beam" />

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
                    <span
                      style={{
                        fontSize: "11px",
                        color: "var(--jd-text-subtle)",
                      }}
                    >
                      {selectedIssue.reportedAgo}
                    </span>
                  </div>

                  <h4 className="detail-title">{selectedIssue.title}</h4>
                  <p className="detail-desc">{selectedIssue.description}</p>

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

                <div
                  style={{
                    fontSize: "12px",
                    color: "var(--jd-text-muted)",
                    marginTop: "16px",
                    textAlign: "center",
                  }}
                >
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
              Loved by Residents & Ward Leaders
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
                  <span>Secretary, Indiranagar Residents Welfare</span>
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
                  <span>Ward 14 Assistant Executive Engineer</span>
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
                  <span>Civic Volunteer & Student</span>
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
                <div className="landing-brand-mark">JD</div>
                <div className="landing-brand-text">
                  <h2 style={{ color: "#ffffff" }}>JanDrishti</h2>
                  <span style={{ color: "#8fa89b" }}>Civic Issue Platform</span>
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
              <h4>Platform</h4>
              <ul className="footer-links">
                <li>
                  <a href="#how-it-works">How It Works</a>
                </li>
                <li>
                  <a href="#verification">Citizen Verification</a>
                </li>
                <li>
                  <a href="#categories">Issue Categories</a>
                </li>
                <li>
                  <a href="#radar">Civic Radar Map</a>
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
                  <Link to="/dashboard">Issue Dashboard</Link>
                </li>
                <li>
                  <a href="#faq">Help & FAQ</a>
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
                  <a href="#faq">Privacy & Geodata</a>
                </li>
                <li>
                  <a href="#faq">Open Civic API</a>
                </li>
              </ul>
            </div>
          </div>

          <div className="footer-bottom">
            <div>
              &copy; {new Date().getFullYear()} JanDrishti. Report. Resolve.
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


import { useState, useMemo } from "react";
import { Link, useNavigate } from "react-router";
import {
  Building2,
  ShieldCheck,
  AlertTriangle,
  CheckCircle2,
  Send,
  Camera,
  MapPin,
  Search,
  Sun,
  Moon,
  LogOut,
  Layers,
  Activity,
  UserCheck,
} from "lucide-react";

import { logoutUser } from "../Services/authService";
import {
  getStoredIssues,
  assignOfficerToIssue,
  submitMunicipalRepairProof,
} from "../Services/issueService";
import AnimatedBackground from "../components/AnimatedBackground";
import "../styles/admin.css";
import { useTheme } from "../context/ThemeContext";

const DELHI_OFFICERS = [
  { name: "Rajesh Sharma, PWD South Division", dept: "Public Works Department (PWD Delhi)", wards: ["Ward 58 - Lajpat Nagar", "Ward 64 - Hauz Khas"] },
  { name: "Sunil Meena, DJB Central Zone", dept: "Delhi Jal Board (DJB)", wards: ["Ward 42 - Connaught Place (NDMC)", "Ward 82 - Karol Bagh"] },
  { name: "Sanjay Gupta, MCD Sanitation Dept", dept: "MCD City-SP Zone", wards: ["Ward 82 - Karol Bagh", "Ward 24 - Rohini Sector 9"] },
  { name: "Harish Chander, MCD Drainage Wing", dept: "MCD Najafgarh Zone", wards: ["Ward 35 - Dwarka Sector 10"] },
  { name: "Manoj Kumar, BSES Maintenance", dept: "BSES Rajdhani Power Ltd", wards: ["Ward 64 - Hauz Khas", "Ward 58 - Lajpat Nagar"] },
  { name: "Vikas Tyagi, DDA Horticulture", dept: "Delhi Development Authority (DDA)", wards: ["Ward 24 - Rohini Sector 9"] },
];

export default function AdminPortal() {
  const navigate = useNavigate();

  // Light / Dark Theme State (shared via ThemeContext)
  const { theme, toggleTheme } = useTheme();
  const darkMode = theme === "dark";

  async function handleLogout() {
    await logoutUser();
    navigate("/login");
  }

  const [issues, setIssues] = useState(() => getStoredIssues());
  const [selectedIssue, setSelectedIssue] = useState(() => issues[0] || null);
  const [activeTab, setActiveTab] = useState("all"); // "all" | "review" | "progress" | "verification" | "resolved"
  const [searchQuery, setSearchQuery] = useState("");

  // Dispatch Action Modal State
  const [assignModalOpen, setAssignModalOpen] = useState(false);
  const [selectedOfficer, setSelectedOfficer] = useState(DELHI_OFFICERS[0].name);

  // Submit Repair Proof Modal State
  const [repairModalOpen, setRepairModalOpen] = useState(false);
  const [repairContractor, setRepairContractor] = useState("");
  const [repairSeal, setRepairSeal] = useState("");
  const [repairNotes, setRepairNotes] = useState("");
  const [repairPhotoUrl, setRepairPhotoUrl] = useState("");

  // Feedback Notification
  const [notice, setNotice] = useState("");

  // Filtered issues
  const filteredIssues = useMemo(() => {
    return issues.filter((item) => {
      const matchSearch =
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.ward.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.category.toLowerCase().includes(searchQuery.toLowerCase());

      const matchTab = activeTab === "all" || item.status === activeTab;

      return matchSearch && matchTab;
    });
  }, [issues, searchQuery, activeTab]);

  // Derived Metrics
  const metrics = useMemo(() => {
    const total = issues.length;
    const pendingReview = issues.filter((i) => i.status === "review").length;
    const activeDispatched = issues.filter((i) => i.status === "progress").length;
    const awaitingCitizen = issues.filter((i) => i.status === "verification").length;
    const verifiedClosed = issues.filter((i) => i.status === "resolved").length;
    return { total, pendingReview, activeDispatched, awaitingCitizen, verifiedClosed };
  }, [issues]);

  function handleDispatchOfficer(e) {
    e.preventDefault();
    if (!selectedIssue || !selectedOfficer) return;

    const officerObj = DELHI_OFFICERS.find((o) => o.name === selectedOfficer);
    const updated = assignOfficerToIssue(
      selectedIssue.id,
      selectedOfficer,
      officerObj?.dept || "Municipal Division"
    );
    setIssues(updated);
    const refreshed = updated.find((i) => i.id === selectedIssue.id);
    if (refreshed) setSelectedIssue(refreshed);

    setAssignModalOpen(false);
    setNotice(`👷 Dispatched ${selectedOfficer} to #${selectedIssue.id}! Ticket status moved to In Progress.`);
    setTimeout(() => setNotice(""), 6000);
  }

  function handleSubmitProof(e) {
    e.preventDefault();
    if (!selectedIssue) return;

    const updated = submitMunicipalRepairProof(selectedIssue.id, {
      contractor: repairContractor.trim() || selectedIssue.assignedOfficer || "MCD Emergency Utility Squad",
      sealNumber: repairSeal.trim() || `SEAL #NDMC-${Math.floor(1000 + Math.random() * 9000)}`,
      notes: repairNotes.trim() || "Bitumen hot-mix re-laid and pressure tested according to Delhi PWD road specs.",
      photoUrl: repairPhotoUrl.trim() || "https://images.unsplash.com/photo-1541888946425-d0fbb1861564?w=800&auto=format&fit=crop&q=80",
    });

    setIssues(updated);
    const refreshed = updated.find((i) => i.id === selectedIssue.id);
    if (refreshed) setSelectedIssue(refreshed);

    setRepairModalOpen(false);
    setRepairContractor("");
    setRepairSeal("");
    setRepairNotes("");
    setRepairPhotoUrl("");

    setNotice(`📸 Repair evidence uploaded for #${selectedIssue.id}! Ticket sent to Citizen Sign-Off Gate.`);
    setTimeout(() => setNotice(""), 6000);
  }

  return (
    <div className={`admin-page ${darkMode ? "dark-mode" : ""}`}>
      <AnimatedBackground />

      {/* ADMIN TOPBAR */}
      <header className="admin-navbar">
        <div className="admin-container nav-inner">
          <div className="admin-brand-group">
            <Link to="/" className="admin-brand">
              <span className="brand-badge-admin">MUNICIPAL COMMAND</span>
              <div className="brand-title">
                <h2>JanDrishti Ops</h2>
                <span>Delhi Municipal Authority Console</span>
              </div>
            </Link>
          </div>

          <div className="admin-nav-tools">
            <div className="admin-role-pill">
              <Building2 size={14} color="var(--jd-emerald)" />
              <span>Zone: Delhi NCT Central &bull; Executive Engineer</span>
            </div>

            <Link to="/dashboard" className="btn-citizen-switch" title="Open Citizen Portal">
              <Layers size={14} />
              <span>Citizen Console</span>
            </Link>

            <button
              type="button"
              className="theme-button"
              onClick={toggleTheme}
              aria-label="Toggle theme"
            >
              {darkMode ? <Sun size={16} /> : <Moon size={16} />}
            </button>

            <button
              type="button"
              className="btn-admin-logout"
              onClick={handleLogout}
              title="Sign out"
            >
              <LogOut size={14} />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </header>

      <main className="admin-container" style={{ padding: "28px 0 60px" }}>
        {/* EXECUTIVE HUD BANNER */}
        <section className="admin-hud-header">
          <div className="hud-title-col">
            <div className="hud-tag">
              <Activity size={13} color="var(--jd-emerald)" />
              <span>MUNICIPAL SERVICE LEVEL AGREEMENT (SLA) DISPATCH DESK</span>
            </div>
            <h1>Municipal Operations Portal 🏛️</h1>
            <p>
              Receive citizen hazard reports, route teams to Delhi wards, and upload repair proof for citizen sign-off.
            </p>
          </div>

          <div className="hud-metric-row">
            <div className="hud-metric-box">
              <span className="metric-num text-amber">{metrics.pendingReview}</span>
              <span className="metric-lbl">Awaiting Dispatch</span>
            </div>
            <div className="hud-metric-box">
              <span className="metric-num text-blue">{metrics.activeDispatched}</span>
              <span className="metric-lbl">Crew Dispatched</span>
            </div>
            <div className="hud-metric-box">
              <span className="metric-num text-purple">{metrics.awaitingCitizen}</span>
              <span className="metric-lbl">Citizen Sign-Off Gate</span>
            </div>
            <div className="hud-metric-box">
              <span className="metric-num text-emerald">{metrics.verifiedClosed}</span>
              <span className="metric-lbl">Verified Closed</span>
            </div>
          </div>
        </section>

        {notice && (
          <div className="admin-notice-bar">
            <CheckCircle2 size={16} />
            <span>{notice}</span>
          </div>
        )}

        {/* WORKSPACE DUAL-PANE */}
        <div className="admin-workspace-grid">
          {/* Left Column: Triage & Issue Stream */}
          <section className="admin-triage-panel">
            <div className="triage-toolbar">
              <div className="triage-search">
                <Search size={15} />
                <input
                  type="text"
                  placeholder="Search by ID (#JD-2026-..), ward, or title..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              <div className="triage-filter-pills">
                <button
                  type="button"
                  className={`triage-pill ${activeTab === "all" ? "active" : ""}`}
                  onClick={() => setActiveTab("all")}
                >
                  All ({metrics.total})
                </button>
                <button
                  type="button"
                  className={`triage-pill amber ${activeTab === "review" ? "active" : ""}`}
                  onClick={() => setActiveTab("review")}
                >
                  New ({metrics.pendingReview})
                </button>
                <button
                  type="button"
                  className={`triage-pill blue ${activeTab === "progress" ? "active" : ""}`}
                  onClick={() => setActiveTab("progress")}
                >
                  Dispatched ({metrics.activeDispatched})
                </button>
                <button
                  type="button"
                  className={`triage-pill purple ${activeTab === "verification" ? "active" : ""}`}
                  onClick={() => setActiveTab("verification")}
                >
                  Sign-off Gate ({metrics.awaitingCitizen})
                </button>
                <button
                  type="button"
                  className={`triage-pill green ${activeTab === "resolved" ? "active" : ""}`}
                  onClick={() => setActiveTab("resolved")}
                >
                  Closed ({metrics.verifiedClosed})
                </button>
              </div>
            </div>

            {/* List of Triage Cards */}
            <div className="admin-ticket-list">
              {filteredIssues.length === 0 ? (
                <div className="triage-empty">
                  <AlertTriangle size={32} color="var(--jd-text-subtle)" />
                  <p>No matching municipal issues under current filter.</p>
                </div>
              ) : (
                filteredIssues.map((issue) => {
                  const isSelected = selectedIssue?.id === issue.id;

                  return (
                    <div
                      key={issue.id}
                      className={`admin-ticket-card ${isSelected ? "selected" : ""} status-${issue.status}`}
                      onClick={() => setSelectedIssue(issue)}
                    >
                      <div className="ticket-top">
                        <div className="ticket-id-grp">
                          <span className="ticket-id">{issue.id}</span>
                          <span className="ticket-category">{issue.category}</span>
                        </div>
                        <span className={`ticket-badge ${issue.status}`}>
                          {issue.status === "review" && "⏳ Unassigned"}
                          {issue.status === "progress" && "🛠️ In Field"}
                          {issue.status === "verification" && "⚡ Sign-off Pending"}
                          {issue.status === "resolved" && "✅ Citizen Closed"}
                        </span>
                      </div>

                      <h4 className="ticket-title">{issue.title}</h4>

                      <div className="ticket-meta">
                        <span>
                          <MapPin size={12} /> {issue.ward}
                        </span>
                        <span className={`priority-tag ${issue.priority.toLowerCase()}`}>
                          {issue.priority} Priority
                        </span>
                      </div>

                      <div className="ticket-bottom">
                        <span className="officer-line">
                          Officer: <strong>{issue.assignedOfficer || "Pending Assignment"}</strong>
                        </span>
                        <span className="upvote-count">👍 {issue.upvotes || 0}</span>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </section>

          {/* Right Column: Detailed Dispatch & Evidence Console */}
          {selectedIssue ? (
            <section className="admin-detail-panel">
              <div className="detail-header-card">
                <div className="header-status-line">
                  <span className="detail-id">{selectedIssue.id}</span>
                  <span className={`ticket-badge large ${selectedIssue.status}`}>
                    {selectedIssue.status.toUpperCase()}
                  </span>
                </div>

                <h2 className="detail-heading">{selectedIssue.title}</h2>

                <div className="detail-tags-bar">
                  <span className="tag-pill">
                    <MapPin size={13} /> {selectedIssue.ward}
                  </span>
                  <span className="tag-pill">
                    📁 {selectedIssue.category}
                  </span>
                  <span className="tag-pill">
                    📍 {selectedIssue.latitude?.toFixed(4)}° N, {selectedIssue.longitude?.toFixed(4)}° E
                  </span>
                  <span className="tag-pill">
                    ⏱️ Target SLA: {selectedIssue.slaHours || 24} Hours
                  </span>
                </div>
              </div>

              {/* ACTION COMMAND CENTER */}
              <div className="admin-action-deck">
                <h3>Municipal Action Operations</h3>
                <div className="action-button-row">
                  {selectedIssue.status === "review" && (
                    <button
                      type="button"
                      className="btn-admin-action dispatch"
                      onClick={() => setAssignModalOpen(true)}
                    >
                      <UserCheck size={16} />
                      <span>Dispatch Field Officer</span>
                    </button>
                  )}

                  {selectedIssue.status === "progress" && (
                    <>
                      <button
                        type="button"
                        className="btn-admin-action reassign"
                        onClick={() => setAssignModalOpen(true)}
                      >
                        <UserCheck size={16} />
                        <span>Reassign Officer</span>
                      </button>
                      <button
                        type="button"
                        className="btn-admin-action upload"
                        onClick={() => setRepairModalOpen(true)}
                      >
                        <Camera size={16} />
                        <span>Upload Repair Proof &amp; Send to Citizen</span>
                      </button>
                    </>
                  )}

                  {selectedIssue.status === "verification" && (
                    <div className="action-gate-callout">
                      <ShieldCheck size={20} color="var(--jd-purple)" />
                      <div>
                        <strong>Ticket Locked at Citizen Verification Gate</strong>
                        <p>
                          Repair proof has been submitted. Under JanDrishti zero-false-closure rules,
                          officials cannot close this ticket. Only reporting citizen can verify.
                        </p>
                      </div>
                    </div>
                  )}

                  {selectedIssue.status === "resolved" && (
                    <div className="action-resolved-callout">
                      <CheckCircle2 size={20} color="var(--jd-emerald)" />
                      <div>
                        <strong>Officially Citizen-Verified &amp; Closed</strong>
                        <p>Citizen inspection confirmed complete repair. Audit receipt logged.</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* PHOTOGRAPHIC EVIDENCE AUDIT SECTION */}
              <div className="admin-evidence-audit">
                <h3>Photographic Chain of Custody</h3>
                <div className="evidence-grid-duo">
                  <div className="evidence-box">
                    <span className="evidence-label before">Citizen Report Photo (Before)</span>
                    {selectedIssue.evidenceBefore ? (
                      <div className="evidence-image-wrap">
                        <img src={selectedIssue.evidenceBefore} alt="Hazard Before" />
                        <span className="evidence-geotag">
                          GPS: {selectedIssue.latitude?.toFixed(4)}° N, {selectedIssue.longitude?.toFixed(4)}° E
                        </span>
                      </div>
                    ) : (
                      <div className="evidence-placeholder">No citizen photo attached</div>
                    )}
                  </div>

                  <div className="evidence-box">
                    <span className="evidence-label after">Municipal Completion Proof (After)</span>
                    {selectedIssue.evidenceAfter ? (
                      <div className="evidence-image-wrap">
                        <img src={selectedIssue.evidenceAfter} alt="Repair After" />
                        {selectedIssue.resolutionProof && (
                          <span className="evidence-seal-badge">
                            {selectedIssue.resolutionProof.sealNumber}
                          </span>
                        )}
                      </div>
                    ) : (
                      <div className="evidence-placeholder">
                        {selectedIssue.status === "progress"
                          ? "Repairs currently underway in field."
                          : "Awaiting field officer photo upload."}
                      </div>
                    )}
                  </div>
                </div>

                {selectedIssue.resolutionProof && (
                  <div className="proof-seal-box">
                    <strong>Official Seal: {selectedIssue.resolutionProof.sealNumber}</strong>
                    <p>Contractor: {selectedIssue.resolutionProof.contractor}</p>
                    <p>Inspection Notes: {selectedIssue.resolutionProof.notes}</p>
                  </div>
                )}
              </div>

              {/* TAMPER-EVIDENT AUDIT TRAIL */}
              <div className="admin-timeline-audit">
                <h3>Tamper-evident Timeline Log</h3>
                <div className="admin-timeline-steps">
                  {(selectedIssue.timeline || []).map((step, idx) => (
                    <div key={idx} className="timeline-node">
                      <div className="node-marker" />
                      <div className="node-content">
                        <div className="node-head">
                          <strong>{step.step}</strong>
                          <span>{step.time}</span>
                        </div>
                        <p>{step.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          ) : (
            <div className="admin-no-selection">
              <Building2 size={40} color="var(--jd-text-subtle)" />
              <p>Select any ticket on the left to inspect and dispatch.</p>
            </div>
          )}
        </div>
      </main>

      {/* DISPATCH OFFICER MODAL */}
      {assignModalOpen && selectedIssue && (
        <div className="modal-overlay" onClick={() => setAssignModalOpen(false)}>
          <div className="modal-dialog" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Dispatch Field Unit &bull; {selectedIssue.id}</h2>
              <p>Assign this complaint to the jurisdictional ward engineer in Delhi.</p>
            </div>

            <form onSubmit={handleDispatchOfficer} className="modal-form-grid">
              <div className="modal-field">
                <label>Select Ward Division Officer *</label>
                <select
                  value={selectedOfficer}
                  onChange={(e) => setSelectedOfficer(e.target.value)}
                >
                  {DELHI_OFFICERS.map((officer, i) => (
                    <option key={i} value={officer.name}>
                      {officer.name} — {officer.dept}
                    </option>
                  ))}
                </select>
              </div>

              <div className="modal-field">
                <label>Target SLA Commitment</label>
                <input
                  type="text"
                  value={`${selectedIssue.slaHours || 24} Hours Maximum Resolution Window`}
                  disabled
                />
              </div>

              <div className="modal-actions">
                <button
                  type="button"
                  className="btn-modal-cancel"
                  onClick={() => setAssignModalOpen(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn-modal-submit">
                  <Send size={15} />
                  <span>Confirm Dispatch</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* SUBMIT REPAIR PROOF MODAL */}
      {repairModalOpen && selectedIssue && (
        <div className="modal-overlay" onClick={() => setRepairModalOpen(false)}>
          <div className="modal-dialog" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Upload Repair Proof &bull; {selectedIssue.id}</h2>
              <p>Submit photographic evidence for citizen physical verification.</p>
            </div>

            <form onSubmit={handleSubmitProof} className="modal-form-grid">
              <div className="modal-field">
                <label>Contractor / Field Unit Name *</label>
                <input
                  type="text"
                  placeholder="e.g. Delhi PWD Asphalt Maintenance Squad #4"
                  value={repairContractor}
                  onChange={(e) => setRepairContractor(e.target.value)}
                  required
                />
              </div>

              <div className="modal-field">
                <label>Official Inspection Seal Number *</label>
                <input
                  type="text"
                  placeholder="e.g. SEAL #NDMC-DJB-4821 or SEAL #PWD-8910"
                  value={repairSeal}
                  onChange={(e) => setRepairSeal(e.target.value)}
                  required
                />
              </div>

              <div className="modal-field">
                <label>After Photo URL (Repair Evidence) *</label>
                <input
                  type="url"
                  placeholder="https://images.unsplash.com/... or paste image URL"
                  value={repairPhotoUrl}
                  onChange={(e) => setRepairPhotoUrl(e.target.value)}
                  required
                />
              </div>

              <div className="modal-field">
                <label>Engineering Work Notes *</label>
                <textarea
                  rows={3}
                  placeholder="Detail repairs made (e.g., crack sealed, hot-mix compacted to grade level, tested pressure 4.5 bar)..."
                  value={repairNotes}
                  onChange={(e) => setRepairNotes(e.target.value)}
                  required
                />
              </div>

              <div className="modal-actions">
                <button
                  type="button"
                  className="btn-modal-cancel"
                  onClick={() => setRepairModalOpen(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn-modal-submit">
                  <Camera size={15} />
                  <span>Submit for Citizen Verification</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* FOOTER */}
      <footer className="admin-footer">
        <div className="admin-container footer-inner">
          <div>
            <strong>JanDrishti Municipal Operations Center</strong> &middot; Delhi NCT
          </div>
          <div>
            <span>Zero-False-Closure Architecture &middot; UN SDG 11</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

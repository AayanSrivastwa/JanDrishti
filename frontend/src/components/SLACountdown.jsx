import { useState, useEffect } from "react";
import { Clock, AlertTriangle, CheckCircle2 } from "lucide-react";
import { computeSLAStatus, formatSLAHours } from "../Services/issueService";

export default function SLACountdown({ issue }) {
  const [, setTick] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setTick((t) => t + 1);
    }, 60000); // update every minute
    return () => clearInterval(timer);
  }, []);

  const sla = computeSLAStatus(issue);

  const { status, hoursRemaining, isOverdue, pctElapsed } = sla;

  const statusConfig = {
    on_track: { label: "On Track", color: "var(--jd-emerald)", icon: <CheckCircle2 size={16} /> },
    warning: { label: "At Risk", color: "var(--jd-amber)", icon: <Clock size={16} /> },
    at_risk: { label: "Critical", color: "var(--jd-amber)", icon: <AlertTriangle size={16} /> },
    overdue: { label: "OVERDUE", color: "var(--jd-red)", icon: <AlertTriangle size={16} /> },
    unknown: { label: "—", color: "var(--jd-muted)", icon: <Clock size={16} /> },
  };

  const config = statusConfig[status];

  if (status === "unknown") {
    return null;
  }

  return (
    <div className={`sla-countdown sla-${status}`}>
      <div className="sla-header">
        {config.icon}
        <span className="sla-label" style={{ color: config.color }}>{config.label}</span>
      </div>
      <div className="sla-timer">
        <span className="sla-hours">{isOverdue ? "0h 0m" : formatSLAHours(hoursRemaining)}</span>
        <span className="sla-unit">
          {isOverdue ? "Overdue by" : "Remaining"} SLA
        </span>
      </div>
      <div className="sla-progress">
        <div className="sla-progress-track">
          <div
            className="sla-progress-bar"
            style={{ width: `${pctElapsed}%`, backgroundColor: config.color }}
          />
        </div>
        <span className="sla-pct">{Math.round(pctElapsed)}% of SLA elapsed</span>
      </div>
      {isOverdue && (
        <div className="sla-overdue-alert">
          <AlertTriangle size={14} fill="var(--jd-red)" />
          <span style={{ color: "var(--jd-red)" }}>
            SLA deadline has passed — escalate to senior engineer
          </span>
        </div>
      )}
    </div>
  );
}
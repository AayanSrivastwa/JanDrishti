import { useMemo } from "react";
import { AlertTriangle, Link, MapPin } from "lucide-react";
import { findPotentialDuplicates } from "../Services/issueService";

export default function DuplicateWarning({
  category,
  latitude,
  longitude,
  title,
  description,
  ward,
  onLinkToExisting,
}) {
  const dupResult = useMemo(() => {
    if (!latitude || !longitude) return null;
    return findPotentialDuplicates({
      category,
      latitude,
      longitude,
      title,
      description,
      ward,
      radiusKm: 1,
    });
  }, [category, latitude, longitude, title, description, ward]);

  if (!dupResult) return null;

  return (
    <div className={`duplicate-warning ${dupResult.hasDuplicates ? "active" : ""}`}>
      <div className="dup-header">
        <AlertTriangle size={16} fill={dupResult.hasDuplicates ? "var(--jd-amber)" : "var(--jd-emerald)"} />
        <span style={{ color: dupResult.hasDuplicates ? "var(--jd-amber)" : "var(--jd-emerald)", fontWeight: 600 }}>
          {dupResult.message}
        </span>
      </div>

      {dupResult.hasDuplicates && (
        <div className="dup-list">
          {dupResult.duplicates.map((dup) => (
            <div key={dup.issue.id} className="dup-item">
              <div className="dup-info">
                <div className="dup-title">#{dup.issue.id}</div>
                <div className="dup-details">
                  <MapPin size={12} />
                  <span>{dup.issue.title}</span>
                </div>
                <div className="dup-meta">
                  <span>{dup.issue.category}</span>
                  <span>•</span>
                  <span>{dup.distanceKm} km away</span>
                  <span>•</span>
                  <span>{dup.issue.ward}</span>
                  <span>•</span>
                  <span>Match: {dup.score}%</span>
                </div>
                <div className="dup-reasons">
                  {dup.reasons.map((r, i) => (
                    <span key={i} className="dup-reason">{r}</span>
                  ))}
                </div>
              </div>
              <button
                type="button"
                className="btn-link-duplicate"
                onClick={() => onLinkToExisting?.(dup.issue)}
              >
                <Link size={14} />
                Link to Existing
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
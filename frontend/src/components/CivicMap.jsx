import { useState, useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { MapContainer, TileLayer, Marker, Popup, useMap, useMapEvents } from "react-leaflet";
import {
  Clock,
  ShieldCheck,
  AlertTriangle,
  CheckCircle2,
  Navigation,
  ThumbsUp,
  MapPin,
  Maximize2,
  Minimize2,
  Crosshair,
  Layers,
} from "lucide-react";

// Fix default marker icon issues in Leaflet with Vite
delete L.Icon.Default.prototype._getIconUrl;

// Category Emoji Map for visual delight
const CATEGORY_ICONS = {
  "Roads & Potholes": "🕳️",
  "Water Supply": "🚰",
  "Streetlighting": "💡",
  "Waste Management": "🗑️",
  "Drainage & Sewage": "🌊",
  "Parks & Green Spaces": "🌳",
  user: "📍",
};

// Custom animated marker generator
function createCivicMarkerIcon(status, category, isSelected = false) {
  const colors = {
    resolved: { bg: "#10b981", border: "#059669", ring: "rgba(16, 185, 129, 0.4)" },
    progress: { bg: "#f59e0b", border: "#d97706", ring: "rgba(245, 158, 11, 0.4)" },
    review: { bg: "#ef4444", border: "#dc2626", ring: "rgba(239, 68, 68, 0.4)" },
    verification: { bg: "#8b5cf6", border: "#7c3aed", ring: "rgba(139, 92, 246, 0.45)" },
    user: { bg: "#2563eb", border: "#1d4ed8", ring: "rgba(37, 99, 235, 0.4)" },
  };

  const theme = colors[status] || colors.review;
  const size = isSelected ? 44 : 36;
  const anchor = size / 2;
  const emoji = CATEGORY_ICONS[category] || "📍";

  const html = `
    <div class="civic-map-marker ${status} ${isSelected ? "selected-pulse" : ""}" 
         style="
           width: ${size}px; 
           height: ${size}px; 
           background: ${theme.bg}; 
           border: 3px solid #ffffff; 
           border-radius: 50%; 
           display: flex; 
           align-items: center; 
           justify-content: center; 
           color: #ffffff; 
           font-size: ${isSelected ? "18px" : "15px"}; 
           box-shadow: 0 6px 18px rgba(0,0,0,0.35); 
           position: relative;
           cursor: pointer;
           transition: transform 0.25s cubic-bezier(0.175, 0.885, 0.32, 1.275);
         ">
      <div class="marker-pulse-ring" style="border-color: ${theme.ring};"></div>
      <span style="line-height: 1; filter: drop-shadow(0 1px 2px rgba(0,0,0,0.3));">${emoji}</span>
    </div>
  `;

  return L.divIcon({
    className: "civic-div-icon",
    html,
    iconSize: [size, size],
    iconAnchor: [anchor, anchor],
    popupAnchor: [0, -anchor - 6],
  });
}

// Map center & zoom animation controller with ResizeObserver & size invalidation
function MapController({ center, zoom, viewMode, isFullscreen }) {
  const map = useMap();
  const prevCenterRef = useRef(null);

  useEffect(() => {
    // Invalidate size immediately and on subsequent frames to catch CSS transitions
    map.invalidateSize();
    const t1 = setTimeout(() => map.invalidateSize(), 60);
    const t2 = setTimeout(() => map.invalidateSize(), 200);
    const t3 = setTimeout(() => map.invalidateSize(), 500);

    const container = map.getContainer();
    if (!container) return;

    let resizeObserver = null;
    if (typeof ResizeObserver !== "undefined") {
      resizeObserver = new ResizeObserver(() => {
        map.invalidateSize();
      });
      resizeObserver.observe(container);
    }

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      if (resizeObserver) resizeObserver.disconnect();
    };
  }, [map, viewMode, isFullscreen]);

  useEffect(() => {
    if (center) {
      const changed =
        !prevCenterRef.current ||
        prevCenterRef.current[0] !== center[0] ||
        prevCenterRef.current[1] !== center[1] ||
        prevCenterRef.current[2] !== (zoom || 13);
      if (changed) {
        prevCenterRef.current = [center[0], center[1], zoom || 13];
        map.flyTo(center, zoom || 13, {
          duration: 1.0,
          easeLinearity: 0.25,
        });
      }
    }
  }, [center, zoom, map]);

  return null;
}

// Map Controls & Floating Toolbar
function MapToolbar({ issues, userLocation, onLocateMe, isFullscreen, onToggleFullscreen }) {
  const map = useMap();
  const barRef = useRef(null);

  useEffect(() => {
    if (barRef.current) {
      L.DomEvent.disableClickPropagation(barRef.current);
      L.DomEvent.disableScrollPropagation(barRef.current);
    }
  }, []);

  const handleFitAll = () => {
    if (issues && issues.length > 0) {
      const bounds = L.latLngBounds(issues.map((i) => [i.latitude, i.longitude]));
      if (userLocation) bounds.extend(userLocation);
      map.fitBounds(bounds, { padding: [45, 45], maxZoom: 14 });
    } else {
      map.flyTo([28.6139, 77.2090], 12);
    }
  };

  const handleCenterDelhi = () => {
    map.flyTo([28.6139, 77.2090], 12, { duration: 0.8 });
  };

  return (
    <div className="map-floating-bar" ref={barRef}>
      <div className="map-controls-group">
        <button
          type="button"
          className="map-control-btn"
          onMouseDown={(e) => e.stopPropagation()}
          onClick={onLocateMe}
          title="Center on my GPS coordinates"
        >
          <Navigation size={13} />
          <span>My GPS</span>
        </button>

        <button
          type="button"
          className="map-control-btn"
          onMouseDown={(e) => e.stopPropagation()}
          onClick={handleFitAll}
          title="Zoom to fit all active civic reports"
        >
          <Layers size={13} />
          <span>Fit All Wards ({issues.length})</span>
        </button>

        <button
          type="button"
          className="map-control-btn"
          onMouseDown={(e) => e.stopPropagation()}
          onClick={handleCenterDelhi}
          title="Reset map to central Delhi"
        >
          <Crosshair size={13} />
          <span>Center Delhi</span>
        </button>

        <button
          type="button"
          className="map-control-btn btn-fullscreen-toggle"
          onMouseDown={(e) => e.stopPropagation()}
          onClick={onToggleFullscreen}
          title={isFullscreen ? "Exit Fullscreen" : "Fill Complete Screen"}
        >
          {isFullscreen ? <Minimize2 size={13} /> : <Maximize2 size={13} />}
          <span>{isFullscreen ? "Exit Full" : "Fill Screen"}</span>
        </button>
      </div>

      <div className="map-legend-pills">
        <span className="legend-chip review">
          <span className="chip-dot red" /> Under Review
        </span>
        <span className="legend-chip progress">
          <span className="chip-dot amber" /> In Progress
        </span>
        <span className="legend-chip verification">
          <span className="chip-dot purple" /> Needs Verification
        </span>
        <span className="legend-chip resolved">
          <span className="chip-dot green" /> Verified
        </span>
      </div>
    </div>
  );
}

// Click listener to pick GPS coordinates
function MapClickPicker({ onMapClick }) {
  useMapEvents({
    click(e) {
      if (onMapClick) {
        onMapClick(e.latlng);
      }
    },
  });
  return null;
}

export default function CivicMap({
  issues = [],
  selectedIssue = null,
  onSelectIssue,
  onVerifyIssue,
  onUpvoteIssue,
  onMapClick,
  darkMode = false,
  userLocation = null,
  onLocateMe,
  center = [28.6139, 77.2090], // Delhi Center (Connaught Place)
  zoom = 12,
  viewMode = "split",
}) {
  const [isFullscreen, setIsFullscreen] = useState(false);

  const mapCenter = selectedIssue
    ? [selectedIssue.latitude, selectedIssue.longitude]
    : userLocation || center;

  // OpenStreetMap for Light, CartoDB Dark Matter for Dark
  const tileUrl = darkMode
    ? "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png"
    : "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";

  const tileAttribution = darkMode
    ? '&copy; <a href="https://carto.com/">CARTO</a> &copy; OpenStreetMap'
    : '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';

  return (
    <div
      className={`civic-map-wrapper ${darkMode ? "dark-tiles" : ""} ${
        isFullscreen ? "fullscreen-mode" : ""
      }`}
    >
      <MapContainer
        center={mapCenter}
        zoom={zoom}
        scrollWheelZoom={true}
        style={{ width: "100%", height: "100%", borderRadius: "inherit" }}
      >
        <MapToolbar
          issues={issues}
          userLocation={userLocation}
          onLocateMe={onLocateMe}
          isFullscreen={isFullscreen}
          onToggleFullscreen={() => setIsFullscreen(!isFullscreen)}
        />

        <MapController
          center={mapCenter}
          zoom={selectedIssue ? 14 : zoom}
          viewMode={viewMode}
          isFullscreen={isFullscreen}
        />

        <MapClickPicker onMapClick={onMapClick} />

        <TileLayer
          key={darkMode ? "dark" : "light"}
          attribution={tileAttribution}
          url={tileUrl}
          subdomains={darkMode ? "abcd" : "abc"}
          maxZoom={19}
        />

        {/* User live location marker */}
        {userLocation && (
          <Marker
            position={userLocation}
            icon={createCivicMarkerIcon("user", "user", true)}
          >
            <Popup>
              <div className="civic-popup-content user-popup">
                <strong>📍 You are here</strong>
                <p>Showing civic infrastructure reports in your immediate vicinity in Delhi NCR.</p>
              </div>
            </Popup>
          </Marker>
        )}

        {/* Civic Issue Markers */}
        {issues.map((issue) => {
          const isSelected = selectedIssue?.id === issue.id;
          const markerIcon = createCivicMarkerIcon(
            issue.status,
            issue.category,
            isSelected
          );

          return (
            <Marker
              key={issue.id}
              position={[issue.latitude, issue.longitude]}
              icon={markerIcon}
              eventHandlers={{
                click: () => onSelectIssue && onSelectIssue(issue),
              }}
            >
              <Popup>
                <div className="civic-popup-content">
                  <div className="popup-header-row">
                    <span className={`popup-badge ${issue.status}`}>
                      {issue.status === "resolved" && "✅ Verified Resolved"}
                      {issue.status === "verification" && "⚡ Needs Verification"}
                      {issue.status === "progress" && "🛠️ In Progress"}
                      {issue.status === "review" && "⏳ Under Review"}
                    </span>
                    <span className="popup-time">
                      <Clock size={11} /> {issue.id}
                    </span>
                  </div>

                  <h4 className="popup-title">{issue.title}</h4>
                  <p className="popup-desc">{issue.description}</p>

                  <div className="popup-meta">
                    <span className="popup-ward">
                      <MapPin size={12} /> {issue.ward}
                    </span>
                    <span className="popup-category">
                      📁 {issue.category} • Priority: <strong>{issue.priority || "Normal"}</strong>
                    </span>
                  </div>

                  {/* Upvote & Action Bar */}
                  <div className="popup-footer-row">
                    {onUpvoteIssue && (
                      <button
                        type="button"
                        className="popup-btn-upvote"
                        onMouseDown={(e) => e.stopPropagation()}
                        onClick={(e) => {
                          e.stopPropagation();
                          onUpvoteIssue(issue.id);
                        }}
                      >
                        <ThumbsUp size={12} />
                        <span>Upvote ({issue.upvotes || 0})</span>
                      </button>
                    )}

                    <span className="popup-officer">
                      {issue.assignedOfficer || "Ward Division"}
                    </span>
                  </div>

                  {issue.status === "verification" && onVerifyIssue && (
                    <div className="popup-actions">
                      <button
                        type="button"
                        className="popup-btn-verify"
                        onMouseDown={(e) => e.stopPropagation()}
                        onClick={(e) => {
                          e.stopPropagation();
                          onVerifyIssue(issue.id, "resolved");
                        }}
                      >
                        <ShieldCheck size={14} /> Confirm Fixed
                      </button>
                      <button
                        type="button"
                        className="popup-btn-dispute"
                        onMouseDown={(e) => e.stopPropagation()}
                        onClick={(e) => {
                          e.stopPropagation();
                          onVerifyIssue(issue.id, "progress");
                        }}
                      >
                        <AlertTriangle size={14} /> Dispute
                      </button>
                    </div>
                  )}

                  {issue.status === "resolved" && (
                    <div className="popup-verified-tag">
                      <CheckCircle2 size={13} /> Citizen Verified & Closed
                    </div>
                  )}
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
}

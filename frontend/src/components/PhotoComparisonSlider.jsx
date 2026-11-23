import { useState, useRef, useEffect } from "react";
import { Image, ImageOff } from "lucide-react";

export default function PhotoComparisonSlider({ beforeImage, afterImage, showLabels = true }) {
  const [dragX, setDragX] = useState(50);
  const containerRef = useRef(null);
  const isDragging = useRef(false);

  const handleStart = () => {
    isDragging.current = true;
  };

  useEffect(() => {
    const onMove = (e) => {
      if (!isDragging.current || !containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      let x = ((clientX - rect.left) / rect.width) * 100;
      x = Math.max(0, Math.min(100, x));
      setDragX(x);
    };

    const onUp = () => {
      isDragging.current = false;
    };

    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
    window.addEventListener("touchmove", onMove, { passive: true });
    window.addEventListener("touchend", onUp);

    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
      window.removeEventListener("touchmove", onMove);
      window.removeEventListener("touchend", onUp);
    };
  }, []);

  const hasBefore = !!beforeImage;
  const hasAfter = !!afterImage;

  if (!hasBefore && !hasAfter) return null;

  // If only one image, show it full width
  if (!hasBefore || !hasAfter) {
    return (
      <div className="photo-single">
        <img
          src={hasBefore ? beforeImage : afterImage}
          alt={hasBefore ? "Before repair" : "After repair"}
          className="photo-single-img"
        />
        {showLabels && (
          <div className="photo-single-label">
            {hasBefore ? <ImageOff size={16} /> : <Image size={16} />}
            <span>{hasBefore ? "Citizen Report (Before)" : "Repair Proof (After)"}</span>
          </div>
        )}
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="photo-comparison-container"
      onMouseDown={handleStart}
      onTouchStart={handleStart}
    >
      {/* Before image (full) */}
      <div className="photo-before">
        <img src={beforeImage} alt="Before repair" className="photo-img" />
        {showLabels && <div className="photo-label before-label">Citizen Report <span>Before</span></div>}
      </div>

      {/* After image (clipped) */}
      <div className="photo-after">
        <img src={afterImage} alt="After repair" className="photo-img" />
        <div className="photo-after-clip" style={{ width: `${dragX}%` }}>
          <img src={afterImage} alt="After repair" className="photo-img" />
        </div>
        {showLabels && (
          <div className="photo-label after-label">
            <span>Repair</span> <span>After</span>
          </div>
        )}
      </div>

      {/* Divider handle */}
      <div
        className="photo-divider"
        style={{ left: `${dragX}%` }}
        onMouseDown={handleStart}
        onTouchStart={handleStart}
      >
        <div className="photo-handle"></div>
        <div className="photo-arrows">
          <span>←</span>
          <span>→</span>
        </div>
      </div>
    </div>
  );
}
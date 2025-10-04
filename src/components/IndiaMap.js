"use client";
import { useState, useEffect } from "react";
import vaccinationData from "../data/vaccinationData";
import StateDetailsChart from "./StateDetailsChart";

export default function IndiaMap({ highlighted, setHighlighted }) {
  const [svgContent, setSvgContent] = useState("");
  const [tooltip, setTooltip] = useState({ visible: false, x: 0, y: 0, stateId: null });

  useEffect(() => {
    fetch("/india.svg")
      .then((res) => res.text())
      .then((svg) => setSvgContent(svg));
  }, []);

  if (!svgContent) return <div>Loading map...</div>;

  // Color scale
  const values = Object.values(vaccinationData).map((d) => d.overall);
  const min = Math.min(...values);
  const max = Math.max(...values);
  const getColor = (value) => {
    const ratio = (value - min) / (max - min);
    if (ratio > 0.66) return "#15803d";
    if (ratio > 0.33) return "#facc15";
    return "#dc2626";
  };

  const handleMouseMove = (e) => {
    if (e.target.id && vaccinationData[e.target.id]) {
      setHighlighted(e.target.id);
      const rect = e.currentTarget.getBoundingClientRect(); // map container
      setTooltip({
        visible: true,
        x: e.clientX - rect.left, // relative to container
        y: e.clientY - rect.top,
        stateId: e.target.id
      });
    }
  };

  const handleMouseLeave = () => {
    setHighlighted(null);
    setTooltip({ visible: false, x: 0, y: 0, stateId: null });
  };

  // Update SVG paths with fill and stroke
  let updatedSvg = svgContent;
  Object.entries(vaccinationData).forEach(([id, d]) => {
    const stroke = highlighted === id ? "#000" : "#fff";
    const fill = getColor(d.overall);
    updatedSvg = updatedSvg.replace(
      new RegExp(`id="${id}"`, "g"),
      `id="${id}" fill="${fill}" stroke="${stroke}" stroke-width="1.2"`
    );
  });

  return (
    <div className="relative flex justify-center">
      <div
        className="w-full max-w-3xl"
        dangerouslySetInnerHTML={{
          __html: updatedSvg.replace(/<path /g, (m) =>
            `${m} onmouseover="this.style.opacity=0.8" onmouseout="this.style.opacity=1"`
          )
        }}
        onMouseMove={handleMouseMove}
        onMouseOut={handleMouseLeave}
      />

      {/* Floating Pie Chart Tooltip */}
      {tooltip.visible && (
        <div
          className="absolute bg-white shadow-lg rounded-lg p-3 w-64 z-50 pointer-events-none"
          style={{ top: tooltip.y - 100, left: tooltip.x + 20 }}
        >
          <StateDetailsChart highlighted={tooltip.stateId} compact />
        </div>
      )}
    </div>
  );
}

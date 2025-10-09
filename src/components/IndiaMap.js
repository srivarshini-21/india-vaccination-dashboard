"use client";
import { useState, useEffect, useRef } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import vaccinationData from "../data/vaccinationData";

export default function IndiaMap({ highlighted, setHighlighted }) {
  const [svgContent, setSvgContent] = useState("");
  const [selectedState, setSelectedState] = useState(null);
  const [tooltip, setTooltip] = useState({
    visible: false,
    x: 0,
    y: 0,
    stateId: null,
    stateName: "",
    data: null,
  });
  const [isMobile, setIsMobile] = useState(false);

  const mapRef = useRef(null);
  const tooltipRef = useRef(null);

  // Detect mobile
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Load SVG
  useEffect(() => {
    fetch("/india.svg")
      .then((res) => res.text())
      .then((svg) => setSvgContent(svg));
  }, []);

  // Click outside to close tooltip
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (mapRef.current && !mapRef.current.contains(event.target)) {
        setSelectedState(null);
        setHighlighted(null);
        setTooltip({
          visible: false,
          x: 0,
          y: 0,
          stateId: null,
          stateName: "",
          data: null,
        });
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [setHighlighted]);

  // Color scale
  const values = Object.values(vaccinationData).map((d) => d.overall);
  const min = Math.min(...values);
  const max = Math.max(...values);

  const getColor = (value) => {
    const ratio = (value - min) / (max - min);
    if (ratio > 0.7) return "#15803d";
    if (ratio > 0.4) return "#22c55e";
    if (ratio > 0.2) return "#facc15";
    return "#dc2626";
  };

  // Desktop hover tooltip
  const handleMouseMove = (e) => {
    if (isMobile || selectedState) return;

    const stateId = e.target.id;
    if (stateId && vaccinationData[stateId]) {
      const stateData = vaccinationData[stateId];
      setHighlighted(stateId);

      const rect = e.currentTarget.getBoundingClientRect();
      let x = e.clientX - rect.left + 10;
      let y = e.clientY - rect.top - 10;

      // Adjust for overflow
      if (tooltipRef.current) {
        const { offsetWidth: ttWidth, offsetHeight: ttHeight } = tooltipRef.current;
        if (x + ttWidth > window.innerWidth - 10) x = window.innerWidth - ttWidth - 10;
        if (y + ttHeight > window.innerHeight - 10) y = window.innerHeight - ttHeight - 10;
        if (x < 10) x = 10;
        if (y < 10) y = 10;
      }

      setTooltip({
        visible: true,
        x,
        y,
        stateId,
        stateName: stateData.name,
        data: stateData,
      });
    }
  };

  const handleMouseLeave = () => {
    if (!selectedState) {
      setHighlighted(null);
      setTooltip({
        visible: false,
        x: 0,
        y: 0,
        stateId: null,
        stateName: "",
        data: null,
      });
    }
  };

  // Handle click (desktop & mobile)
  const handleStateClick = (stateId) => {
    const stateData = vaccinationData[stateId];
    if (selectedState === stateId) {
      // Close popup
      setSelectedState(null);
      setHighlighted(null);
      setTooltip({ visible: false, x: 0, y: 0, stateId: null, stateName: "", data: null });
    } else {
      setSelectedState(stateId);
      setHighlighted(stateId);

      if (isMobile) {
        // Centered popup for mobile
        setTooltip({
          visible: true,
          x: window.innerWidth / 2,
          y: window.innerHeight / 2,
          stateId,
          stateName: stateData.name,
          data: stateData,
        });
      } else {
        // Keep tooltip at current mouse position for desktop
        setTooltip((prev) => ({
          ...prev,
          stateId,
          stateName: stateData.name,
          data: stateData,
        }));
      }
    }
  };

  // Update SVG colors and strokes
  let updatedSvg = svgContent;
  Object.entries(vaccinationData).forEach(([id, d]) => {
    const isSelected = selectedState === id;
    const isHighlighted = highlighted === id;
    const fill = getColor(d.overall);
    let stroke = "#ffffff",
      strokeWidth = "1",
      filter = "none";

    if (isSelected) {
      stroke = "#1e40af";
      strokeWidth = "3";
      filter = "url(#glow)";
    } else if (isHighlighted && !selectedState) {
      stroke = "#1e40af";
      strokeWidth = "2";
      filter = "url(#glow)";
    }

    updatedSvg = updatedSvg.replace(
      new RegExp(`id="${id}"`, "g"),
      `id="${id}" fill="${fill}" stroke="${stroke}" stroke-width="${strokeWidth}" filter="${filter}" class="transition-all duration-200 cursor-pointer"`
    );
  });

  // Add glow filter if missing
  if (!updatedSvg.includes("filter=")) {
    updatedSvg = updatedSvg.replace(
      "</defs>",
      `<filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
        <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
        <feMerge><feMergeNode in="coloredBlur"/><feMergeNode in="SourceGraphic"/></feMerge>
      </filter></defs>`
    );
  }

  // Make SVG responsive
  if (updatedSvg.includes("<svg")) {
    updatedSvg = updatedSvg
      .replace(/\swidth="[^"]*"/, "")
      .replace(/\sheight="[^"]*"/, "")
      .replace(
        "<svg",
        `<svg class="w-full h-auto max-w-full" preserveAspectRatio="xMidYMid meet"`
      );
  }

  const PIE_COLORS = ["#22c55e", "#facc15", "#a855f7"];
  const StatePieChart = ({ data }) => {
    const pieData = [
      { name: "Fully", value: data.total },
      { name: "Partial", value: data.partial },
      { name: "Precaution", value: data.precaution },
    ];
    const total = pieData.reduce((sum, item) => sum + item.value, 0);

    return (
      <div className="w-full">
        <ResponsiveContainer width="100%" height={100}>
          <PieChart>
            <Pie
              data={pieData}
              cx="50%"
              cy="50%"
              innerRadius={20}
              outerRadius={40}
              paddingAngle={2}
              dataKey="value"
            >
              {pieData.map((entry, index) => (
                <Cell key={index} fill={PIE_COLORS[index]} stroke="#1e293b" strokeWidth={2} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
        <div className="text-center text-[10px] text-gray-400 mt-1">
          Total: {new Intl.NumberFormat().format(total)}
        </div>
      </div>
    );
  };

  return (
    <div ref={mapRef} className="relative w-full flex justify-center">
      {/* Responsive SVG */}
      <div
        className={`w-full ${isMobile ? "max-w-full aspect-[1.2/1]" : "max-w-3xl aspect-[1/1]"}`}
        dangerouslySetInnerHTML={{ __html: updatedSvg }}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        onClick={(e) => e.target.id && vaccinationData[e.target.id] && handleStateClick(e.target.id)}
      />

      {/* Desktop Hover Tooltip */}
      {!selectedState && tooltip.visible && tooltip.data && !isMobile && (
        <div
          ref={tooltipRef}
          className="absolute bg-slate-800/95 backdrop-blur-md shadow-2xl rounded-lg p-2 sm:p-4 w-72 z-50 border border-white/20 animate-fade-in pointer-events-none"
          style={{ top: tooltip.y, left: tooltip.x }}
        >
          <h3 className="font-bold text-white text-sm mb-1">{tooltip.stateName}</h3>
          <StatePieChart data={tooltip.data} />
          <div className="grid grid-cols-2 gap-2 mt-2 text-[10px] sm:text-xs text-gray-200">
            {[
              { label: "Total", value: tooltip.data.overall, color: "blue" },
              { label: "Fully", value: tooltip.data.total, color: "green" },
              { label: "Partial", value: tooltip.data.partial, color: "yellow" },
              { label: "Precaution", value: tooltip.data.precaution, color: "purple" },
            ].map(({ label, value, color }) => (
              <div key={label} className={`bg-${color}-500/20 p-2 rounded-lg border border-${color}-400/30`}>
                <div className={`text-${color}-300 font-semibold text-[10px] uppercase`}>{label}</div>
                <div className="text-white font-bold text-xs mt-1">{new Intl.NumberFormat().format(value)}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Selected State Card */}
      {selectedState && tooltip.data && tooltip.visible && (
        <div
          className="absolute bg-slate-800/95 backdrop-blur-md shadow-2xl rounded-lg p-3 sm:p-5 w-[90vw] sm:w-72 md:w-80 z-50 border border-white/20 animate-fade-in"
          style={{
            top: isMobile ? "50%" : "2rem",
            left: isMobile ? "50%" : "auto",
            transform: isMobile ? "translate(-50%, -50%)" : "none",
          }}
        >
          <div className="flex justify-between items-start mb-2">
            <h3 className="font-bold text-white text-sm sm:text-lg">{tooltip.stateName}</h3>
            <button
              onClick={() => {
                setSelectedState(null);
                setHighlighted(null);
                setTooltip({ visible: false, x: 0, y: 0, stateId: null, stateName: "", data: null });
              }}
              className="text-gray-400 hover:text-white text-lg"
            >
              ×
            </button>
          </div>
          <StatePieChart data={tooltip.data} />
          <div className="grid grid-cols-2 gap-2 sm:gap-3 text-[10px] sm:text-xs md:text-sm mt-2">
            {[
              { label: "Total", value: tooltip.data.overall, color: "blue" },
              { label: "Fully", value: tooltip.data.total, color: "green" },
              { label: "Partial", value: tooltip.data.partial, color: "yellow" },
              { label: "Precaution", value: tooltip.data.precaution, color: "purple" },
            ].map(({ label, value, color }) => (
              <div key={label} className={`bg-${color}-500/20 p-2 rounded-lg border border-${color}-400/30`}>
                <div className={`text-${color}-300 font-semibold text-[10px] sm:text-xs uppercase`}>{label}</div>
                <div className="text-white font-bold text-xs sm:text-base md:text-lg mt-1">
                  {new Intl.NumberFormat().format(value)}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

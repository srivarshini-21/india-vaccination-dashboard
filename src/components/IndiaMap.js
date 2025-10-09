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
  const [isMobilePopupOpen, setIsMobilePopupOpen] = useState(false);

  const mapRef = useRef(null);

  // Detect mobile for resizing layout (optional)
  const [isMobile, setIsMobile] = useState(false);
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

  // Close selection when clicking outside
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
        setIsMobilePopupOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [setHighlighted]);

  if (!svgContent)
    return (
      <div className="flex items-center justify-center h-48 sm:h-64 md:h-80 lg:h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 sm:h-10 sm:w-10 md:h-12 md:w-12 border-b-2 border-blue-600 mx-auto mb-2 sm:mb-4"></div>
          <p className="text-gray-300 text-xs sm:text-sm md:text-base">
            Loading map...
          </p>
        </div>
      </div>
    );

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
    if (e.target.id && vaccinationData[e.target.id] && !selectedState && window.innerWidth >= 768) {
      const stateData = vaccinationData[e.target.id];
      setHighlighted(e.target.id);
      const rect = e.currentTarget.getBoundingClientRect();
      setTooltip({
        visible: true,
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
        stateId: e.target.id,
        stateName: stateData.name,
        data: stateData,
      });
    }
  };

  const handleMouseLeave = () => {
    if (!selectedState && window.innerWidth >= 768) {
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
    if (window.innerWidth < 768) {
      setTooltip({
        visible: true,
        x: 0,
        y: 0,
        stateId,
        stateName: stateData.name,
        data: stateData,
      });
      setIsMobilePopupOpen(true);
    } else {
      if (selectedState === stateId) {
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
      } else {
        setSelectedState(stateId);
        setHighlighted(stateId);
        setTooltip({
          visible: true,
          x: 0,
          y: 0,
          stateId,
          stateName: stateData.name,
          data: stateData,
        });
      }
    }
  };

  // Update SVG colors and strokes
  let updatedSvg = svgContent;
  Object.entries(vaccinationData).forEach(([id, d]) => {
    const isSelected = selectedState === id;
    const isHighlighted = highlighted === id;
    const fill = getColor(d.overall);
    let stroke, strokeWidth, filter;

    if (isSelected) {
      stroke = "#1e40af";
      strokeWidth = "3";
      filter = "url(#glow)";
    } else if (isHighlighted && !selectedState) {
      stroke = "#1e40af";
      strokeWidth = "2";
      filter = "url(#glow)";
    } else {
      stroke = "#ffffff";
      strokeWidth = "1";
      filter = "none";
    }

    updatedSvg = updatedSvg.replace(
      new RegExp(`id="${id}"`, "g"),
      `id="${id}" fill="${fill}" stroke="${stroke}" stroke-width="${strokeWidth}" filter="${filter}" class="transition-all duration-200 cursor-pointer"`
    );
  });

  // Add glow filter
  if (!updatedSvg.includes("filter=")) {
    updatedSvg = updatedSvg.replace(
      "</defs>",
      `<filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
        <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
        <feMerge> 
          <feMergeNode in="coloredBlur"/>
          <feMergeNode in="SourceGraphic"/>
        </feMerge>
      </filter>
      </defs>`
    );
  }

  // Make SVG responsive
  if (updatedSvg.includes("<svg")) {
    updatedSvg = updatedSvg
      .replace(/\swidth="[^"]*"/, "")
      .replace(/\sheight="[^"]*"/, "")
      .replace(
        "<svg",
        '<svg class="w-full h-auto max-w-full" preserveAspectRatio="xMidYMid meet"'
      );
  }

  // Pie chart
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
                <Cell key={`cell-${index}`} fill={PIE_COLORS[index]} stroke="#1e293b" strokeWidth={2} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
        <div className="text-center text-[10px] sm:text-xs text-gray-400 mt-1">
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
        onClick={(e) => {
          if (e.target.id && vaccinationData[e.target.id]) handleStateClick(e.target.id);
        }}
      />

      {/* Desktop Hover Tooltip */}
      {!selectedState && tooltip.visible && tooltip.data && window.innerWidth >= 768 && (() => {
        const tooltipEl = mapRef.current;
        const tooltipWidth = 320;
        const tooltipHeight = 220;

        let top = tooltip.y - tooltipHeight;
        let left = tooltip.x + 10;

        if (top < 10) top = 10;
        if (top + tooltipHeight > window.innerHeight - 10) top = window.innerHeight - tooltipHeight - 10;
        if (left < 10) left = 10;
        if (left + tooltipWidth > window.innerWidth - 10) left = window.innerWidth - tooltipWidth - 10;

        return (
          <div
            className="absolute bg-slate-800/95 backdrop-blur-md shadow-2xl rounded-lg p-3 sm:p-5 w-72 md:w-80 lg:w-96 z-50 border border-white/20 animate-fade-in"
            style={{ top, left }}
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
        );
      })()}

      {/* Mobile Centered Popup */}
      {isMobilePopupOpen && tooltip.data && window.innerWidth < 768 && (
        <>
          <div className="fixed inset-0 bg-black/40 z-40" />
          <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-slate-900/95 backdrop-blur-md rounded-3xl p-5 w-11/12 max-w-sm z-50 animate-fade-in border border-white/20">
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-white font-bold text-base">{tooltip.stateName}</h3>
              <button
                onClick={() => setIsMobilePopupOpen(false)}
                className="text-gray-400 hover:text-white text-lg"
              >
                ×
              </button>
            </div>
            <StatePieChart data={tooltip.data} />
            <div className="grid grid-cols-2 gap-2 mt-2 text-[10px] text-gray-200">
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
        </>
      )}
    </div>
  );
}

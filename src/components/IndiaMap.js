"use client";
import { useState, useEffect } from "react";
import vaccinationData from "../data/vaccinationData";

export default function IndiaMap({ highlighted, setHighlighted }) {
  const [svgContent, setSvgContent] = useState("");
  const [tooltip, setTooltip] = useState({ 
    visible: false, 
    x: 0, 
    y: 0, 
    stateId: null,
    stateName: "",
    data: null 
  });

  useEffect(() => {
    fetch("/india.svg")
      .then((res) => res.text())
      .then((svg) => setSvgContent(svg));
  }, []);

  if (!svgContent) return (
    <div className="flex items-center justify-center h-96">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-300">Loading map...</p>
      </div>
    </div>
  );

  // Enhanced color scale
  const values = Object.values(vaccinationData).map((d) => d.overall);
  const min = Math.min(...values);
  const max = Math.max(...values);
  
  const getColor = (value) => {
    const ratio = (value - min) / (max - min);
    if (ratio > 0.7) return "#15803d"; // Dark green
    if (ratio > 0.4) return "#22c55e"; // Green
    if (ratio > 0.2) return "#facc15"; // Yellow
    return "#dc2626"; // Red
  };

  const handleMouseMove = (e) => {
    if (e.target.id && vaccinationData[e.target.id]) {
      const stateData = vaccinationData[e.target.id];
      setHighlighted(e.target.id);
      
      const rect = e.currentTarget.getBoundingClientRect();
      setTooltip({
        visible: true,
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
        stateId: e.target.id,
        stateName: stateData.name,
        data: stateData
      });
    }
  };

  const handleMouseLeave = () => {
    setHighlighted(null);
    setTooltip({ visible: false, x: 0, y: 0, stateId: null, stateName: "", data: null });
  };

  // Update SVG paths with enhanced styling
  let updatedSvg = svgContent;
  Object.entries(vaccinationData).forEach(([id, d]) => {
    const isHighlighted = highlighted === id;
    const fill = getColor(d.overall);
    const stroke = isHighlighted ? "#1e40af" : "#ffffff";
    const strokeWidth = isHighlighted ? "2" : "1";
    const filter = isHighlighted ? "url(#glow)" : "none";
    
    updatedSvg = updatedSvg.replace(
      new RegExp(`id="${id}"`, "g"),
      `id="${id}" fill="${fill}" stroke="${stroke}" stroke-width="${strokeWidth}" filter="${filter}" class="transition-all duration-200 cursor-pointer"`
    );
  });

  // Add glow filter for highlighted states
  if (!updatedSvg.includes('filter=')) {
    updatedSvg = updatedSvg.replace(
      '</defs>',
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

  return (
    <div className="relative">
      <div
        className="w-full max-w-4xl mx-auto transform hover:scale-105 transition-transform duration-300"
        dangerouslySetInnerHTML={{ __html: updatedSvg }}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      />

      {/* Enhanced Tooltip */}
      {tooltip.visible && tooltip.data && (
        <div
          className="absolute bg-slate-800/95 backdrop-blur-md shadow-2xl rounded-2xl p-5 w-72 z-50 pointer-events-none border border-white/20 animate-fade-in"
          style={{ 
            top: Math.max(tooltip.y - 160, 20), 
            left: Math.min(tooltip.x + 20, window.innerWidth - 320)
          }}
        >
          <div className="text-center">
            <h3 className="font-bold text-xl text-white mb-3 pb-2 border-b border-white/20">{tooltip.stateName}</h3>
            
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="bg-blue-500/20 p-3 rounded-xl border border-blue-400/30">
                <div className="text-blue-300 font-semibold text-xs uppercase tracking-wide">Total</div>
                <div className="text-white font-bold text-lg mt-1">
                  {new Intl.NumberFormat().format(tooltip.data.overall)}
                </div>
              </div>
              
              <div className="bg-green-500/20 p-3 rounded-xl border border-green-400/30">
                <div className="text-green-300 font-semibold text-xs uppercase tracking-wide">Fully</div>
                <div className="text-white font-bold text-lg mt-1">
                  {new Intl.NumberFormat().format(tooltip.data.total)}
                </div>
              </div>
              
              <div className="bg-yellow-500/20 p-3 rounded-xl border border-yellow-400/30">
                <div className="text-yellow-300 font-semibold text-xs uppercase tracking-wide">Partial</div>
                <div className="text-white font-bold text-lg mt-1">
                  {new Intl.NumberFormat().format(tooltip.data.partial)}
                </div>
              </div>
              
              <div className="bg-purple-500/20 p-3 rounded-xl border border-purple-400/30">
                <div className="text-purple-300 font-semibold text-xs uppercase tracking-wide">Precaution</div>
                <div className="text-white font-bold text-lg mt-1">
                  {new Intl.NumberFormat().format(tooltip.data.precaution)}
                </div>
              </div>
            </div>
          </div>
          
          <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 w-4 h-4 bg-slate-800 rotate-45 border-t border-l border-white/20"></div>
        </div>
      )}
    </div>
  );
}
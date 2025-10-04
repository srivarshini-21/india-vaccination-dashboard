"use client";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";
import vaccinationData from "../data/vaccinationData";

export default function VaccinationChart({ highlighted }) {
  const data = Object.entries(vaccinationData)
    .map(([id, d]) => ({
      id,
      name: d.name,
      value: d.overall,
      partial: d.partial,
      total: d.total,
      precaution: d.precaution
    }))
    .sort((a, b) => b.value - a.value);

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-slate-800/95 backdrop-blur-sm p-5 rounded-2xl shadow-2xl border border-white/20">
          <p className="font-bold text-white text-center mb-3 text-lg border-b border-white/20 pb-2">{label}</p>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between items-center bg-blue-500/20 px-3 py-2 rounded-lg border border-blue-400/30">
              <span className="text-blue-300">Total Vaccinated:</span>
              <span className="font-bold text-white">{new Intl.NumberFormat().format(data.value)}</span>
            </div>
            <div className="flex justify-between items-center bg-green-500/20 px-3 py-2 rounded-lg border border-green-400/30">
              <span className="text-green-300">Fully Vaccinated:</span>
              <span className="font-bold text-white">{new Intl.NumberFormat().format(data.total)}</span>
            </div>
            <div className="flex justify-between items-center bg-yellow-500/20 px-3 py-2 rounded-lg border border-yellow-400/30">
              <span className="text-yellow-300">Partially Vaccinated:</span>
              <span className="font-bold text-white">{new Intl.NumberFormat().format(data.partial)}</span>
            </div>
            <div className="flex justify-between items-center bg-purple-500/20 px-3 py-2 rounded-lg border border-purple-400/30">
              <span className="text-purple-300">Precaution Dose:</span>
              <span className="font-bold text-white">{new Intl.NumberFormat().format(data.precaution)}</span>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="w-full">
      <div className="text-center mb-8">
        <h2 className="text-4xl font-bold bg-gradient-to-r from-cyan-400 to-green-400 bg-clip-text text-transparent mb-3">
          State-wise Vaccination Analysis
        </h2>
        <p className="text-gray-300 text-lg max-w-2xl mx-auto leading-relaxed">
          Compare vaccination metrics across all states. Interactive highlighting shows corresponding data when hovering over the map.
        </p>
      </div>
      
      <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
        <ResponsiveContainer width="100%" height={450}>
          <BarChart 
            data={data} 
            margin={{ top: 20, right: 30, left: 20, bottom: 100 }}
          >
            <XAxis 
              dataKey="name" 
              angle={-45}
              textAnchor="end"
              height={80}
              tick={{ fontSize: 11, fill: '#d1d5db' }}
              interval={0}
            />
            <YAxis 
              tickFormatter={(value) => 
                value >= 1000000 ? `${(value / 1000000).toFixed(1)}M` : 
                value >= 1000 ? `${(value / 1000).toFixed(0)}K` : value
              }
              tick={{ fill: '#d1d5db' }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar 
              dataKey="value" 
              radius={[8, 8, 0, 0]}
              animationDuration={800}
            >
              {data.map((entry) => (
                <Cell
                  key={entry.id}
                  fill={highlighted === entry.id ? "#60a5fa" : "#3b82f6"}
                  stroke={highlighted === entry.id ? "#93c5fd" : "#60a5fa"}
                  strokeWidth={highlighted === entry.id ? 3 : 1}
                  opacity={highlighted && highlighted !== entry.id ? 0.3 : 0.9}
                  className="transition-all duration-300 hover:opacity-100 hover:stroke-2"
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
      
      <div className="text-center mt-6 p-4 bg-cyan-500/10 rounded-xl border border-cyan-400/30">
        <p className="text-cyan-300 text-sm font-medium">
          💡 Interactive Feature: Hover over states on the map to highlight their corresponding data bars
        </p>
      </div>
    </div>
  );
}
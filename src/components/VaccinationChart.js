"use client";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import vaccinationData from "../data/vaccinationData";

export default function VaccinationChart({ highlighted }) {
  const data = Object.entries(vaccinationData)
    .map(([id, d]) => ({
      id,
      name: d.name,
      value: d.overall,
      partial: d.partial,
      total: d.total,
      precaution: d.precaution,
    }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 15);

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-slate-800/95 backdrop-blur-sm p-4 rounded-2xl shadow-2xl border border-white/20 w-[90vw] sm:w-80">
          <p className="font-bold text-white text-center mb-3 text-base sm:text-lg">
            {label}
          </p>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between items-center bg-gradient-to-r from-blue-500/30 to-cyan-500/30 px-3 py-2 rounded-lg border border-blue-400/50">
              <span className="text-blue-300">Total:</span>
              <span className="font-bold text-white">
                {new Intl.NumberFormat().format(data.value)}
              </span>
            </div>
            <div className="flex justify-between items-center bg-gradient-to-r from-green-500/30 to-emerald-500/30 px-3 py-2 rounded-lg border border-green-400/50">
              <span className="text-green-300">Fully:</span>
              <span className="font-bold text-white">
                {new Intl.NumberFormat().format(data.total)}
              </span>
            </div>
            <div className="flex justify-between items-center bg-gradient-to-r from-yellow-500/30 to-amber-500/30 px-3 py-2 rounded-lg border border-yellow-400/50">
              <span className="text-yellow-300">Partial:</span>
              <span className="font-bold text-white">
                {new Intl.NumberFormat().format(data.partial)}
              </span>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="w-full px-4 sm:px-6 md:px-8">
      <div className="text-center mb-6 sm:mb-8">
        <h2 className="text-2xl sm:text-4xl font-bold bg-gradient-to-r from-cyan-400 to-green-400 bg-clip-text text-transparent mb-2 sm:mb-3">
          Top 15 States by Vaccination
        </h2>
        <p className="text-gray-300 text-sm sm:text-lg max-w-2xl mx-auto leading-relaxed">
          Horizontal bars showing vaccination numbers for top performing states
        </p>
      </div>

      <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-4 sm:p-6 border border-white/20">
        <div className="flex justify-start overflow-x-auto">
          <div className="min-w-[320px] sm:min-w-full w-full">
            <ResponsiveContainer width="100%" height={500}>
              <BarChart
                data={data}
                layout="vertical"
                margin={{ top: 20, right: 30, left: 120, bottom: 20 }}
              >
                <defs>
                  <linearGradient id="mainGradient" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#34d399" />
                    <stop offset="50%" stopColor="#10b981" />
                    <stop offset="100%" stopColor="#059669" />
                  </linearGradient>
                  <linearGradient
                    id="highlightedGradient"
                    x1="0"
                    y1="0"
                    x2="1"
                    y2="0"
                  >
                    <stop offset="0%" stopColor="#60a5fa" />
                    <stop offset="100%" stopColor="#3b82f6" />
                  </linearGradient>
                </defs>

                <XAxis
                  type="number"
                  tickFormatter={(value) =>
                    value >= 1000000
                      ? `${(value / 1000000).toFixed(1)}M`
                      : value >= 1000
                      ? `${(value / 1000).toFixed(0)}K`
                      : value
                  }
                  tick={{ fill: "#d1d5db", fontSize: 12 }}
                />
                <YAxis
                  type="category"
                  dataKey="name"
                  tick={{ fill: "#d1d5db", fontSize: 12 }}
                  width={110}
                  interval={0}
                />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="value" radius={[0, 6, 6, 0]} animationDuration={800}>
                  {data.map((entry) => {
                    const isHighlighted = highlighted === entry.id;
                    return (
                      <Cell
                        key={entry.id}
                        fill={
                          isHighlighted
                            ? "url(#highlightedGradient)"
                            : "url(#mainGradient)"
                        }
                        stroke={isHighlighted ? "#10b981" : "#059669"}
                        strokeWidth={isHighlighted ? 2 : 1}
                        opacity={highlighted && !isHighlighted ? 0.3 : 1}
                        className="transition-all duration-300 hover:brightness-110"
                      />
                    );
                  })}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap justify-center mt-6 gap-4 text-sm">
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-gradient-to-r from-[#34d399] via-[#10b981] to-[#059669] rounded"></div>
            <span className="text-green-300">All States</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-gradient-to-r from-[#60a5fa] to-[#3b82f6] rounded"></div>
            <span className="text-blue-300">Highlighted State</span>
          </div>
        </div>
      </div>
    </div>
  );
}
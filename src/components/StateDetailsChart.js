"use client";
import { PieChart, Pie, Cell, Tooltip as RechartsTooltip, ResponsiveContainer } from "recharts";
import vaccinationData from "../data/vaccinationData";

export default function StateDetailsChart({ highlighted, compact = false }) {
  if (!highlighted || !vaccinationData[highlighted]) return null;

  const state = vaccinationData[highlighted];
  const data = [
    { name: "Partial Vaccinated", value: state.partial },
    { name: "Fully Vaccinated", value: state.total },
    { name: "Precaution Dose", value: state.precaution }
  ];

  const COLORS = ["#60a5fa", "#22c55e", "#facc15"];
  const total = data.reduce((sum, item) => sum + item.value, 0);

  const formatNumber = (num) => new Intl.NumberFormat().format(num);

  return (
    <div className={`bg-white rounded-2xl p-4 ${compact ? 'w-64' : 'w-80'} text-center animate-fade-in shadow-lg border border-gray-100`}>
      <h2 className={`font-bold text-gray-800 mb-3 ${compact ? 'text-sm' : 'text-lg'}`}>
        {state.name} — Vaccination Breakdown
      </h2>

      <ResponsiveContainer width="100%" height={compact ? 160 : 200}>
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={compact ? 60 : 70}
            label={({ name, value }) => `${name}: ${((value/total)*100).toFixed(1)}%`}
            labelLine={false}
          >
            {data.map((entry, index) => (
              <Cell 
                key={`cell-${index}`} 
                fill={COLORS[index]}
                stroke="#fff"
                strokeWidth={2}
              />
            ))}
          </Pie>
          <RechartsTooltip 
            formatter={(value) => [formatNumber(value), 'People']}
            labelFormatter={(name) => <strong>{name}</strong>}
          />
        </PieChart>
      </ResponsiveContainer>

      {/* Enhanced Legend */}
      <div className="grid grid-cols-1 gap-2 mt-4">
        {data.map((item, index) => (
          <div key={index} className="flex items-center justify-between text-sm">
            <div className="flex items-center space-x-2">
              <span
                className="w-3 h-3 rounded-full shadow-sm"
                style={{ backgroundColor: COLORS[index] }}
              />
              <span className="text-gray-700">{item.name}</span>
            </div>
            <span className="font-semibold text-gray-900">
              {formatNumber(item.value)}
            </span>
          </div>
        ))}
        <div className="border-t pt-2 mt-2">
          <div className="flex justify-between font-bold text-gray-800">
            <span>Total Vaccinated</span>
            <span>{formatNumber(total)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
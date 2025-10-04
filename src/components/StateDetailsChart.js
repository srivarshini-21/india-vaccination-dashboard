"use client";
import { PieChart, Pie, Cell, Tooltip as RechartsTooltip, ResponsiveContainer } from "recharts";
import vaccinationData from "../data/vaccinationData";

export default function StateDetailsChart({ highlighted }) {
  if (!highlighted || !vaccinationData[highlighted]) return null;

  const state = vaccinationData[highlighted];
  const data = [
    { name: "Partial Vaccinated", value: state.partial },
    { name: "Fully Vaccinated", value: state.total },
    { name: "Precaution Dose", value: state.precaution }
  ];

  const COLORS = ["#60a5fa", "#22c55e", "#facc15"];
  const COLOR_LABELS = ["Partial Vaccinated", "Fully Vaccinated", "Precaution Dose"];

  return (
    <div className="bg-white shadow-lg rounded-2xl p-4 w-72 text-center animate-fade-in">
      <h2 className="text-lg font-semibold text-gray-800 mb-2">{state.name} — Vaccination Breakdown</h2>

      <ResponsiveContainer width="100%" height={200}>
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={70}
            label
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index]} />
            ))}
          </Pie>
          <RechartsTooltip formatter={(value) => new Intl.NumberFormat().format(value)} />
        </PieChart>
      </ResponsiveContainer>

      {/* Legend */}
      <div className="flex justify-around mt-2">
        {COLOR_LABELS.map((label, i) => (
          <div key={i} className="flex items-center space-x-1 text-sm text-gray-700">
            <span
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: COLORS[i] }}
            />
            <span>{label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

"use client";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";
import vaccinationData from "../data/vaccinationData";

export default function VaccinationChart({ highlighted }) {
  const data = Object.entries(vaccinationData).map(([id, d]) => ({
    id,
    name: d.name,
    value: d.overall
  }));

  return (
    <div className="w-full">
      <h2 className="text-lg font-semibold text-gray-700 mb-2">
        Overall Vaccinations by State
      </h2>
      <ResponsiveContainer width="100%" height={350}>
        <BarChart data={data} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
          <XAxis dataKey="name" tick={{ fontSize: 10 }} />
          <YAxis />
          <Tooltip />
          <Bar dataKey="value" radius={[6, 6, 0, 0]}>
            {data.map((entry) => (
              <Cell
                key={entry.id}
                fill={highlighted === entry.id ? "#15803d" : "#3b82f6"}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

"use client";
import { useState } from "react";
import IndiaMap from "../components/IndiaMap";
import VaccinationChart from "../components/VaccinationChart";
import Legend from "../components/Legend";

export default function Dashboard() {
  const [highlighted, setHighlighted] = useState(null);

  return (
    <main className="p-8 flex flex-col items-center bg-gray-50 min-h-screen">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold text-gray-800 mb-2">
          India COVID-19 Vaccination Dashboard
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Explore vaccination coverage across India. Hover over a state to view
          detailed data and compare trends across the country.
        </p>
      </div>

      {/* Map at Center */}
      <div className="bg-white rounded-2xl shadow p-6 flex flex-col items-center">
        <IndiaMap highlighted={highlighted} setHighlighted={setHighlighted} />
        <Legend />
      </div>

      {/* Bar Chart */}
      <div className="bg-white rounded-2xl shadow p-6 mt-10 w-full max-w-5xl">
        <VaccinationChart highlighted={highlighted} />
      </div>
    </main>
  );
}

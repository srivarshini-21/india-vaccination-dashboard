"use client";
import { useState } from "react";
import IndiaMap from "../components/IndiaMap";
import VaccinationChart from "../components/VaccinationChart";
import Legend from "../components/Legend";

export default function Dashboard() {
  const [highlighted, setHighlighted] = useState(null);

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-emerald-900 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-blue-900 to-emerald-900">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl animate-pulse"></div>
          <div className="absolute top-1/3 right-1/4 w-64 h-64 bg-emerald-500 rounded-full mix-blend-multiply filter blur-xl animate-pulse delay-1000"></div>
          <div className="absolute bottom-1/4 left-1/3 w-64 h-64 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl animate-pulse delay-2000"></div>
        </div>
      </div>

      <div className="relative z-10">
        {/* Header */}
        <div className="text-center pt-12 pb-8 px-4">
          <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-blue-400 via-green-400 to-cyan-400 bg-clip-text text-transparent mb-6">
            India Vaccination Tracker
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Real-time visualization of COVID-19 vaccination progress across all Indian states and union territories
          </p>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 pb-12">
          {/* Map Section */}
          <div className="bg-white/10 backdrop-blur-lg rounded-3xl shadow-2xl p-8 mb-8 border border-white/20">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-white mb-3">Interactive State Map</h2>
              <p className="text-gray-300 text-lg">
                Hover over any state to view vaccination details and highlight corresponding data
              </p>
            </div>
            
            <div className="flex justify-center mb-6">
              <IndiaMap highlighted={highlighted} setHighlighted={setHighlighted} />
            </div>
            
            <div className="flex justify-center mt-8">
              <Legend />
            </div>
          </div>

          {/* Chart Section */}
          <div className="bg-white/10 backdrop-blur-lg rounded-3xl shadow-2xl p-8 border border-white/20">
            <VaccinationChart highlighted={highlighted} />
          </div>
        </div>

        {/* Footer */}
        <footer className="text-center py-8 border-t border-white/10">
          <p className="text-gray-400">
            Official Vaccination Data • Built with Next.js & Recharts
          </p>
        </footer>
      </div>
    </main>
  );
}
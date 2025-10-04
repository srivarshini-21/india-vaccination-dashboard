export default function Legend() {
  return (
    <div className="bg-white/20 backdrop-blur-md rounded-2xl p-4 sm:p-6 border border-white/30 shadow-lg max-w-[95vw] sm:max-w-2xl mx-auto">
      <h3 className="text-xl sm:text-2xl font-bold text-white text-center mb-4 sm:mb-6">
        📊 Coverage Intensity Scale
      </h3>

      <div className="flex flex-col items-center space-y-4">
        {/* Gradient Bar */}
        <div className="w-full h-6 sm:h-8 bg-gradient-to-r from-red-500 via-yellow-400 to-green-500 rounded-xl shadow-inner border-2 border-white/30 relative overflow-hidden max-w-[90vw] sm:max-w-md">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse"></div>
        </div>

        {/* Labels */}
        <div className="flex flex-col sm:flex-row justify-between w-full max-w-[90vw] sm:max-w-md text-white font-semibold text-xs sm:text-sm space-y-2 sm:space-y-0 sm:space-x-2">
          <span className="flex items-center px-3 py-1 bg-red-500/20 rounded-lg border border-red-400/30">
            <div className="w-3 h-3 bg-red-500 rounded-full mr-2 shadow-lg"></div>
            Low Coverage
          </span>
          <span className="flex items-center px-3 py-1 bg-yellow-500/20 rounded-lg border border-yellow-400/30">
            <div className="w-3 h-3 bg-yellow-400 rounded-full mr-2 shadow-lg"></div>
            Medium
          </span>
          <span className="flex items-center px-3 py-1 bg-green-500/20 rounded-lg border border-green-400/30">
            <div className="w-3 h-3 bg-green-500 rounded-full mr-2 shadow-lg"></div>
            High Coverage
          </span>
        </div>

        {/* Description */}
        <p className="text-gray-300 text-center text-xs sm:text-sm max-w-[90vw] sm:max-w-md leading-relaxed">
          Color intensity indicates vaccination coverage levels—darker greens represent higher vaccination rates,
          while red areas need increased vaccination efforts.
        </p>
      </div>
    </div>
  );
}
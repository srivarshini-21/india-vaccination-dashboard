export default function Legend() {
  return (
    <div className="bg-white/20 backdrop-blur-md rounded-2xl p-6 border border-white/30 shadow-lg max-w-2xl mx-auto">
      <h3 className="text-2xl font-bold text-white text-center mb-6">
        📊 Coverage Intensity Scale
      </h3>
      
      <div className="flex flex-col items-center space-y-4">
        <div className="w-full max-w-md h-8 bg-gradient-to-r from-red-500 via-yellow-400 to-green-500 rounded-xl shadow-inner border-2 border-white/30 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse"></div>
        </div>
        
        <div className="flex justify-between w-full max-w-md text-white font-semibold text-sm">
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
        
        <p className="text-gray-300 text-center text-sm max-w-md leading-relaxed">
          Color intensity indicates vaccination coverage levels—darker greens represent higher vaccination rates, 
          while red areas need increased vaccination efforts
        </p>
      </div>
    </div>
  );
}
export default function Legend() {
  return (
    <div className="mt-6 flex flex-col items-center">
      <div className="w-60 h-5 bg-gradient-to-r from-red-600 via-yellow-400 to-green-600 rounded"></div>
      <div className="flex justify-between w-60 text-sm text-gray-600 mt-1">
        <span>Low</span>
        <span>Medium</span>
        <span>High</span>
      </div>
      <p className="text-gray-500 text-xs mt-2 text-center">
        Dark green = highest vaccination coverage.  
        Red = lowest vaccination coverage.
      </p>
    </div>
  );
}

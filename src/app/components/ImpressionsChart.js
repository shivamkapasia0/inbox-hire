export default function ImpressionsChart() {
  return (
    <div className="p-4">
      <div className="flex items-center justify-center space-x-4 mb-4">
        <div className="flex items-center">
          <span className="block w-3 h-3 rounded-full bg-green-500 mr-2"></span>
          <span className="text-sm">1000 Job Booster</span>
        </div>
        <div className="flex items-center">
          <span className="block w-3 h-3 rounded-full bg-blue-500 mr-2"></span>
          <span className="text-sm">700 Job Alert</span>
        </div>
      </div>
      {/* Placeholder for Bar Chart */}
      <div className="w-full h-64 bg-gray-200 dark:bg-gray-700 rounded-md flex items-center justify-center text-gray-500 dark:text-gray-400">
        Bar Chart Placeholder
      </div>
    </div>
  );
} 
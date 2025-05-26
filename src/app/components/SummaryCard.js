'use client';

import AnimatedNumber from './AnimatedNumber';

export default function SummaryCard({ title, value, trend, trendType, gradientClasses, icon: Icon, iconColor }) {
  return (
    <div className={`rounded-2xl p-4 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 cursor-pointer relative overflow-hidden ${gradientClasses}`}>
      {/* Icon positioned absolutely at top right */}
      <div className="absolute top-3 right-3 p-1 rounded-full bg-white bg-opacity-30 dark:bg-gray-700 dark:bg-opacity-30 flex items-center justify-center">
        {Icon && <Icon className={`w-4 h-4 ${iconColor}`} />}
      </div>

      {/* Card content with padding to prevent overlap with icon */}
      <div className="flex flex-col h-full justify-between pr-12">
        {/* Title */}
        <div>
          <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">{title}</h3>
        </div>
        {/* Value */}
        <div className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
          <AnimatedNumber value={parseInt(value)} />
        </div>
        {/* Trend */}
        <div className={`text-sm font-medium transition-transform duration-300 hover:translate-y-[-2px] ${trendType === 'up' ? 'text-green-700 dark:text-green-400' : trendType === 'down' ? 'text-red-700 dark:text-red-400' : 'text-gray-600 dark:text-gray-400'}`}>
          {trendType === 'up' ? '↑' : trendType === 'down' ? '↓' : ''}{trend}
        </div>
      </div>
    </div>
  );
} 
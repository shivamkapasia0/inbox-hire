import AnimatedNumber from './AnimatedNumber';

export default function SummaryCard({ title, value, trend, trendType, gradientClasses, icon: Icon, iconColor }) {
  return (
    <div className={`rounded-2xl p-4 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 cursor-pointer ${gradientClasses}`}>
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-base font-semibold text-gray-800 dark:text-gray-100">{title}</h3>
        <div className="p-2 rounded-full bg-white bg-opacity-30 dark:bg-gray-700 dark:bg-opacity-30 flex items-center justify-center">
          {/* Placeholder Icon - use the passed Icon component */}
          {Icon && <Icon className={`w-5 h-5 ${iconColor}`} />}
        </div>
      </div>
      <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
        <AnimatedNumber value={parseInt(value)} />
      </div>
      <div className={`text-sm font-medium transition-transform duration-300 hover:translate-y-[-2px] ${trendType === 'up' ? 'text-green-800 dark:text-green-300' : 'text-red-800 dark:text-red-300'}`}>
        {trendType === 'up' ? '↑' : '↓'}{trend}
      </div>
    </div>
  );
} 
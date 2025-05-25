'use client';

import { useDataStore } from '../utils/DataStore';

export default function ImpressionsChart() {
  const { data } = useDataStore();
  const { impressionFunnelData } = data;

  const thresholdPercentage = 25; // Threshold to move text outside the bar

  return (
    <div className="p-4 rounded-lg shadow-lg" style={{
      background: 'linear-gradient(135deg, rgba(251, 243, 225, 0.9) 0%, rgba(249, 222, 219, 0.9) 50%, rgba(212, 236, 230, 0.9) 100%)',
      backdropFilter: 'blur(10px)',
    }}>
      <div className="space-y-3">
        {impressionFunnelData.stages.map((stage, index) => {
          const barWidthPercentage = (stage.value / impressionFunnelData.stages[0].value) * 100;
          const isTextOutside = barWidthPercentage < thresholdPercentage;

          return (
            <div key={stage.label} className="relative flex items-center">
              {/* Stage Bar */}
              <div 
                className={`h-14 rounded-lg transition-all duration-300 ${!isTextOutside && 'hover:scale-[1.02]'}`}
                style={{
                  width: `${barWidthPercentage}%`,
                  backgroundColor: stage.color,
                  opacity: 0.9,
                  minWidth: isTextOutside ? '10px' : 'auto', // Ensure bar is visible even if small
                }}
              >
                {!isTextOutside && (
                  <div className="flex items-center justify-between h-full px-4">
                    <span className="text-white font-medium text-sm">{stage.label}</span>
                    <span className="text-white font-bold">{stage.value}</span>
                  </div>
                )}
              </div>

              {/* Text outside the bar if needed */}
              {isTextOutside && (
                <div className="ml-2 flex items-center justify-between w-full">
                  <span className="text-gray-800 font-medium text-sm">{stage.label}</span>
                  <span className="text-gray-800 font-bold ml-2">{stage.value}</span>
                </div>
              )}

              {/* Conversion Rate and Arrow */}
              {index < impressionFunnelData.stages.length - 1 && (
                <div className="absolute top-1/2 right-0 transform -translate-y-1/2 flex items-center">
                  <span className="text-xs text-gray-500">
                    {impressionFunnelData.conversionRates[
                      index === 0 ? 'replyRate' : 
                      index === 1 ? 'interviewRate' : 'offerRate'
                    ]}%
                  </span>
                  <svg 
                    className="w-3 h-3 text-gray-400 ml-1" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth={2} 
                      d="M19 14l-7 7m0 0l-7-7m7 7V3" 
                    />
                  </svg>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="mt-4 flex justify-center space-x-8">
        <div className="text-center">
          <p className="text-sm font-medium text-emerald-600">
            {impressionFunnelData.conversionRates.replyRate}%
          </p>
          <p className="text-xs text-gray-500">Reply</p>
        </div>
        <div className="text-center">
          <p className="text-sm font-medium text-amber-600">
            {impressionFunnelData.conversionRates.interviewRate}%
          </p>
          <p className="text-xs text-gray-500">Interview</p>
        </div>
        <div className="text-center">
          <p className="text-sm font-medium text-pink-600">
            {impressionFunnelData.conversionRates.offerRate}%
          </p>
          <p className="text-xs text-gray-500">Offer</p>
        </div>
      </div>
    </div>
  );
} 
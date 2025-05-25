'use client';

import { useDataStore } from '../utils/DataStore';

export default function ImpressionsChart() {
  const { data } = useDataStore();
  const { impressionFunnelData } = data;

  // Define thresholds for bar width
  const valueInsideThresholdPercentage = 20; // Value stays inside if bar width > this
  const labelColorThresholdPercentage = 5; // Label text color changes to dark if bar width < this

  return (
    <div className="p-4 rounded-lg shadow-lg" style={{
      background: 'linear-gradient(135deg, rgba(251, 243, 225, 0.9) 0%, rgba(249, 222, 219, 0.9) 50%, rgba(212, 236, 230, 0.9) 100%)',
      backdropFilter: 'blur(10px)',
    }}>
      {/* Chart Title */}
      {/* <h3 className="text-lg font-semibold text-gray-800 mb-4">Impressions Funnel</h3> */}

      <div className="space-y-4">
        {impressionFunnelData.stages.map((stage, index) => {
          const barWidthPercentage = (stage.value / impressionFunnelData.stages[0].value) * 100;
          const isValueInside = barWidthPercentage > valueInsideThresholdPercentage;
          const labelTextColorClass = barWidthPercentage > labelColorThresholdPercentage ? 'text-white' : 'text-gray-800';
          const valueTextColorClass = isValueInside ? 'text-white' : 'text-gray-800';

          return (
            <div key={stage.label} className="flex items-center w-full" style={{ minHeight: '3.5rem' }}>
              {/* Stage Label */}
              <div className="flex items-center pr-4" style={{ minWidth: '150px', maxWidth: '200px' }}>
                 <span className={`font-medium text-sm text-gray-800`}> 
                   {stage.label}
                 </span>
              </div>
              
              {/* Bar and Value/Rate Container - takes remaining space */}
              <div className="flex items-center flex-grow">
                {/* Stage Bar */}
                <div className="h-14 rounded-lg transition-all duration-300 hover:scale-[1.02] flex items-center relative" 
                  style={{
                    width: `${barWidthPercentage}%`,
                    backgroundColor: stage.color,
                    opacity: 0.9,
                    minWidth: '10px',
                  }}>
                </div>

                {/* Container for Value and Conversion Rate - positioned directly after the bar within this flex container */}
                <div className="flex items-center ml-2 flex-shrink-0">
                  {/* Stage Value */}
                  <div 
                    className="font-bold text-gray-800"
                  >
                    {stage.value}
                  </div>

                  {/* Conversion Rate and Arrow */}
                  {index < impressionFunnelData.stages.length - 1 && (
                    <div className="flex items-center ml-2"> 
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
              </div>
            </div>
          );
        })}
      </div>

      {/* Summary Stats */}
      <div className="mt-6 flex justify-center space-x-8">
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
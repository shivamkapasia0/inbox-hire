'use client';

import { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { XMarkIcon } from '@heroicons/react/24/outline';

// Applications data
const applications = [
  { id: 1, jobTitle: 'Software Engineer', company: 'Tech Solutions', status: 'Offer Letters', date: '2024-05-15' },
  { id: 2, jobTitle: 'Data Analyst', company: 'Data Insights', status: 'Interview Scheduled', date: '2024-05-14' },
  { id: 3, jobTitle: 'Product Manager', company: 'Innovate Labs', status: 'No Response', date: '2024-05-12' },
  { id: 4, jobTitle: 'UX Designer', company: 'Creative Minds', status: 'Offer Letters', date: '2024-05-10' },
  { id: 5, jobTitle: 'DevOps Engineer', company: 'Cloud Services', status: 'Rejected', date: '2024-05-08' },
  { id: 6, jobTitle: 'Marketing Specialist', company: 'Growth Agency', status: 'No Response', date: '2024-05-05' },
  { id: 7, jobTitle: 'Sales Representative', company: 'BizConnect', status: 'Interview Scheduled', date: '2024-05-03' },
  { id: 8, jobTitle: 'HR Coordinator', company: 'People Solutions', status: 'Offer Letters', date: '2024-05-01' },
  { id: 9, jobTitle: 'System Administrator', company: 'IT Services', status: 'Rejected', date: '2024-04-28' },
  { id: 10, jobTitle: 'Business Analyst', company: 'Consulting Group', status: 'No Response', date: '2024-04-25' },
  { id: 11, jobTitle: 'Frontend Developer', company: 'Web Builders', status: 'Interview Scheduled', date: '2024-04-20' },
  { id: 12, jobTitle: 'Backend Developer', company: 'Server Side', status: 'Offer Letters', date: '2024-04-18' },
  { id: 13, jobTitle: 'Mobile Developer', company: 'App Solutions', status: 'Rejected', date: '2024-04-16' },
  { id: 14, jobTitle: 'Data Scientist', company: 'AI Labs', status: 'Interview Scheduled', date: '2024-04-14' },
];

const positionTypes = [
  { 
    title: 'Consultant', 
    count: 2,
    color: 'from-blue-100/80 to-blue-200/80',
    borderColor: 'border-blue-200/50',
    hoverColor: 'hover:from-blue-100 hover:to-blue-200',
    chartColor: '#3B82F6',
    chartHoverColor: '#2563EB',
    gradient: 'linear-gradient(135deg, #3B82F6 0%, #2563EB 100%)'
  },
  { 
    title: 'Tech Lead', 
    count: 1,
    color: 'from-purple-100/80 to-purple-200/80',
    borderColor: 'border-purple-200/50',
    hoverColor: 'hover:from-purple-100 hover:to-purple-200',
    chartColor: '#8B5CF6',
    chartHoverColor: '#7C3AED',
    gradient: 'linear-gradient(135deg, #8B5CF6 0%, #7C3AED 100%)'
  },
  { 
    title: 'Salesforce Developer', 
    count: 3,
    color: 'from-yellow-100/80 to-yellow-200/80',
    borderColor: 'border-yellow-200/50',
    hoverColor: 'hover:from-yellow-100 hover:to-yellow-200',
    chartColor: '#EAB308',
    chartHoverColor: '#CA8A04',
    gradient: 'linear-gradient(135deg, #EAB308 0%, #CA8A04 100%)'
  },
  { 
    title: 'Full Stack Developer', 
    count: 2,
    color: 'from-green-100/80 to-green-200/80',
    borderColor: 'border-green-200/50',
    hoverColor: 'hover:from-green-100 hover:to-green-200',
    chartColor: '#22C55E',
    chartHoverColor: '#16A34A',
    gradient: 'linear-gradient(135deg, #22C55E 0%, #16A34A 100%)'
  },
  { 
    title: 'UI/UX Designer', 
    count: 1,
    color: 'from-pink-100/80 to-pink-200/80',
    borderColor: 'border-pink-200/50',
    hoverColor: 'hover:from-pink-100 hover:to-pink-200',
    chartColor: '#EC4899',
    chartHoverColor: '#DB2777',
    gradient: 'linear-gradient(135deg, #EC4899 0%, #DB2777 100%)'
  }
];

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    const percentage = ((data.value / payload[0].payload.total) * 100).toFixed(1);
    
    return (
      <div className="bg-white/95 backdrop-blur-md px-4 py-3 rounded-xl shadow-lg border border-gray-100 max-w-xs">
        <div className="flex items-center space-x-3">
          <div 
            className="w-3 h-3 rounded-full" 
            style={{ 
              background: data.gradient || data.fill,
              boxShadow: '0 0 8px rgba(0,0,0,0.1)'
            }} 
          />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-gray-800 break-words">{data.name}</p>
            <div className="flex items-baseline space-x-2">
              <span className="text-lg font-bold text-gray-900">{data.value}</span>
              <span className="text-sm text-gray-500">({percentage}%)</span>
            </div>
          </div>
        </div>
      </div>
    );
  }
  return null;
};

const ApplicationModal = ({ isOpen, onClose, positionType, applications }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-xl shadow-xl w-full max-w-2xl mx-4 max-h-[80vh] overflow-hidden">
        <div className="p-4 border-b border-gray-200 flex justify-between items-center">
          <h3 className="text-lg font-semibold text-gray-900">{positionType?.title} Applications</h3>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-full">
            <XMarkIcon className="w-6 h-6 text-gray-500" />
          </button>
        </div>
        <div className="p-4 overflow-y-auto max-h-[calc(80vh-4rem)]">
          <div className="space-y-4">
            {applications.map((app) => (
              <div key={app.id} className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-medium text-gray-900">{app.jobTitle}</h4>
                    <p className="text-sm text-gray-600">{app.company}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    app.status === 'Offer Letters' ? 'bg-green-100 text-green-800' :
                    app.status === 'Interview Scheduled' ? 'bg-blue-100 text-blue-800' :
                    app.status === 'No Response' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {app.status}
                  </span>
                </div>
                <p className="text-sm text-gray-500 mt-2">Applied on {app.date}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default function WorkingType() {
  const [mounted, setMounted] = useState(false);
  const [selectedType, setSelectedType] = useState(null);
  const [hoveredType, setHoveredType] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const totalApplications = positionTypes.reduce((acc, curr) => acc + curr.count, 0);

  // Filter applications based on selected position type
  const filteredApplications = applications.filter(app => 
    app.jobTitle.toLowerCase().includes(positionTypes[selectedType]?.title.toLowerCase() || '')
  );

  const chartData = positionTypes.map(type => ({
    name: type.title,
    value: type.count,
    fill: type.chartColor,
    gradient: type.gradient,
    total: totalApplications
  }));

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleTypeClick = (index) => {
    setSelectedType(index);
    setIsModalOpen(true);
  };

  if (!mounted) {
    return (
      <div className="h-full flex flex-col">
        <div className="flex-1 min-h-[200px] bg-white/60 backdrop-blur-md rounded-xl shadow-md border border-gray-200/50 p-4 mb-4">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-sm font-medium text-gray-600">Position Distribution</h4>
            <span className="text-xs text-gray-500 bg-white/80 px-2 py-1 rounded-full">
              {positionTypes.length} Positions
            </span>
          </div>
          <div className="relative w-44 h-44 mx-auto">
            <div className="absolute inset-0 rounded-full bg-gray-100/30 animate-pulse" />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-2">
          {positionTypes.map((_, index) => (
            <div key={index} className="p-2 rounded-lg bg-white/60 animate-pulse h-12" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      {/* Chart Section */}
      <div className="flex-1 min-h-[200px] bg-white/60 backdrop-blur-md rounded-xl shadow-md border border-gray-200/50 p-4 mb-4">
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-sm font-medium text-gray-600">Position Distribution</h4>
          <span className="text-xs text-gray-500 bg-white/80 px-2 py-1 rounded-full">
            {positionTypes.length} Positions
          </span>
        </div>

        <div className="relative h-[200px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <defs>
                {chartData.map((entry, index) => (
                  <linearGradient key={`gradient-${index}`} id={`gradient-${index}`} x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor={entry.fill} stopOpacity={1} />
                    <stop offset="100%" stopColor={entry.fill} stopOpacity={0.8} />
                  </linearGradient>
                ))}
              </defs>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius={0}
                outerRadius={80}
                paddingAngle={2}
                dataKey="value"
                onMouseEnter={(_, index) => setHoveredType(index)}
                onMouseLeave={() => setHoveredType(null)}
                onClick={(_, index) => handleTypeClick(index)}
                animationDuration={1000}
                animationBegin={0}
              >
                {chartData.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`}
                    fill={`url(#gradient-${index})`}
                    stroke="white"
                    strokeWidth={2}
                    style={{
                      filter: hoveredType === index || selectedType === index 
                        ? 'brightness(1.1) drop-shadow(0 0 8px rgba(0,0,0,0.2))' 
                        : 'none',
                      transition: 'all 0.3s ease',
                      transform: hoveredType === index || selectedType === index 
                        ? 'scale(1.05)' 
                        : 'scale(1)'
                    }}
                  />
                ))}
              </Pie>
              <Tooltip 
                content={<CustomTooltip />}
                cursor={{ fill: 'rgba(255, 255, 255, 0.1)' }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Legend Section */}
      <div className="grid grid-cols-2 gap-2">
        {positionTypes.map((type, index) => (
          <div
            key={index}
            className={`p-2 rounded-lg cursor-pointer transition-all duration-300 
              backdrop-blur-md border ${type.borderColor}
              ${selectedType === index 
                ? `bg-gradient-to-r ${type.color} shadow-lg` 
                : 'bg-white/60 shadow-sm hover:shadow-md'
              }
              ${type.hoverColor}
              transform hover:scale-[1.02]`}
            onClick={() => handleTypeClick(index)}
            onMouseEnter={() => setHoveredType(index)}
            onMouseLeave={() => setHoveredType(null)}
          >
            <div className="flex items-center space-x-2">
              <div 
                className="w-3 h-3 rounded-full transition-all duration-300" 
                style={{ 
                  background: type.gradient,
                  boxShadow: hoveredType === index || selectedType === index 
                    ? '0 0 8px rgba(0,0,0,0.2)' 
                    : 'none'
                }} 
              />
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-medium text-gray-800 truncate">{type.title}</h3>
                <div className="flex items-baseline space-x-1">
                  <p className="text-xs font-semibold text-gray-700">{type.count}</p>
                  <p className="text-xs text-gray-500">
                    ({((type.count / totalApplications) * 100).toFixed(1)}%)
                  </p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Application Modal */}
      <ApplicationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        positionType={selectedType !== null ? positionTypes[selectedType] : null}
        applications={filteredApplications}
      />
    </div>
  );
} 
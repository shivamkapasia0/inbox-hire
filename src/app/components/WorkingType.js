'use client';

import React, { useState, useEffect } from 'react';
import { getApplicationTypeDistribution } from '../utils/data';

export default function WorkingType() {
  const [distribution, setDistribution] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadDistribution = async () => {
      try {
        const data = await getApplicationTypeDistribution();
        setDistribution(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadDistribution();
  }, []);

  if (loading) {
    return (
      <div className="animate-pulse space-y-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-12 bg-gray-200 rounded"></div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
        {error}
      </div>
    );
  }

  const total = Object.values(distribution).reduce((sum, count) => sum + count, 0);

  return (
    <div className="space-y-4">
      {Object.entries(distribution).map(([type, count]) => {
        const percentage = total > 0 ? Math.round((count / total) * 100) : 0;
        return (
          <div key={type} className="flex items-center justify-between">
            <div className="flex items-center">
              <div className={`w-3 h-3 rounded-full ${
                type === 'fullTime' ? 'bg-blue-500' :
                type === 'partTime' ? 'bg-green-500' :
                type === 'contract' ? 'bg-purple-500' :
                'bg-yellow-500'
              }`} />
              <span className="ml-2 text-sm font-medium text-gray-700">
                {type === 'fullTime' ? 'Full Time' :
                 type === 'partTime' ? 'Part Time' :
                 type === 'contract' ? 'Contract' :
                 'Internship'}
              </span>
            </div>
            <div className="flex items-center">
              <span className="text-sm font-medium text-gray-900">{count}</span>
              <span className="ml-2 text-sm text-gray-500">({percentage}%)</span>
            </div>
          </div>
        );
      })}
    </div>
  );
} 
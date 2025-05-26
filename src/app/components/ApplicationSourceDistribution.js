'use client';

import React, { useState, useEffect } from 'react';
import { getApplicationSourceDistribution } from '../utils/data';

export default function ApplicationSourceDistribution() {
  const [distribution, setDistribution] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadDistribution = async () => {
      try {
        const data = await getApplicationSourceDistribution();
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
      {/* <h3 className="text-lg font-semibold text-gray-800 mb-4">Application Sources</h3> */}
      {Object.entries(distribution).map(([source, count]) => {
        const percentage = total > 0 ? Math.round((count / total) * 100) : 0;
        return (
          <div key={source} className="flex items-center justify-between">
            <div className="flex items-center">
              {/* You might want to add different colored dots or icons based on the source */}
              <div className="w-3 h-3 rounded-full bg-blue-500" /> 
              <span className="ml-2 text-sm font-medium text-gray-700">
                {source}
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
'use client';

import React, { useState, useEffect } from 'react';
import { getJobsAppliedOverview } from '../utils/data';

export default function NotQualifiedOverview() {
  const [overview, setOverview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadOverview = async () => {
      try {
        const data = await getJobsAppliedOverview();
        setOverview(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadOverview();
  }, []);

  if (loading) {
    return (
      <div className="animate-pulse space-y-4">
        {[1, 2].map((i) => (
          <div key={i} className="h-24 bg-gray-200 rounded"></div>
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

  const { lastMonth, thisMonth } = overview;

  return (
    <div className="space-y-4">
      {/* This Month */}
      <div>
        <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">This Month</h3>
        <div className="bg-white/40 dark:bg-gray-800/40 rounded-lg p-4 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50 shadow-sm">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-gray-700 dark:text-gray-300">Total Applications</span>
            <span className="text-sm font-semibold text-gray-900 dark:text-white">{thisMonth.total}</span>
          </div>
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-gray-700 dark:text-gray-300">Qualified</span>
            <span className="text-sm font-semibold text-green-600 dark:text-green-400">{thisMonth.qualified}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-700 dark:text-gray-300">Not Qualified</span>
            <span className="text-sm font-semibold text-red-600 dark:text-red-400">{thisMonth.notQualified}</span>
          </div>
        </div>
      </div>

      {/* Last Month */}
      <div>
        <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Last Month</h3>
        <div className="bg-white/40 dark:bg-gray-800/40 rounded-lg p-4 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50 shadow-sm">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-gray-700 dark:text-gray-300">Total Applications</span>
            <span className="text-sm font-semibold text-gray-900 dark:text-white">{lastMonth.total}</span>
          </div>
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-gray-700 dark:text-gray-300">Qualified</span>
            <span className="text-sm font-semibold text-green-600 dark:text-green-400">{lastMonth.qualified}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-700 dark:text-gray-300">Not Qualified</span>
            <span className="text-sm font-semibold text-red-600 dark:text-red-400">{lastMonth.notQualified}</span>
          </div>
        </div>
      </div>
    </div>
  );
} 
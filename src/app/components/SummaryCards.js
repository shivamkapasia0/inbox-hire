'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  CheckCircleIcon,
  XCircleIcon,
  DocumentTextIcon,
  ClockIcon,
} from '@heroicons/react/24/outline';
import { getSummaryStats } from '../utils/data';

const SummaryCard = ({ title, value, trend, trendType, gradientClasses, icon: Icon, iconColor, onClick }) => {
  return (
    <div 
      className={`p-6 rounded-2xl shadow-lg cursor-pointer transition-all duration-200 hover:scale-[1.02] ${gradientClasses} relative overflow-hidden`}
      onClick={onClick}
    >
      <div className="absolute top-4 right-4 p-2 rounded-full bg-white bg-opacity-30 dark:bg-gray-700 dark:bg-opacity-30 flex items-center justify-center">
        {Icon && <Icon className={`w-5 h-5 ${iconColor}`} />}
      </div>

      <div className="flex flex-col h-full justify-between pr-12">
        <div>
          <p className="text-sm font-medium text-gray-600 dark:text-gray-300">{title}</p>
        </div>
        <div className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
            {value}
        </div>
        <div className={`text-sm font-medium ${
              trendType === 'up' ? 'text-green-600' : 'text-red-600'
            }`}>
              {trend}
            </div>
            <span className="text-sm text-gray-500 dark:text-gray-400 ml-2">vs last month</span>
          </div>
    </div>
  );
};

export default function SummaryCards() {
  const router = useRouter();
  const [summaryData, setSummaryData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadSummaryStats = async () => {
      try {
        const data = await getSummaryStats();
        setSummaryData(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadSummaryStats();
  }, []);

  const handleCardClick = (status) => {
    try {
      const encodedStatus = encodeURIComponent(status);
      router.push(`/applications?status=${encodedStatus}`);
    } catch (error) {
      console.error('Navigation error:', error);
    }
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="p-6 rounded-2xl shadow-lg bg-gray-100 animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
            <div className="h-8 bg-gray-200 rounded w-3/4 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/3"></div>
          </div>
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

  const { stats, trends } = summaryData;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
      <SummaryCard
        title="Total Jobs Applied"
        value={stats.totalApplied.toString()}
        trend={trends.totalApplied}
        trendType={trends.totalApplied.startsWith('+') ? 'up' : 'down'}
        gradientClasses="bg-gradient-to-br from-blue-50 to-blue-200"
        icon={DocumentTextIcon}
        iconColor="text-blue-600 dark:text-blue-300"
        onClick={() => handleCardClick('all')}
      />
      <SummaryCard
        title="Interview Scheduled"
        value={stats.interviewScheduled.toString()}
        trend={trends.interviewScheduled}
        trendType={trends.interviewScheduled.startsWith('+') ? 'up' : 'down'}
        gradientClasses="bg-gradient-to-br from-green-100 to-green-300"
        icon={CheckCircleIcon}
        iconColor="text-green-600 dark:text-green-300"
        onClick={() => handleCardClick('Interview')}
      />
      <SummaryCard
        title="No Response"
        value={stats.noResponse.toString()}
        trend={trends.noResponse}
        trendType={trends.noResponse.startsWith('+') ? 'up' : 'down'}
        gradientClasses="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-800"
        icon={XCircleIcon}
        iconColor="text-gray-600 dark:text-gray-300"
        onClick={() => handleCardClick('Other')}
      />
      <SummaryCard
        title="Not Selected"
        value={stats.notSelected.toString()}
        trend={trends.notSelected}
        trendType={trends.notSelected.startsWith('+') ? 'up' : 'down'}
        gradientClasses="bg-gradient-to-br from-pink-200 to-red-300"
        icon={XCircleIcon}
        iconColor="text-red-600 dark:text-red-300"
        onClick={() => handleCardClick('Rejected')}
      />
      <SummaryCard
        title="In Progress"
        value={stats.inProgress.toString()}
        trend={trends.inProgress}
        trendType={trends.inProgress.startsWith('+') ? 'up' : 'down'}
        gradientClasses="bg-gradient-to-br from-yellow-200 to-orange-300"
        icon={ClockIcon}
        iconColor="text-amber-600 dark:text-amber-300"
        onClick={() => handleCardClick('Offer')}
      />
    </div>
  );
} 
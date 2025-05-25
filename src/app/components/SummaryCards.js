'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import {
  CheckCircleIcon,
  XCircleIcon,
  DocumentTextIcon,
  ClockIcon,
  MagnifyingGlassIcon,
} from '@heroicons/react/24/outline';

const SummaryCard = ({ title, value, trend, trendType, gradientClasses, icon: Icon, iconColor, onClick }) => {
  return (
    <div 
      className={`p-6 rounded-2xl shadow-lg cursor-pointer transition-all duration-200 hover:scale-[1.02] ${gradientClasses}`}
      onClick={onClick}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600 dark:text-gray-300">{title}</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{value}</p>
          <div className="flex items-center mt-2">
            <span className={`text-sm font-medium ${
              trendType === 'up' ? 'text-green-600' : 'text-red-600'
            }`}>
              {trend}
            </span>
            <span className="text-sm text-gray-500 dark:text-gray-400 ml-2">vs last month</span>
          </div>
        </div>
        <div className={`p-3 rounded-xl ${iconColor}`}>
          <Icon className="w-8 h-8" />
        </div>
      </div>
    </div>
  );
};

export default function SummaryCards({ summaryStats }) {
  const router = useRouter();

  // Provide default values to prevent errors
  const safeStats = {
    totalApplied: summaryStats?.totalApplied ?? 0,
    interviewScheduled: summaryStats?.interviewScheduled ?? 0,
    noResponse: summaryStats?.noResponse ?? 0,
    notSelected: summaryStats?.notSelected ?? 0,
    inProgress: summaryStats?.inProgress ?? 0,
  };

  const handleCardClick = (status) => {
    try {
      // Encode the status parameter to handle spaces and special characters
      const encodedStatus = encodeURIComponent(status);
      // Navigate to the applications page with the status filter
      router.push(`/applications?status=${encodedStatus}`);
    } catch (error) {
      console.error('Navigation error:', error);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
      <SummaryCard
        title="Total Jobs Applied"
        value={safeStats.totalApplied.toString()}
        trend="+15%"
        trendType="up"
        gradientClasses="bg-gradient-to-r from-blue-100 to-blue-300 dark:from-blue-700 dark:to-blue-900"
        icon={DocumentTextIcon}
        iconColor="text-blue-600 dark:text-blue-300"
        onClick={() => handleCardClick('all')}
      />
      <SummaryCard
        title="Interview Scheduled"
        value={safeStats.interviewScheduled.toString()}
        trend="+5%"
        trendType="up"
        gradientClasses="bg-gradient-to-r from-green-100 to-green-300 dark:from-green-700 dark:to-green-900"
        icon={CheckCircleIcon}
        iconColor="text-green-600 dark:text-green-300"
        onClick={() => handleCardClick('Interview Scheduled')}
      />
      <SummaryCard
        title="No Response"
        value={safeStats.noResponse.toString()}
        trend="-10%"
        trendType="down"
        gradientClasses="bg-gradient-to-r from-gray-100 to-gray-300 dark:from-gray-700 dark:to-gray-900"
        icon={XCircleIcon}
        iconColor="text-gray-600 dark:text-gray-300"
        onClick={() => handleCardClick('No Response')}
      />
      <SummaryCard
        title="Not Selected"
        value={safeStats.notSelected.toString()}
        trend="-2%"
        trendType="down"
        gradientClasses="bg-gradient-to-r from-red-100 to-red-300 dark:from-red-700 dark:to-red-900"
        icon={XCircleIcon}
        iconColor="text-red-600 dark:text-red-300"
        onClick={() => handleCardClick('Rejected')}
      />
      <SummaryCard
        title="In Progress"
        value={safeStats.inProgress.toString()}
        trend="+8%"
        trendType="up"
        gradientClasses="bg-gradient-to-r from-amber-100 to-amber-300 dark:from-amber-700 dark:to-amber-900"
        icon={ClockIcon}
        iconColor="text-amber-600 dark:text-amber-300"
        onClick={() => handleCardClick('In Progress')}
      />
    </div>
  );
} 
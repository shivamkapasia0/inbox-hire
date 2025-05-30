"use client";
import React, { useState, useEffect } from 'react';
import Image from "next/image";
import Header from './components/Header';
import DashboardHeader from './components/DashboardHeader';
import SummaryCards from './components/SummaryCards';
import DashboardSection from './components/DashboardSection';
import WorkingType from './components/WorkingType';
import ApplicationsTable from './components/ApplicationsTable';
import NotQualifiedOverview from './components/NotQualifiedOverview';
import ImpressionsChart from './components/ImpressionsChart';
import SettingsPage from './components/SettingsPage';
import ApplicationsPage from './components/ApplicationsPage';
import { MdOutlineDocumentScanner } from 'react-icons/md';
import ApplicationSourceDistribution from './components/ApplicationSourceDistribution';
import { useSettings } from './utils/useSettings';
import { useRealtimeUpdates } from './utils/useRealtimeUpdates';

const getGreeting = () => {
  const hour = new Date().getHours();
  if (hour < 12) return "Good Morning";
  if (hour < 18) return "Good Afternoon";
  return "Good Evening";
};

export default function Home() {
  const [currentPage, setCurrentPage] = useState('home');
  const { settings } = useSettings();
  const { lastUpdate } = useRealtimeUpdates();
  const [refreshKey, setRefreshKey] = useState(0);

  // Handle real-time updates
  useEffect(() => {
    if (lastUpdate) {
      console.log('New email received, refreshing dashboard...');
      setRefreshKey(prev => prev + 1);
    }
  }, [lastUpdate]);

  return (
    <div className="min-h-screen text-gray-900 dark:text-white">
      <Header currentPage={currentPage} setCurrentPage={setCurrentPage} />
      {currentPage === 'settings' ? (
        <SettingsPage />
      ) : currentPage === 'applications' ? (
        <ApplicationsPage />
      ) : (
        <main className="p-4 md:p-5 lg:p-6">
          {/* Greeting and Summary Cards Section */}
          {settings.dashboard?.showSections?.summaryCards && (
            <div className="rounded-lg shadow p-6 bg-white/25 dark:bg-gray-800/25 backdrop-blur-md border border-white/18 dark:border-white/10 rounded-2xl shadow-lg p-5 mb-4">
              <h1 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">
                {getGreeting()}, Welcome back!
              </h1>
              <SummaryCards key={`summary-${refreshKey}`} />
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mt-4 h-full">
            {/* Left Column: Application Type and Application Sources */}
            <div className="lg:col-span-1 space-y-4 flex flex-col h-full min-h-[550px]">
              {settings.dashboard?.showSections?.workingType && (
                <DashboardSection title="Application Type">
                  <WorkingType key={`working-type-${refreshKey}`} />
                </DashboardSection>
              )}

              {settings.dashboard?.showSections?.applicationSources && (
                <DashboardSection title="Application Sources">
                  <ApplicationSourceDistribution key={`sources-${refreshKey}`} />
                </DashboardSection>
              )}
            </div>

            {/* Right Column: Recent Applications */}
            {settings.dashboard?.showSections?.recentApplications && (
              <div className="lg:col-span-2 h-full">
                <DashboardSection 
                  title={
                    <div className="flex items-center gap-2">
                      <MdOutlineDocumentScanner className="w-6 h-6" />
                      <span>Recent Applications</span>
                    </div>
                  }
                  variant="applications"
                  className="h-full"
                >
                  <ApplicationsTable key={`applications-${refreshKey}`} />
                </DashboardSection>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-4">
            {settings.dashboard?.showSections?.jobsOverview && (
              <DashboardSection title="Jobs Applied Overview">
                <NotQualifiedOverview key={`overview-${refreshKey}`} />
              </DashboardSection>
            )}
            {settings.dashboard?.showSections?.impressions && (
              <DashboardSection title="Impressions">
                <ImpressionsChart key={`impressions-${refreshKey}`} />
              </DashboardSection>
            )}
          </div>
        </main>
      )}
      <footer className="text-center py-4 text-sm text-gray-600 dark:text-gray-400 border-t border-gray-200 dark:border-gray-700">
        Powered by <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent font-semibold">Postmark</span> · Inspired by the <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent font-semibold">Dev.to</span> community · Made with <span className="inline-block animate-[heartbeat_1.5s_ease-in-out_infinite]">❤️</span>
      </footer>
    </div>
  );
}

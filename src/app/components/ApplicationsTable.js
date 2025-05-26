'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { getRecentApplications } from '../utils/data';
import ApplicationDetailsModal from './ApplicationDetailsModal';
import { useSettings } from '../utils/useSettings';
import { useRealtimeUpdates } from '../utils/useRealtimeUpdates';

const statusColors = {
  'offer': {
    text: 'text-green-900',
    bg: 'bg-green-200'
  },
  'rejected': {
    text: 'text-red-900',
    bg: 'bg-red-200'
  },
  'interview': {
    text: 'text-blue-900',
    bg: 'bg-blue-200'
  },
  'other': {
    text: 'text-yellow-900',
    bg: 'bg-yellow-200'
  },
};

const ITEMS_PER_PAGE = 5;

export default function ApplicationsTable() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();
  const [filter, setFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedApplication, setSelectedApplication] = useState(null);
  const { settings } = useSettings();
  const { lastUpdate } = useRealtimeUpdates();
  const lastUpdateRef = useRef(lastUpdate);
  const [search, setSearch] = useState('');

  const loadApplications = async () => {
    try {
      console.log('Loading recent applications...');
      const data = await getRecentApplications();
      console.log('Fetched recent applications:', data);
      
      // Sort applications based on settings
      const sortedData = [...data].sort((a, b) => {
        switch (settings.dashboard?.sortOrder || 'newest') {
          case 'newest':
            return new Date(b.date) - new Date(a.date);
          case 'oldest':
            return new Date(a.date) - new Date(b.date);
          case 'company':
            return a.company.localeCompare(b.company);
          case 'status':
            return a.status.localeCompare(b.status);
          default:
            return 0;
        }
      });
      setApplications(sortedData);
      setError(null);
    } catch (err) {
      console.error('Error loading recent applications:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Initial load
  useEffect(() => {
    loadApplications();
  }, [settings.dashboard?.sortOrder]);

  // Handle real-time updates
  useEffect(() => {
    if (lastUpdate && lastUpdate !== lastUpdateRef.current) {
      console.log('New email received in ApplicationsTable, reloading...');
      lastUpdateRef.current = lastUpdate;
      loadApplications();
    }
  }, [lastUpdate]);

  // Auto-refresh based on settings
  useEffect(() => {
    const refreshInterval = settings?.dashboard?.refreshInterval || 5; // Default to 5 minutes if not set
    console.log('Setting up auto-refresh interval:', refreshInterval, 'minutes');
    
    const intervalId = setInterval(() => {
      console.log('Auto-refreshing recent applications...');
      loadApplications();
    }, refreshInterval * 60 * 1000);

    return () => {
      console.log('Cleaning up auto-refresh interval');
      clearInterval(intervalId);
    };
  }, [settings?.dashboard?.refreshInterval]);

  // Refresh on window focus
  useEffect(() => {
    const handleFocus = () => {
      console.log('Window focused, refreshing recent applications...');
      loadApplications();
    };

    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, []);

  if (loading) {
    return (
      <div className="animate-pulse space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-16 bg-gray-200 rounded"></div>
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

  const filteredApplications = applications.filter(app => {
    if (filter === 'all') return true;
    const filterKey = filter.replace(' ', '-').toLowerCase();
    const statusKey = app.status.replace(' ', '-').toLowerCase();
    return filterKey === statusKey;
  });

  const itemsPerPage = settings.dashboard?.itemsPerPage || 10;
  const totalPages = Math.ceil(filteredApplications.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentApplications = filteredApplications.slice(startIndex, endIndex);

  const handleRowClick = (id) => {
    router.push(`/applications/${id}`);
  };

  return (
    <div className="space-y-6">
      {/* Search and Filter */}
      <div className="flex flex-wrap gap-4 items-center justify-between">
        <div className="relative flex-1 min-w-[200px]">
          <input
            type="text"
            placeholder="Search applications..."
            className="w-full px-4 py-3 rounded-xl border border-gray-200/40 dark:border-gray-700/40 bg-gray-50/80 dark:bg-gray-800/80 focus:ring-2 focus:ring-blue-400 focus:border-transparent shadow-sm transition-all duration-200"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <span className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400">
            🔍
          </span>
        </div>
        <select
          className="px-4 py-3 rounded-xl border border-gray-200/40 dark:border-gray-700/40 bg-gray-50/80 dark:bg-gray-800/80 focus:ring-2 focus:ring-blue-400 focus:border-transparent shadow-sm transition-all duration-200"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        >
          <option value="all">All Status</option>
          <option value="interview">Interview</option>
          <option value="offer">Offer</option>
          <option value="rejected">Rejected</option>
          <option value="in-progress">In Progress</option>
        </select>
        <button
          className="px-4 py-2 rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold hover:from-blue-600 hover:to-blue-700 transition-all duration-200 shadow-lg hover:shadow-blue-500/25 transform hover:scale-105"
          onClick={() => router.push('/applications')}
        >
          View All Applications
        </button>
      </div>

      {/* Table */}
      <div className="rounded-2xl overflow-hidden border border-gray-200/40 dark:border-gray-700/40 bg-gradient-to-br from-purple-50/50 to-blue-50/50 dark:from-gray-800/80 dark:to-gray-900/80 shadow-lg">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200/40 dark:divide-gray-700/40">
            <thead>
              <tr className="bg-transparent">
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                  Position
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                  Company
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                  Date
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200/40 dark:divide-gray-700/40">
              {currentApplications.map((application) => (
                <tr
                  key={application.id}
                  onClick={() => handleRowClick(application.id)}
                  className="group bg-transparent cursor-pointer transition-colors duration-200 hover:bg-blue-50/50 dark:hover:bg-gray-700/50"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900 dark:text-white">
                      {application.jobTitle}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-600 dark:text-gray-300">
                      {application.company}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-3 py-1.5 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        application.status === 'interview' 
                          ? 'bg-blue-100/80 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300' 
                          : application.status === 'offer'
                          ? 'bg-green-100/80 text-green-800 dark:bg-green-900/30 dark:text-green-300'
                          : application.status === 'rejected'
                          ? 'bg-red-100/80 text-red-800 dark:bg-red-900/30 dark:text-red-300'
                          : 'bg-gray-100/80 text-gray-800 dark:bg-gray-600/30 dark:text-gray-200'
                      }`}
                    >
                      {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    {new Date(application.date).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-6">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              className={`px-4 py-2 rounded-lg transition-all duration-200 ${
                currentPage === page
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/25'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
              onClick={() => setCurrentPage(page)}
            >
              {page}
            </button>
          ))}
        </div>
      )}

      {currentApplications.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 dark:text-gray-400">No applications found.</p>
        </div>
      )}
    </div>
  );
} 
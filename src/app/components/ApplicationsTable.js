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
    <div className="space-y-4">
      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Position
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Company
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {currentApplications.map((application) => (
              <tr
                key={application.id}
                onClick={() => handleRowClick(application.id)}
                className="hover:bg-gray-50 cursor-pointer transition-colors"
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{application.jobTitle}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-500">{application.company}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${statusColors[application.status].text} ${statusColors[application.status].bg}`}
                  >
                    {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {new Date(application.date).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-between items-center mt-4">
          <button
            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
            disabled={currentPage === 1}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50"
          >
            Previous
          </button>
          <span className="text-sm text-gray-700">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
            disabled={currentPage === totalPages}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
} 
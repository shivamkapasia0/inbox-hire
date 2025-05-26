'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getRecentApplications } from '../utils/data';
import ApplicationDetailsModal from './ApplicationDetailsModal';
import { useSettings } from '../utils/useSettings';

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

  useEffect(() => {
    const loadApplications = async () => {
      try {
        const data = await getRecentApplications();
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
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadApplications();
  }, [settings.dashboard?.sortOrder]);

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
  const currentApplications = filteredApplications.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const filters = ['all', 'interview', 'other', 'offer', 'rejected'];

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const handleRowClick = (applicationId) => {
    router.push(`/applications/${applicationId}`);
  };

  return (
    <div>
      {/* Filter Buttons */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex space-x-3 overflow-x-auto pb-2">
          {filters.map(f => (
            <button
              key={f}
              className={`flex-shrink-0 px-6 py-2 text-sm font-medium rounded-full transition-colors duration-200 ${
                filter.replace(' ', '-').toLowerCase() === f.replace(' ', '-').toLowerCase()
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
              onClick={() => {
                setFilter(f.toLowerCase());
                setCurrentPage(1);
              }}
            >
              {f}
            </button>
          ))}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center space-x-2">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="p-2 text-gray-600 hover:text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label="Previous page"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </button>
            <span className="text-sm text-gray-600">
              {currentPage} / {totalPages}
            </span>
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="p-2 text-gray-600 hover:text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label="Next page"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        )}
      </div>

      {/* Applications Table/Grid */}
      {settings.dashboard?.defaultView === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {currentApplications.map((application) => (
            <div
              key={application.id}
              className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow cursor-pointer"
              onClick={() => handleRowClick(application.id)}
            >
              <h3 className="text-lg font-semibold text-blue-700 mb-2">{application.jobTitle}</h3>
              <p className="text-gray-800 mb-2">{application.company}</p>
              <div className="flex justify-between items-center">
                <span
                  className={`relative inline-block px-3 py-1 font-semibold leading-tight rounded-full ${statusColors[application.status].text} ${statusColors[application.status].bg}`}
                >
                  <span className="relative">{application.status.charAt(0).toUpperCase() + application.status.slice(1)}</span>
                </span>
                <span className="text-sm text-gray-600">{application.date}</span>
              </div>
            </div>
          ))}
        </div>
      ) : settings.dashboard?.defaultView === 'compact' ? (
        <div className="space-y-2">
          {currentApplications.map((application) => (
            <div
              key={application.id}
              className="flex items-center justify-between bg-white rounded-lg shadow-sm p-3 hover:bg-gray-50 transition-colors cursor-pointer"
              onClick={() => handleRowClick(application.id)}
            >
              <div className="flex items-center space-x-4">
                <span className="text-gray-500">#{application.id}</span>
                <div>
                  <h3 className="text-sm font-medium text-blue-700">{application.jobTitle}</h3>
                  <p className="text-xs text-gray-600">{application.company}</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <span
                  className={`relative inline-block px-2 py-1 text-xs font-semibold leading-tight rounded-full ${statusColors[application.status].text} ${statusColors[application.status].bg}`}
                >
                  <span className="relative">{application.status.charAt(0).toUpperCase() + application.status.slice(1)}</span>
                </span>
                <span className="text-xs text-gray-500">{application.date}</span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="overflow-x-auto">
          <div className="h-[384px] relative">
            <table className="min-w-full leading-normal">
              <thead className="sticky top-0 z-10 bg-gray-100/80 dark:bg-gray-700/80">
                <tr className="rounded-t-lg">
                  <th className="px-5 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider first:rounded-tl-lg">
                    #
                  </th>
                  <th className="px-5 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                    Job Title
                  </th>
                  <th className="px-5 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                    Company
                  </th>
                  <th className="px-5 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-5 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider last:rounded-tr-lg">
                    Date
                  </th>
                </tr>
              </thead>
              <tbody className="overflow-y-auto">
                {currentApplications.map((application, index) => (
                  <tr 
                    key={application.id} 
                    className="bborder-gray-200/50 bg-gray-50/30 hover:bg-gray-50 transition-colors duration-150 h-16 cursor-pointer"
                    onClick={() => handleRowClick(application.id)}
                  >
                    <td className="px-5 py-4 text-sm">
                      <p className="text-gray-900 whitespace-no-wrap">{application.id}</p>
                    </td>
                    <td className="px-5 py-4 text-sm">
                      <p className="text-blue-700 whitespace-no-wrap font-medium">{application.jobTitle}</p>
                    </td>
                    <td className="px-5 py-4 text-sm">
                      <p className="text-gray-800 whitespace-no-wrap">{application.company}</p>
                    </td>
                    <td className="px-5 py-4 text-sm">
                      <span
                        className={`relative inline-block px-3 py-1 font-semibold leading-tight rounded-full ${statusColors[application.status].text} ${statusColors[application.status].bg}`}
                      >
                        <span className="relative">{application.status.charAt(0).toUpperCase() + application.status.slice(1)}</span>
                      </span>
                    </td>
                    <td className="px-5 py-4 text-sm">
                      <p className="text-gray-800 whitespace-no-wrap">{application.date}</p>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Application Details Modal */}
      {selectedApplication && (
        <ApplicationDetailsModal
          application={selectedApplication}
          onClose={() => setSelectedApplication(null)}
        />
      )}
    </div>
  );
} 
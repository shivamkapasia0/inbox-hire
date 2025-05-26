'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getRecentApplications } from '../utils/data';
import ApplicationDetailsModal from './ApplicationDetailsModal';

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

  useEffect(() => {
    const loadApplications = async () => {
      try {
        const data = await getRecentApplications();
        setApplications(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadApplications();
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

  const totalPages = Math.ceil(filteredApplications.length / ITEMS_PER_PAGE);
  const currentApplications = filteredApplications.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
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

      {/* Applications Table */}
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
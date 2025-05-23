'use client';

import { useState, useMemo } from 'react';

// Placeholder data - replace with actual data fetching later
const applications = [
  { id: 1, jobTitle: 'Software Engineer', company: 'Tech Solutions', status: 'Offer Letters', date: '2024-05-15' },
  { id: 2, jobTitle: 'Data Analyst', company: 'Data Insights', status: 'Interview Scheduled', date: '2024-05-14' },
  { id: 3, jobTitle: 'Product Manager', company: 'Innovate Labs', status: 'No Response', date: '2024-05-12' },
  { id: 4, jobTitle: 'UX Researcher', company: 'Creative Minds', status: 'Offer Letters', date: '2024-05-10' },
  { id: 5, jobTitle: 'DevOps Engineer', company: 'Cloud Services', status: 'Rejected', date: '2024-05-08' },
  { id: 6, jobTitle: 'Marketing Specialist', company: 'Growth Agency', status: 'No Response', date: '2024-05-05' },
  { id: 7, jobTitle: 'Sales Representative', company: 'BizConnect', status: 'Interview Scheduled', date: '2024-05-03' },
   { id: 8, jobTitle: 'HR Coordinator', company: 'People Solutions', status: 'Offer Letters', date: '2024-05-01' },
   { id: 9, jobTitle: 'System Administrator', company: 'IT Services', status: 'Rejected', date: '2024-04-28' },
   { id: 10, jobTitle: 'Business Analyst', company: 'Consulting Group', status: 'No Response', date: '2024-04-25' },
   { id: 11, jobTitle: 'Frontend Developer', company: 'Web Builders', status: 'Interview Scheduled', date: '2024-04-20' },
   { id: 12, jobTitle: 'Backend Developer', company: 'Server Side', status: 'Offer Letters', date: '2024-04-18' },
   { id: 13, jobTitle: 'Mobile Developer', company: 'App Solutions', status: 'Rejected', date: '2024-04-16' },
   { id: 14, jobTitle: 'Data Scientist', company: 'AI Labs', status: 'Interview Scheduled', date: '2024-04-14' },
];

const statusColors = {
  'Offer Letters': {
    text: 'text-green-900',
    bg: 'bg-green-200'
  },
  'Rejected': {
    text: 'text-red-900',
    bg: 'bg-red-200'
  },
  'Interview Scheduled': {
    text: 'text-blue-900',
    bg: 'bg-blue-200'
  },
  'No Response': {
    text: 'text-yellow-900',
    bg: 'bg-yellow-200'
  },
};

const ITEMS_PER_PAGE = 5;

export default function ApplicationsTable() {
  const [filter, setFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);

  const filteredApplications = useMemo(() => {
    const filtered = applications.filter(app => {
      if (filter === 'all') return true;
      const filterKey = filter.replace(' ', '-').toLowerCase();
      const statusKey = app.status.replace(' ', '-').toLowerCase();
      return filterKey === statusKey;
    });
    // Always include 'Rejected' in the filter options, even if not explicitly listed in `filters` array
     const rejectedFilterKey = 'rejected';
    if (filter === rejectedFilterKey) {
        return applications.filter(app => app.status.replace(' ', '-').toLowerCase() === rejectedFilterKey);
    }
    return filtered;
  }, [filter]);


  const totalPages = Math.ceil(filteredApplications.length / ITEMS_PER_PAGE);
  const currentApplications = filteredApplications.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const filters = ['All', 'Interview Scheduled', 'No Response', 'Offer Letters', 'Rejected'];

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
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
                <tr key={application.id} className="bborder-gray-200/50 bg-gray-50/30 hover:bg-gray-50 transition-colors duration-150 h-16">
                  <td className="px-5 py-4 text-sm">
                    <p className="text-gray-900 whitespace-no-wrap">{application.id}</p>
                  </td>
                  <td className="px-5 py-4 text-sm">
                    <a href="#" className="text-blue-700 hover:underline whitespace-no-wrap font-medium">{application.jobTitle}</a>
                  </td>
                  <td className="px-5 py-4 text-sm">
                    <p className="text-gray-800 whitespace-no-wrap">{application.company}</p>
                  </td>
                  <td className="px-5 py-4 text-sm">
                    <span
                      className={`relative inline-block px-3 py-1 font-semibold leading-tight rounded-full ${statusColors[application.status].text} ${statusColors[application.status].bg}`}
                    >
                      <span className="relative">{application.status}</span>
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
    </div>
  );
} 
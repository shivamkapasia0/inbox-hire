export default function ApplicantsTable() {
  // Placeholder data - replace with actual data fetching later
  const applicants = [
    { id: 1, photo: '/placeholder-avatar.png', name: 'William Olguin', role: 'UI Designer', status: 'Full Time', date: '06.05.2024' },
    { id: 2, photo: '/placeholder-avatar.png', name: 'Nicolas Williamson', role: 'Mobile Dev', status: 'Part Time', date: '07.05.2024' },
    { id: 3, photo: '/placeholder-avatar.png', name: 'Sara Cunningham', role: 'HTML Dev', status: 'Part Time', date: '08.05.2024' },
    { id: 4, photo: '/placeholder-avatar.png', name: 'Laurel Lawson', role: 'UX Designer', status: 'Full Time', date: '09.05.2024' },
  ];

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full leading-normal">
        <thead>
          <tr>
            <th className="px-5 py-3 border-b-2 border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-gray-700 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
              No.
            </th>
            <th className="px-5 py-3 border-b-2 border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-gray-700 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
              Photo
            </th>
            <th className="px-5 py-3 border-b-2 border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-gray-700 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
              Name
            </th>
            <th className="px-5 py-3 border-b-2 border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-gray-700 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
              Role
            </th>
            <th className="px-5 py-3 border-b-2 border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-gray-700 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
              Status
            </th>
            <th className="px-5 py-3 border-b-2 border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-gray-700 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
              Date
            </th>
          </tr>
        </thead>
        <tbody>
          {applicants.map((applicant) => (
            <tr key={applicant.id}>
              <td className="px-5 py-5 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm">
                <p className="text-gray-900 dark:text-white whitespace-no-wrap">{applicant.id.toString().padStart(2, '0')}</p>
              </td>
              <td className="px-5 py-5 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm">
                {/* Placeholder Image */}
                <div className="flex-shrink-0 w-10 h-10">
                  <img className="w-full h-full rounded-full"
                       src={applicant.photo} alt={`Photo of ${applicant.name}`} />
                </div>
              </td>
              <td className="px-5 py-5 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm">
                <p className="text-gray-900 dark:text-white whitespace-no-wrap">{applicant.name}</p>
              </td>
              <td className="px-5 py-5 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm">
                <p className="text-gray-900 dark:text-white whitespace-no-wrap">{applicant.role}</p>
              </td>
              <td className="px-5 py-5 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm">
                <span
                  className="relative inline-block px-3 py-1 font-semibold text-green-900 leading-tight">
                  <span aria-hidden="true" className="absolute inset-0 bg-green-200 opacity-50 rounded-full"></span>
                  <span className="relative">{applicant.status}</span>
                </span>
              </td>
              <td className="px-5 py-5 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm">
                <p className="text-gray-900 dark:text-white whitespace-no-wrap">{applicant.date}</p>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
} 
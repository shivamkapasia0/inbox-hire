// src/app/components/UpcomingInterviews.js
import React from 'react';

const demoInterviews = [
  {
    id: 1,
    jobTitle: 'Software Engineer',
    company: 'Innovate Solutions',
    date: '2024-06-10',
    time: '10:00 AM',
  },
  {
    id: 2,
    jobTitle: 'Data Scientist',
    company: 'Data Insights Corp.',
    date: '2024-06-12',
    time: '02:30 PM',
  },
  {
    id: 3,
    jobTitle: 'UX Designer',
    company: 'Creative Agency',
    date: '2024-06-15',
    time: '11:00 AM',
  },
];

export default function UpcomingInterviews() {
    const handleInterviewClick = (interview) => {
        console.log('Clicked on interview:', interview);
        // TODO: Implement navigation or other action here
    };

  return (
    <div className="p-4">
      <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">Upcoming Interviews</h3>
      {
        demoInterviews.length > 0 ? (
          <ul className="space-y-4">
            {demoInterviews.map(interview => (
              <li key={interview.id} className="border-b border-gray-200 pb-4 last:border-b-0 last:pb-0">
                <button
                  className="flex justify-between items-center w-full text-left focus:outline-none hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md p-2 -m-2 transition-colors duration-150"
                  onClick={() => handleInterviewClick(interview)}
                >
                  <div>
                    <p className="text-gray-900 dark:text-white font-medium">{interview.jobTitle}</p>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">{interview.company}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-gray-800 dark:text-gray-200 text-sm">{interview.date}</p>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">{interview.time}</p>
                  </div>
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-600 dark:text-gray-400">No upcoming interviews scheduled.</p>
        )
      }
    </div>
  );
}
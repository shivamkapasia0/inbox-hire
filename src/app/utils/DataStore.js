'use client';

import React, { createContext, useContext, useState } from 'react';

// Initial data state
const initialData = {
  // Summary Cards Data
  summaryStats: {
    totalJobsApplied: 1250,
    interviewsScheduled: 45,
    noResponse: 900,
    notSelected: 300,
    inProgress: 85,
  },

  // Applications Table Data
  applications: [
    {
      id: 1,
      company: 'Tech Solutions',
      name: 'John Doe',
      position: 'Senior Developer',
      status: 'Interview Scheduled',
      date: '2024-06-01',
      lastUpdate: '2024-06-01',
      experience: '5 years',
      location: 'New York',
      source: 'LinkedIn',
    },
    {
      id: 2,
      company: 'Data Insights',
      name: 'Jane Smith',
      position: 'Data Analyst',
      status: 'No Response',
      date: '2024-05-28',
      lastUpdate: '2024-05-28',
      experience: '3 years',
      location: 'San Francisco',
      source: 'Referral',
    },
    {
      id: 3,
      company: 'Innovate Labs',
      name: 'Alice Johnson',
      position: 'Product Manager',
      status: 'Offer Letters',
      date: '2024-05-25',
      lastUpdate: '2024-05-25',
      experience: '6 years',
      location: 'Austin',
      source: 'Company Website',
    },
    {
      id: 4,
      company: 'Creative Minds',
      name: 'Bob Lee',
      position: 'UX Designer',
      status: 'Rejected',
      date: '2024-05-20',
      lastUpdate: '2024-05-20',
      experience: '4 years',
      location: 'Seattle',
      source: 'AngelList',
    },
    {
      id: 5,
      company: 'Growth Agency',
      name: 'Charlie Kim',
      position: 'Marketing Specialist',
      status: 'In Progress',
      date: '2024-05-18',
      lastUpdate: '2024-05-18',
      experience: '2 years',
      location: 'Chicago',
      source: 'Indeed',
    },
    {
      id: 6,
      company: 'Cloud Services',
      name: 'Diana Prince',
      position: 'DevOps Engineer',
      status: 'Interview Scheduled',
      date: '2024-05-15',
      lastUpdate: '2024-05-15',
      experience: '5 years',
      location: 'Boston',
      source: 'LinkedIn',
    },
    {
      id: 7,
      company: 'Web Builders',
      name: 'Ethan Hunt',
      position: 'Frontend Developer',
      status: 'No Response',
      date: '2024-05-10',
      lastUpdate: '2024-05-10',
      experience: '3 years',
      location: 'Denver',
      source: 'Indeed',
    },
    {
      id: 8,
      company: 'People Solutions',
      name: 'Fiona Gallagher',
      position: 'HR Coordinator',
      status: 'Offer Letters',
      date: '2024-05-08',
      lastUpdate: '2024-05-08',
      experience: '4 years',
      location: 'Miami',
      source: 'Referral',
    },
    {
      id: 9,
      company: 'IT Services',
      name: 'George Lucas',
      position: 'System Administrator',
      status: 'Rejected',
      date: '2024-05-05',
      lastUpdate: '2024-05-05',
      experience: '6 years',
      location: 'Dallas',
      source: 'Company Website',
    },
    {
      id: 10,
      company: 'Consulting Group',
      name: 'Hannah Brown',
      position: 'Business Analyst',
      status: 'In Progress',
      date: '2024-05-01',
      lastUpdate: '2024-05-01',
      experience: '2 years',
      location: 'Atlanta',
      source: 'LinkedIn',
    },
  ],

  // Impression Funnel Data
  impressionFunnelData: {
    stages: [
      {
        label: 'Total Jobs Applied',
        value: 100,
        color: 'rgb(59, 130, 246)', // blue-500
        description: 'Total jobs you have applied to'
      },
      {
        label: 'Interview Scheduled',
        value: 20,
        color: 'rgb(245, 158, 11)', // amber-500
        description: 'Interviews you have scheduled'
      },
      {
        label: 'No Response',
        value: 60,
        color: 'rgb(156, 163, 175)', // gray-400
        description: 'Applications with no response'
      },
      {
        label: 'Not Selected',
        value: 20,
        color: 'rgb(239, 68, 68)', // red-500
        description: 'Applications where you were not selected'
      }
    ],
    conversionRates: {
      interviewRate: 20,
      noResponseRate: 60,
      notSelectedRate: 20
    }
  },

  // Chart Data
  impressionsData: {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Impressions',
        data: [1200, 1900, 1500, 2100, 1800, 2400],
      },
    ],
  },

  // Total Jobs Applied Data
  jobsAppliedData: {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Total Jobs Applied',
        data: [450, 620, 580, 720, 680, 850],
      },
    ],
  },

  // Working Type Data
  workingTypes: {
    remote: 45,
    hybrid: 30,
    onsite: 25,
  },

  // Upcoming Interviews
  upcomingInterviews: [
    {
      id: 1,
      candidate: 'Alice Smith',
      position: 'Frontend Developer',
      date: '2024-03-20',
      time: '10:00 AM',
      type: 'Technical',
    },
    // Add more interview data as needed
  ],
};

// Create the context
const DataStoreContext = createContext();

// Provider component
export function DataStoreProvider({ children }) {
  const [data, setData] = useState(initialData);

  // Function to update specific data
  const updateData = (key, newData) => {
    setData(prevData => ({
      ...prevData,
      [key]: newData,
    }));
  };

  return (
    <DataStoreContext.Provider value={{ data, updateData }}>
      {children}
    </DataStoreContext.Provider>
  );
}

// Custom hook to use the data store
export function useDataStore() {
  const context = useContext(DataStoreContext);
  if (context === undefined) {
    throw new Error('useDataStore must be used within a DataStoreProvider');
  }
  return context;
} 
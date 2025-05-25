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
      name: 'John Doe',
      position: 'Senior Developer',
      status: 'Applied',
      date: '2024-03-15',
      experience: '5 years',
      location: 'New York',
    },
    // Add more application data as needed
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
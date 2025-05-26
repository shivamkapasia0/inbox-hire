"use client";
import { useState } from 'react';

const defaultSettings = {
  parsing: {
    rejectionKeywords: ['unfortunately', 'not selected', 'regret to inform', 'not moving forward', 'not a fit'],
    interviewKeywords: ['interview', 'calendar invite', 'schedule a call', 'technical discussion', 'screening'],
    offerKeywords: ['offer', 'position', 'congrats', 'welcome aboard', 'joining', 'compensation'],
    notSelectedKeywords: ['not selected', 'other candidates', 'better fit', 'not proceeding'],
    noResponseKeywords: ['following up', 'checking in', 'haven\'t heard back'],
    inProgressKeywords: ['application received', 'under review', 'processing', 'screening'],
    noResponseDays: 7,
    enableCustom: false,
    customKeywords: [],
  },
  dashboard: {
    groupBy: 'Status',
    showRejected: true,
    showCharts: true,
    theme: 'System',
    defaultView: 'list',
    itemsPerPage: 10,
    sortOrder: 'newest',
    showSections: {
      summaryCards: true,
      workingType: true,
      applicationSources: true,
      recentApplications: true,
      jobsOverview: true,
      impressions: true
    },
    dateFormat: 'MMM DD, YYYY',
    timeZone: 'local',
    compactMode: false,
    showTrends: true,
    showPercentages: true,
    showEmptyStates: true,
    refreshInterval: 5, // minutes
  },
  api: {
    geminiKey: '',
  },
};

export function useSettings() {
  const [settings, setSettings] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('appSettings');
      const parsedSettings = saved ? JSON.parse(saved) : defaultSettings;
      // Ensure api section exists
      return {
        ...defaultSettings,
        ...parsedSettings,
        api: {
          ...defaultSettings.api,
          ...(parsedSettings.api || {}),
        },
      };
    }
    return defaultSettings;
  });

  const saveSettings = (newSettings) => {
    // Ensure api section exists before saving
    const settingsToSave = {
      ...defaultSettings,
      ...newSettings,
      api: {
        ...defaultSettings.api,
        ...(newSettings.api || {}),
      },
    };
    setSettings(settingsToSave);
    if (typeof window !== 'undefined') {
      localStorage.setItem('appSettings', JSON.stringify(settingsToSave));
    }
  };

  return { settings, setSettings, saveSettings, defaultSettings };
} 
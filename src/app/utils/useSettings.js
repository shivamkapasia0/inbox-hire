"use client";
import { useState, useEffect, createContext, useContext } from 'react';

const SettingsContext = createContext();

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

export function SettingsProvider({ children }) {
  const [settings, setSettings] = useState(defaultSettings);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await fetch('/api/settings');
        if (!response.ok) {
          throw new Error('Failed to fetch settings');
        }
        const data = await response.json();
        setSettings(data);
      } catch (err) {
        console.error('Error fetching settings:', err);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSettings();
  }, []);

  const saveSettings = async (newSettings) => {
    try {
      // Ensure api section exists before saving
      const settingsToSave = {
        ...defaultSettings,
        ...newSettings,
        api: {
          ...defaultSettings.api,
          ...(newSettings.api || {}),
        },
      };

      const response = await fetch('/api/settings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(settingsToSave),
      });

      if (!response.ok) {
        throw new Error('Failed to save settings');
      }

      const savedSettings = await response.json();
      setSettings(savedSettings);
      return savedSettings;
    } catch (err) {
      console.error('Error saving settings:', err);
      setError(err.message);
      throw err;
    }
  };

  return (
    <SettingsContext.Provider value={{ settings, setSettings, saveSettings, defaultSettings, isLoading, error }}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
} 
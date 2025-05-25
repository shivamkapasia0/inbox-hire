"use client";
import { useState } from 'react';

const defaultSettings = {
  postmark: {
    inboundEmail: '',
    webhookUrl: '',
    serverToken: '',
  },
  parsing: {
    rejectionKeywords: ['unfortunately', 'not selected'],
    interviewKeywords: ['interview', 'calendar invite'],
    offerKeywords: ['offer', 'position', 'congrats'],
    enableCustom: false,
  },
  dashboard: {
    groupBy: 'Status',
    showRejected: true,
    showCharts: true,
    theme: 'System',
  },
};

export function useSettings() {
  const [settings, setSettings] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('appSettings');
      return saved ? JSON.parse(saved) : defaultSettings;
    }
    return defaultSettings;
  });

  const saveSettings = (newSettings) => {
    setSettings(newSettings);
    if (typeof window !== 'undefined') {
      localStorage.setItem('appSettings', JSON.stringify(newSettings));
    }
  };

  return { settings, setSettings, saveSettings, defaultSettings };
} 
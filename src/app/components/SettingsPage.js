"use client";
import React, { useState } from 'react';
import { MdTune, MdDashboard, MdStorage, MdHelp, MdApi, MdInfo } from 'react-icons/md';
import { useSettings } from '../utils/useSettings';
import { useToast } from './ToastProvider';
import ApiKeyInput from './ApiKeyInput';

const HelpIcon = ({ helpText }) => {
  const [showTooltip, setShowTooltip] = useState(false);

  return (
    <div className="relative inline-block">
      <MdInfo 
        className="w-5 h-5 text-gray-400 hover:text-gray-600 cursor-help"
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
      />
      {showTooltip && (
        <div className="absolute z-50 left-1/2 transform -translate-x-1/2 bottom-full mb-2 px-3 py-2 bg-gray-900 text-white text-sm rounded-lg shadow-lg whitespace-nowrap">
          {helpText}
          <div className="absolute left-1/2 transform -translate-x-1/2 top-full w-2 h-2 bg-gray-900 rotate-45"></div>
        </div>
      )}
    </div>
  );
};

export default function SettingsPage() {
  const { settings, setSettings, saveSettings, defaultSettings } = useSettings();
  const [showClearModal, setShowClearModal] = useState(false);
  const [showResetModal, setShowResetModal] = useState(false);
  const [importError, setImportError] = useState('');
  const { showToast } = useToast();

  // Handlers
  const handleChange = (section, field, value) => {
    setSettings(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value,
      },
    }));
  };

  const handleParsingKeywords = (field, value) => {
    setSettings(prev => ({
      ...prev,
      parsing: {
        ...prev.parsing,
        [field]: value.split(',').map(s => s.trim()).filter(Boolean),
      },
    }));
  };

  const handleSaveAll = () => {
    saveSettings(settings);
    showToast('Settings saved!', 'success');
  };

  const handleImport = e => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = evt => {
      try {
        const imported = JSON.parse(evt.target.result);
        setSettings(imported);
        saveSettings(imported);
        setImportError('');
        showToast('Settings imported!', 'success');
      } catch {
        setImportError('Invalid file format.');
        showToast('Invalid file format.', 'error');
      }
    };
    reader.readAsText(file);
  };

  const handleExport = () => {
    const blob = new Blob([JSON.stringify(settings, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'applications-settings.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleClear = () => {
    localStorage.removeItem('appSettings');
    setSettings(defaultSettings);
    setShowClearModal(false);
    showToast('All applications cleared!', 'success');
  };

  const handleReset = () => {
    localStorage.removeItem('appSettings');
    setSettings(defaultSettings);
    setShowResetModal(false);
    showToast('All settings reset!', 'success');
  };

  const handleApiKeyChange = (value) => {
    setSettings(prev => ({
      ...prev,
      api: {
        ...prev.api,
        geminiKey: value
      }
    }));
  };

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 md:px-6 space-y-8">
      <h1 className="text-3xl md:text-4xl font-bold mb-8 text-center text-gray-900 dark:text-white tracking-tight">Settings</h1>
      
      {/* Email Parsing Settings */}
      <section className="p-6 rounded-2xl shadow-xl bg-white/80 dark:bg-gray-900/80 border border-gray-200/40 backdrop-blur-md">
        <div className="flex items-center gap-2 mb-6">
          <MdTune className="w-7 h-7 text-amber-500" />
          <h2 className="text-xl font-semibold">Email Parsing Settings</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <label className="block font-medium mb-2 flex items-center gap-2">
                Rejection Keywords
                <HelpIcon helpText="Keywords that indicate a rejection email" />
              </label>
              <textarea
                className="w-full p-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                value={settings.parsing.rejectionKeywords.join(', ')}
                onChange={e => handleParsingKeywords('rejectionKeywords', e.target.value)}
                rows={3}
                placeholder="Enter keywords separated by commas"
              />
            </div>

            <div>
              <label className="block font-medium mb-2 flex items-center gap-2">
                Interview Keywords
                <HelpIcon helpText="Keywords that indicate an interview request" />
              </label>
              <textarea
                className="w-full p-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                value={settings.parsing.interviewKeywords.join(', ')}
                onChange={e => handleParsingKeywords('interviewKeywords', e.target.value)}
                rows={3}
                placeholder="Enter keywords separated by commas"
              />
            </div>

            <div>
              <label className="block font-medium mb-2 flex items-center gap-2">
                Offer Keywords
                <HelpIcon helpText="Keywords that indicate a job offer" />
              </label>
              <textarea
                className="w-full p-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                value={settings.parsing.offerKeywords.join(', ')}
                onChange={e => handleParsingKeywords('offerKeywords', e.target.value)}
                rows={3}
                placeholder="Enter keywords separated by commas"
              />
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block font-medium mb-2 flex items-center gap-2">
                Not Selected Keywords
                <HelpIcon helpText="Keywords that indicate not being selected" />
              </label>
              <textarea
                className="w-full p-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                value={settings.parsing.notSelectedKeywords.join(', ')}
                onChange={e => handleParsingKeywords('notSelectedKeywords', e.target.value)}
                rows={3}
                placeholder="Enter keywords separated by commas"
              />
            </div>

            <div>
              <label className="block font-medium mb-2 flex items-center gap-2">
                No Response Keywords
                <HelpIcon helpText="Keywords that indicate no response" />
              </label>
              <textarea
                className="w-full p-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                value={settings.parsing.noResponseKeywords.join(', ')}
                onChange={e => handleParsingKeywords('noResponseKeywords', e.target.value)}
                rows={3}
                placeholder="Enter keywords separated by commas"
              />
            </div>

            <div>
              <label className="block font-medium mb-2 flex items-center gap-2">
                In Progress Keywords
                <HelpIcon helpText="Keywords that indicate application is in progress" />
              </label>
              <textarea
                className="w-full p-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                value={settings.parsing.inProgressKeywords.join(', ')}
                onChange={e => handleParsingKeywords('inProgressKeywords', e.target.value)}
                rows={3}
                placeholder="Enter keywords separated by commas"
              />
            </div>

            <div>
              <label className="block font-medium mb-2 flex items-center gap-2">
                Days Until Considered No Response
                <HelpIcon helpText="Applications will be marked as 'No Response' after this many days" />
              </label>
              <input
                type="number"
                min="1"
                max="90"
                className="w-full p-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                value={settings.parsing.noResponseDays}
                onChange={e => {
                  const value = parseInt(e.target.value);
                  handleChange('parsing', 'noResponseDays', isNaN(value) ? 7 : Math.max(1, Math.min(90, value)));
                }}
              />
            </div>
          </div>
        </div>

        <div className="mt-6 flex items-center">
          <input
            type="checkbox"
            id="enableCustom"
            checked={settings.parsing.enableCustom}
            onChange={e => handleChange('parsing', 'enableCustom', e.target.checked)}
            className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
          />
          <label htmlFor="enableCustom" className="ml-2 text-sm font-medium text-gray-700 dark:text-gray-300">
            Enable custom keyword matching
          </label>
        </div>
      </section>

      {/* Dashboard Preferences */}
      <section className="p-6 rounded-2xl shadow-xl bg-white/80 dark:bg-gray-900/80 border border-gray-200/40 backdrop-blur-md">
        <div className="flex items-center gap-2 mb-6">
          <MdDashboard className="w-7 h-7 text-purple-500" />
          <h2 className="text-xl font-semibold">Dashboard Preferences</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <label className="block font-medium mb-2 flex items-center gap-2">
                Default View
                <HelpIcon helpText="Choose how applications are displayed by default" />
              </label>
              <select
                className="w-full p-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                value={settings.dashboard.defaultView}
                onChange={e => handleChange('dashboard', 'defaultView', e.target.value)}
              >
                <option value="list">List View</option>
                <option value="grid">Grid View</option>
                <option value="compact">Compact View</option>
              </select>
            </div>

            <div>
              <label className="block font-medium mb-2 flex items-center gap-2">
                Items Per Page
                <HelpIcon helpText="Number of applications to show per page" />
              </label>
              <select
                className="w-full p-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                value={settings.dashboard.itemsPerPage}
                onChange={e => handleChange('dashboard', 'itemsPerPage', parseInt(e.target.value))}
              >
                <option value="5">5 items</option>
                <option value="10">10 items</option>
                <option value="20">20 items</option>
                <option value="50">50 items</option>
              </select>
            </div>

            <div>
              <label className="block font-medium mb-2 flex items-center gap-2">
                Sort Order
                <HelpIcon helpText="Default sorting order for applications" />
              </label>
              <select
                className="w-full p-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                value={settings.dashboard.sortOrder}
                onChange={e => handleChange('dashboard', 'sortOrder', e.target.value)}
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="company">Company Name</option>
                <option value="status">Status</option>
              </select>
            </div>

            <div>
              <label className="block font-medium mb-2 flex items-center gap-2">
                Date Format
                <HelpIcon helpText="How dates are displayed throughout the application" />
              </label>
              <select
                className="w-full p-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                value={settings.dashboard.dateFormat}
                onChange={e => handleChange('dashboard', 'dateFormat', e.target.value)}
              >
                <option value="MMM DD, YYYY">Mar 20, 2024</option>
                <option value="DD/MM/YYYY">20/03/2024</option>
                <option value="MM/DD/YYYY">03/20/2024</option>
                <option value="YYYY-MM-DD">2024-03-20</option>
              </select>
            </div>

            <div>
              <label className="block font-medium mb-2 flex items-center gap-2">
                Time Zone
                <HelpIcon helpText="Time zone for displaying dates and times" />
              </label>
              <select
                className="w-full p-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                value={settings.dashboard.timeZone}
                onChange={e => handleChange('dashboard', 'timeZone', e.target.value)}
              >
                <option value="local">Local Time</option>
                <option value="UTC">UTC</option>
                <option value="America/New_York">Eastern Time</option>
                <option value="America/Chicago">Central Time</option>
                <option value="America/Denver">Mountain Time</option>
                <option value="America/Los_Angeles">Pacific Time</option>
              </select>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block font-medium mb-2 flex items-center gap-2">
                Refresh Interval
                <HelpIcon helpText="How often to automatically refresh dashboard data" />
              </label>
              <select
                className="w-full p-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                value={settings.dashboard.refreshInterval}
                onChange={e => handleChange('dashboard', 'refreshInterval', parseInt(e.target.value))}
              >
                <option value="1">Every minute</option>
                <option value="5">Every 5 minutes</option>
                <option value="15">Every 15 minutes</option>
                <option value="30">Every 30 minutes</option>
                <option value="60">Every hour</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="block font-medium mb-2">Visible Sections</label>
              <div className="space-y-2">
                {Object.entries(settings.dashboard?.showSections || defaultSettings.dashboard.showSections).map(([section, isVisible]) => (
                  <div key={section} className="flex items-center">
                    <input
                      type="checkbox"
                      id={`show-${section}`}
                      checked={isVisible}
                      onChange={e => handleChange('dashboard', 'showSections', {
                        ...(settings.dashboard?.showSections || defaultSettings.dashboard.showSections),
                        [section]: e.target.checked
                      })}
                      className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                    />
                    <label htmlFor={`show-${section}`} className="ml-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                      {section.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <label className="block font-medium mb-2">Display Options</label>
              <div className="space-y-2">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="showTrends"
                    checked={settings.dashboard.showTrends}
                    onChange={e => handleChange('dashboard', 'showTrends', e.target.checked)}
                    className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                  />
                  <label htmlFor="showTrends" className="ml-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                    Show Trends
                  </label>
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="showPercentages"
                    checked={settings.dashboard.showPercentages}
                    onChange={e => handleChange('dashboard', 'showPercentages', e.target.checked)}
                    className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                  />
                  <label htmlFor="showPercentages" className="ml-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                    Show Percentages
                  </label>
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="showEmptyStates"
                    checked={settings.dashboard.showEmptyStates}
                    onChange={e => handleChange('dashboard', 'showEmptyStates', e.target.checked)}
                    className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                  />
                  <label htmlFor="showEmptyStates" className="ml-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                    Show Empty States
                  </label>
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="compactMode"
                    checked={settings.dashboard.compactMode}
                    onChange={e => handleChange('dashboard', 'compactMode', e.target.checked)}
                    className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                  />
                  <label htmlFor="compactMode" className="ml-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                    Compact Mode
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* API Settings */}
      <section className="p-6 rounded-2xl shadow-xl bg-white/80 dark:bg-gray-900/80 border border-gray-200/40 backdrop-blur-md">
        <div className="flex items-center gap-2 mb-6">
          <MdApi className="w-7 h-7 text-green-500" />
          <h2 className="text-xl font-semibold">API Settings</h2>
        </div>
        
        <div className="space-y-4">
          <div>
            <label className="block font-medium mb-2">
              Gemini API Key
              <span className="text-sm font-normal text-gray-500 ml-2">Your Google Gemini API key for AI features</span>
            </label>
            <ApiKeyInput
              value={settings.api?.geminiKey || ''}
              onChange={handleApiKeyChange}
            />
            <p className="mt-2 text-sm text-gray-500">
              Get your API key from the{' '}
              <a
                href="https://makersuite.google.com/app/apikey"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 hover:text-blue-600 underline"
              >
                Google AI Studio
              </a>
            </p>
          </div>
        </div>
      </section>

      {/* Data Management */}
      <section className="p-6 rounded-2xl shadow-xl bg-white/80 dark:bg-gray-900/80 border border-gray-200/40 backdrop-blur-md">
        <div className="flex items-center gap-2 mb-6">
          <MdStorage className="w-7 h-7 text-green-600" />
          <h2 className="text-xl font-semibold">Data Management</h2>
        </div>
        
        <div className="flex flex-wrap gap-4">
          <button
            className="px-4 py-2 rounded-lg bg-blue-500 text-white font-semibold hover:bg-blue-600 transition"
            onClick={handleSaveAll}
          >
            Save All Settings
          </button>
          
          <button
            className="px-4 py-2 rounded-lg bg-green-500 text-white font-semibold hover:bg-green-600 transition"
            onClick={async () => {
              try {
                const response = await fetch('/api/export-data');
                const blob = await response.blob();
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = 'applications-data.json';
                a.click();
                URL.revokeObjectURL(url);
                showToast('Data exported successfully!', 'success');
              } catch (error) {
                showToast('Failed to export data', 'error');
              }
            }}
          >
            Export Data
          </button>
          
          <label className="px-4 py-2 rounded-lg bg-purple-500 text-white font-semibold hover:bg-purple-600 transition cursor-pointer">
            Import Data
            <input 
              type="file" 
              accept=".json" 
              className="hidden" 
              onChange={async (e) => {
                const file = e.target.files[0];
                if (!file) return;
                
                try {
                  const formData = new FormData();
                  formData.append('file', file);
                  
                  const response = await fetch('/api/import-data', {
                    method: 'POST',
                    body: formData,
                  });
                  
                  if (!response.ok) throw new Error('Import failed');
                  
                  showToast('Data imported successfully!', 'success');
                } catch (error) {
                  showToast('Failed to import data', 'error');
                }
              }} 
            />
          </label>
          
          <button
            className="px-4 py-2 rounded-lg bg-red-500 text-white font-semibold hover:bg-red-600 transition"
            onClick={() => setShowClearModal(true)}
          >
            Clear All Data
          </button>
        </div>
        
        {importError && (
          <p className="mt-2 text-sm text-red-600">{importError}</p>
        )}
      </section>

      {/* Confirm Modals */}
      {showClearModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-xl max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold mb-4">Clear All Data</h3>
            <p className="mb-6 text-gray-600 dark:text-gray-300">Are you sure you want to clear all application data? This action cannot be undone.</p>
            <div className="flex gap-4">
              <button 
                className="flex-1 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
                onClick={async () => {
                  try {
                    await fetch('/api/clear-data', { method: 'POST' });
                    setShowClearModal(false);
                    showToast('All data cleared successfully!', 'success');
                  } catch (error) {
                    showToast('Failed to clear data', 'error');
                  }
                }}
              >
                Yes, Clear All
              </button>
              <button 
                className="flex-1 px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition"
                onClick={() => setShowClearModal(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {showResetModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-xl max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold mb-4">Reset All Settings</h3>
            <p className="mb-6 text-gray-600 dark:text-gray-300">Are you sure you want to reset all settings to default? This action cannot be undone.</p>
            <div className="flex gap-4">
              <button 
                className="flex-1 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
                onClick={handleReset}
              >
                Yes, Reset All
              </button>
              <button 
                className="flex-1 px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition"
                onClick={() => setShowResetModal(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 
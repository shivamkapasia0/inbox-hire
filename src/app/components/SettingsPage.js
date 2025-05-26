"use client";
import React, { useState } from 'react';
import { MdTune, MdDashboard, MdStorage, MdHelp, MdApi } from 'react-icons/md';
import { useSettings } from '../utils/useSettings';
import { useToast } from './ToastProvider';
import ApiKeyInput from './ApiKeyInput';

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
              <label className="block font-medium mb-2">
                Rejection Keywords
                <span className="text-sm font-normal text-gray-500 ml-2">Keywords that indicate a rejection email</span>
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
              <label className="block font-medium mb-2">
                Interview Keywords
                <span className="text-sm font-normal text-gray-500 ml-2">Keywords that indicate an interview request</span>
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
              <label className="block font-medium mb-2">
                Offer Keywords
                <span className="text-sm font-normal text-gray-500 ml-2">Keywords that indicate a job offer</span>
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
              <label className="block font-medium mb-2">
                Not Selected Keywords
                <span className="text-sm font-normal text-gray-500 ml-2">Keywords that indicate not being selected</span>
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
              <label className="block font-medium mb-2">
                No Response Keywords
                <span className="text-sm font-normal text-gray-500 ml-2">Keywords that indicate no response</span>
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
              <label className="block font-medium mb-2">
                In Progress Keywords
                <span className="text-sm font-normal text-gray-500 ml-2">Keywords that indicate application is in progress</span>
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
              <label className="block font-medium mb-2">
                Days Until Considered No Response
                <span className="text-sm font-normal text-gray-500 ml-2">Applications will be marked as &apos;No Response&apos; after this many days</span>
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
          <div>
            <label className="block font-medium mb-2">Group Applications By</label>
            <select
              className="w-full p-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-blue-400 focus:border-transparent"
              value={settings.dashboard.groupBy}
              onChange={e => handleChange('dashboard', 'groupBy', e.target.value)}
            >
              <option>Status</option>
              <option>Company</option>
              <option>Date</option>
            </select>
          </div>

          <div>
            <label className="block font-medium mb-2">Theme</label>
            <select
              className="w-full p-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-blue-400 focus:border-transparent"
              value={settings.dashboard.theme}
              onChange={e => handleChange('dashboard', 'theme', e.target.value)}
            >
              <option>Light</option>
              <option>Dark</option>
              <option>System</option>
            </select>
          </div>

          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="showRejected"
                checked={settings.dashboard.showRejected}
                onChange={e => handleChange('dashboard', 'showRejected', e.target.checked)}
                className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
              />
              <label htmlFor="showRejected" className="ml-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                Show Rejected Jobs
              </label>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="showCharts"
                checked={settings.dashboard.showCharts}
                onChange={e => handleChange('dashboard', 'showCharts', e.target.checked)}
                className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
              />
              <label htmlFor="showCharts" className="ml-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                Show Charts
              </label>
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
            onClick={handleExport}
          >
            Export Settings
          </button>
          
          <label className="px-4 py-2 rounded-lg bg-purple-500 text-white font-semibold hover:bg-purple-600 transition cursor-pointer">
            Import Settings
            <input type="file" accept=".json" className="hidden" onChange={handleImport} />
          </label>
          
          <button
            className="px-4 py-2 rounded-lg bg-red-500 text-white font-semibold hover:bg-red-600 transition"
            onClick={() => setShowResetModal(true)}
          >
            Reset Settings
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
            <h3 className="text-lg font-semibold mb-4">Clear All Applications</h3>
            <p className="mb-6 text-gray-600 dark:text-gray-300">Are you sure you want to clear all applications? This action cannot be undone.</p>
            <div className="flex gap-4">
              <button 
                className="flex-1 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
                onClick={handleClear}
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
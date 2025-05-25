"use client";
import React, { useState } from 'react';
import { MdEmail, MdTune, MdDashboard, MdStorage, MdHelp } from 'react-icons/md';
import { useSettings } from '../utils/useSettings';
import { useToast } from './ToastProvider';

function validatePostmark({ inboundEmail, webhookUrl }) {
  const errors = {};
  if (!inboundEmail.endsWith('.postmarkapp.com')) {
    errors.inboundEmail = 'Must end with .postmarkapp.com';
  }
  try {
    new URL(webhookUrl);
  } catch {
    errors.webhookUrl = 'Must be a valid URL';
  }
  return errors;
}

export default function SettingsPage() {
  const { settings, setSettings, saveSettings, defaultSettings } = useSettings();
  const [errors, setErrors] = useState({});
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
    const errs = validatePostmark(settings.postmark);
    setErrors(errs);
    if (Object.keys(errs).length === 0) {
      saveSettings(settings);
      showToast('Settings saved!', 'success');
    } else {
      showToast(Object.values(errs)[0] || 'Please fix the errors above.', 'error');
    }
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

  return (
    <div className="max-w-2xl mx-auto py-8 px-2 md:px-6 space-y-8">
      <h1 className="text-3xl md:text-4xl font-bold mb-8 text-center text-gray-900 dark:text-white tracking-tight">Settings</h1>
      <div className="space-y-6">
        {/* Postmark Setup */}
        <section className="p-6 rounded-2xl shadow-xl bg-white/80 dark:bg-gray-900/80 border border-gray-200/40 backdrop-blur-md">
          <div className="flex items-center gap-2 mb-3">
            <MdEmail className="w-7 h-7 text-blue-500" />
            <h2 className="text-lg font-semibold">Postmark Setup</h2>
          </div>
          <div className="space-y-3">
            <div>
              <label className="block font-medium">Inbound Email Address</label>
              <input
                className="w-full mt-1 p-2 rounded border focus:ring-2 focus:ring-blue-400"
                value={settings.postmark.inboundEmail}
                onChange={e => handleChange('postmark', 'inboundEmail', e.target.value)}
                placeholder="your-inbound@inbound.postmarkapp.com"
              />
              {errors.inboundEmail && <p className="text-red-600 text-xs mt-1">{errors.inboundEmail}</p>}
            </div>
            <div>
              <label className="block font-medium">Webhook URL</label>
              <input
                className="w-full mt-1 p-2 rounded border focus:ring-2 focus:ring-blue-400"
                value={settings.postmark.webhookUrl}
                onChange={e => handleChange('postmark', 'webhookUrl', e.target.value)}
                placeholder="https://yourapp.com/api/inbound-email"
              />
              {errors.webhookUrl && <p className="text-red-600 text-xs mt-1">{errors.webhookUrl}</p>}
            </div>
            <div>
              <label className="block font-medium">Postmark Server Token (optional)</label>
              <input
                type="password"
                className="w-full mt-1 p-2 rounded border focus:ring-2 focus:ring-blue-400"
                value={settings.postmark.serverToken}
                onChange={e => handleChange('postmark', 'serverToken', e.target.value)}
                placeholder="Server token (optional)"
              />
            </div>
          </div>
        </section>

        {/* Email Parsing Settings */}
        <section className="p-6 rounded-2xl shadow-xl bg-white/80 dark:bg-gray-900/80 border border-gray-200/40 backdrop-blur-md">
          <div className="flex items-center gap-2 mb-3">
            <MdTune className="w-7 h-7 text-amber-500" />
            <h2 className="text-lg font-semibold">Email Parsing Settings</h2>
          </div>
          <div className="grid grid-cols-1 gap-3">
            <div>
              <label className="block font-medium">Rejection Keywords (comma separated)</label>
              <textarea
                className="w-full mt-1 p-2 rounded border"
                value={settings.parsing.rejectionKeywords.join(', ')}
                onChange={e => handleParsingKeywords('rejectionKeywords', e.target.value)}
                rows={2}
              />
            </div>
            <div>
              <label className="block font-medium">Interview Keywords (comma separated)</label>
              <textarea
                className="w-full mt-1 p-2 rounded border"
                value={settings.parsing.interviewKeywords.join(', ')}
                onChange={e => handleParsingKeywords('interviewKeywords', e.target.value)}
                rows={2}
              />
            </div>
            <div>
              <label className="block font-medium">Offer Keywords (comma separated)</label>
              <textarea
                className="w-full mt-1 p-2 rounded border"
                value={settings.parsing.offerKeywords.join(', ')}
                onChange={e => handleParsingKeywords('offerKeywords', e.target.value)}
                rows={2}
              />
            </div>
            <div className="flex items-center mt-2">
              <input
                type="checkbox"
                checked={settings.parsing.enableCustom}
                onChange={e => handleChange('parsing', 'enableCustom', e.target.checked)}
                className="mr-2"
              />
              <span>Enable Custom Parsing</span>
            </div>
          </div>
        </section>

        {/* Dashboard Preferences */}
        <section className="p-6 rounded-2xl shadow-xl bg-white/80 dark:bg-gray-900/80 border border-gray-200/40 backdrop-blur-md">
          <div className="flex items-center gap-2 mb-3">
            <MdDashboard className="w-7 h-7 text-purple-500" />
            <h2 className="text-lg font-semibold">Dashboard Preferences</h2>
          </div>
          <div className="grid grid-cols-1 gap-3">
            <div>
              <label className="block font-medium">Group Applications By</label>
              <select
                className="w-full mt-1 p-2 rounded border"
                value={settings.dashboard.groupBy}
                onChange={e => handleChange('dashboard', 'groupBy', e.target.value)}
              >
                <option>Status</option>
                <option>Company</option>
                <option>Role</option>
                <option>Date</option>
              </select>
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                checked={settings.dashboard.showRejected}
                onChange={e => handleChange('dashboard', 'showRejected', e.target.checked)}
                className="mr-2"
              />
              <span>Show Rejected Jobs</span>
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                checked={settings.dashboard.showCharts}
                onChange={e => handleChange('dashboard', 'showCharts', e.target.checked)}
                className="mr-2"
              />
              <span>Show Charts</span>
            </div>
            <div>
              <label className="block font-medium">Theme</label>
              <select
                className="w-full mt-1 p-2 rounded border"
                value={settings.dashboard.theme}
                onChange={e => handleChange('dashboard', 'theme', e.target.value)}
              >
                <option>Light</option>
                <option>Dark</option>
                <option>System</option>
              </select>
            </div>
          </div>
        </section>

        {/* Data Management */}
        <section className="p-6 rounded-2xl shadow-xl bg-white/80 dark:bg-gray-900/80 border border-gray-200/40 backdrop-blur-md">
          <div className="flex items-center gap-2 mb-3">
            <MdStorage className="w-7 h-7 text-green-600" />
            <h2 className="text-lg font-semibold">Data Management</h2>
          </div>
          <div className="flex flex-wrap gap-3 items-center">
            <button
              className="px-4 py-2 rounded bg-blue-500 text-white font-semibold hover:bg-blue-600 transition"
              onClick={handleExport}
            >
              Export Applications
            </button>
            <label className="px-4 py-2 rounded bg-green-500 text-white font-semibold hover:bg-green-600 transition cursor-pointer">
              Import Applications
              <input type="file" accept=".json,.csv" className="hidden" onChange={handleImport} />
            </label>
            {importError && <span className="text-red-600 text-xs">{importError}</span>}
            <button
              className="px-4 py-2 rounded bg-red-500 text-white font-semibold hover:bg-red-600 transition"
              onClick={() => setShowClearModal(true)}
            >
              Clear All Applications
            </button>
            <button
              className="px-4 py-2 rounded bg-gray-700 text-white font-semibold hover:bg-gray-800 transition"
              onClick={() => setShowResetModal(true)}
            >
              Reset All Settings
            </button>
          </div>
          {/* Confirm Modals */}
          {showClearModal && (
            <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50">
              <div className="bg-white p-6 rounded-xl shadow-xl">
                <p className="mb-4">Are you sure you want to clear all applications? This cannot be undone.</p>
                <div className="flex gap-4">
                  <button className="px-4 py-2 bg-red-500 text-white rounded" onClick={handleClear}>Yes, Clear</button>
                  <button className="px-4 py-2 bg-gray-300 rounded" onClick={() => setShowClearModal(false)}>Cancel</button>
                </div>
              </div>
            </div>
          )}
          {showResetModal && (
            <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50">
              <div className="bg-white p-6 rounded-xl shadow-xl">
                <p className="mb-4">Are you sure you want to reset all settings? This cannot be undone.</p>
                <div className="flex gap-4">
                  <button className="px-4 py-2 bg-red-500 text-white rounded" onClick={handleReset}>Yes, Reset</button>
                  <button className="px-4 py-2 bg-gray-300 rounded" onClick={() => setShowResetModal(false)}>Cancel</button>
                </div>
              </div>
            </div>
          )}
        </section>

        {/* Help / Documentation */}
        <section className="p-6 rounded-2xl shadow-xl bg-white/80 dark:bg-gray-900/80 border border-gray-200/40 backdrop-blur-md">
          <div className="flex items-center gap-2 mb-3">
            <MdHelp className="w-7 h-7 text-blue-400" />
            <h2 className="text-lg font-semibold">Help & Documentation</h2>
          </div>
          <div className="space-y-2">
            <details className="bg-gray-50 dark:bg-gray-800 rounded p-4">
              <summary className="font-medium cursor-pointer">Setup Instructions</summary>
              <ol className="list-decimal ml-6 mt-2 space-y-1 text-sm">
                <li>Sign up for a Postmark account and create an Inbound domain.</li>
                <li>Copy your Inbound Email Address and enter it above.</li>
                <li>Set your Webhook URL to your deployed app&apos;s endpoint (e.g., https://myapp.com/api/inbound-email).</li>
                <li>Optionally, add your Postmark Server Token if you want to call Postmark APIs.</li>
                <li>Save your settings.</li>
              </ol>
            </details>
            <a
              href="https://github.com/your-repo/inboxhire"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block mt-2 px-4 py-2 bg-blue-100 text-blue-800 rounded hover:bg-blue-200 font-medium"
            >
              GitHub Repo / Docs
            </a>
          </div>
        </section>
      </div>
      <div className="flex justify-end mt-8">
        <button
          className="px-8 py-3 rounded-lg bg-blue-600 text-white font-bold text-lg shadow-lg hover:bg-blue-700 transition-all"
          onClick={handleSaveAll}
        >
          Save All
        </button>
      </div>
    </div>
  );
} 
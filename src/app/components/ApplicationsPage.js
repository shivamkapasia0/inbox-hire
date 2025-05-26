"use client";
import React, { useState, useMemo, useRef, useEffect } from 'react';
import { useDataStore } from '../utils/DataStore';
import { useToast } from './ToastProvider';
import { FiX } from 'react-icons/fi';
import ApplicationDetailsModal from './ApplicationDetailsModal';
import { useSearchParams, useRouter } from 'next/navigation';
import { fetchApplications } from '../utils/data';
import { useRealtimeUpdates } from '../utils/useRealtimeUpdates';
import { useSettings } from '../utils/useSettings';
import { useNotification } from '../context/NotificationContext';
import { toast } from 'react-hot-toast';

const statusColors = {
  'Interview': 'bg-blue-100 text-blue-800',
  'Offer': 'bg-green-100 text-green-800',
  'Rejected': 'bg-red-100 text-red-800',
  'Other': 'bg-gray-100 text-gray-800'
};

const GROUP_FIELDS = [
  { key: 'position', label: 'Position' },
  { key: 'company', label: 'Company' },
  { key: 'statusBadge', label: 'Status' },
];

export default function ApplicationsPage() {
  const { data, updateData } = useDataStore();
  const { showToast } = useToast();
  const searchParams = useSearchParams();
  const router = useRouter();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedRows, setSelectedRows] = useState([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [groupBy, setGroupBy] = useState('');
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);
  const [selectedApplication, setSelectedApplication] = useState(null);
  const importInputRef = useRef(null);
  const { isConnected, lastEvent, lastUpdate } = useRealtimeUpdates();
  const { settings } = useSettings();
  const { showNotification } = useNotification();
  const lastUpdateRef = useRef(lastUpdate);

  // Handle status filter from URL
  useEffect(() => {
    const statusFromUrl = searchParams.get('status');
    if (statusFromUrl) {
      setStatusFilter(decodeURIComponent(statusFromUrl));
    }
  }, [searchParams]);

  // Update URL when status filter changes
  useEffect(() => {
    if (statusFilter !== 'All') {
      const encodedStatus = encodeURIComponent(statusFilter);
      router.push(`/applications?status=${encodedStatus}`, { scroll: false });
    } else {
      router.push('/applications', { scroll: false });
    }
  }, [statusFilter, router]);

  // Load applications
  const loadApplications = async () => {
    try {
      console.log('Loading applications...');
      const data = await fetchApplications();
      console.log('Fetched applications:', data);
      setApplications(data);
      setError(null);
    } catch (err) {
      console.error('Error loading applications:', err);
      setError(err.message);
      toast.error('Failed to load applications');
    } finally {
      setLoading(false);
    }
  };

  // Handle real-time updates
  useEffect(() => {
    if (lastUpdate && lastUpdate !== lastUpdateRef.current) {
      console.log('New email received, reloading applications...');
      lastUpdateRef.current = lastUpdate;
      loadApplications();
      showNotification('New Application', 'A new application has been received');
      
      // If we're on the applications page, scroll to top
      if (window.location.pathname === '/applications') {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }
  }, [lastUpdate, showNotification]);

  // Auto-refresh based on settings
  useEffect(() => {
    const refreshInterval = settings?.dashboard?.refreshInterval || 5; // Default to 5 minutes if not set
    console.log('Setting up auto-refresh interval:', refreshInterval, 'minutes');
    
    const intervalId = setInterval(() => {
      console.log('Auto-refreshing applications...');
      loadApplications();
    }, refreshInterval * 60 * 1000);

    return () => {
      console.log('Cleaning up auto-refresh interval');
      clearInterval(intervalId);
    };
  }, [settings?.dashboard?.refreshInterval]);

  // Refresh on window focus
  useEffect(() => {
    const handleFocus = () => {
      console.log('Window focused, refreshing applications...');
      loadApplications();
    };

    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, []);

  // Initial load
  useEffect(() => {
    loadApplications();
  }, []);

  // Status options
  const statusOptions = useMemo(() => {
    const all = applications.map(a => a.statusBadge);
    return ['All', ...Array.from(new Set(all))];
  }, [applications]);

  // Filter, search, group
  const filtered = useMemo(() => {
    let arr = applications;
    if (statusFilter !== 'All') {
      arr = arr.filter(app => app.statusBadge === statusFilter);
    }
    if (search) {
      arr = arr.filter(app =>
        (app.position || '').toLowerCase().includes(search.toLowerCase()) ||
        (app.company || '').toLowerCase().includes(search.toLowerCase()) ||
        (app.source || '').toLowerCase().includes(search.toLowerCase())
      );
    }
    if (groupBy) {
      arr = arr.slice().sort((a, b) => {
        if ((a[groupBy] || '') < (b[groupBy] || '')) return -1;
        if ((a[groupBy] || '') > (b[groupBy] || '')) return 1;
        return 0;
      });
    }
    return arr;
  }, [applications, search, statusFilter, groupBy]);

  // Bulk selection
  const allChecked = filtered.length > 0 && filtered.every(app => selectedRows.includes(app.id));
  const handleCheckAll = () => {
    if (allChecked) setSelectedRows([]);
    else setSelectedRows(filtered.map(app => app.id));
  };
  const handleCheck = (id) => {
    setSelectedRows(rows => rows.includes(id) ? rows.filter(r => r !== id) : [...rows, id]);
  };

  // Toolbar actions
  const handleRefresh = () => {
    setSearch('');
    setStatusFilter('All');
    setGroupBy('');
    setSelectedRows([]);
    loadApplications();
    showToast('Refreshed!', 'success');
  };

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto py-8 px-2 md:px-6">
        <div className="animate-pulse space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-16 bg-gray-200 rounded"></div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-6xl mx-auto py-8 px-2 md:px-6">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto py-8 px-2 md:px-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Applications</h1>
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`} />
          <span className="text-sm text-gray-600 dark:text-gray-400">
            {isConnected ? 'Connected' : 'Disconnected'}
          </span>
        </div>
      </div>
      
      {/* Filters above search bar */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-4">
        <div className="flex flex-col md:flex-row md:items-center gap-2 w-full md:w-auto">
          <label className="font-medium text-gray-700 mr-2">Filter by Status:</label>
          <select
            className="w-full md:w-48 px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-400 shadow-sm"
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
          >
            {statusOptions.map(opt => (
              <option key={opt}>{opt}</option>
            ))}
          </select>
        </div>
        <div className="flex items-center gap-2 w-full md:w-auto">
          <div className="relative w-full md:w-72">
            <input
              className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-400 shadow-md pl-10 pr-8 text-gray-900"
              placeholder="Search applications..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
            <span className="absolute left-3 top-2.5 text-gray-400 text-base">🔍</span>
            {search && (
              <button
                className="absolute right-2 top-2.5 text-gray-400 hover:text-gray-700"
                onClick={() => setSearch('')}
                tabIndex={-1}
              >
                <FiX className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex gap-2 flex-wrap mb-4">
        <div className="relative">
          <button className="px-4 py-2 rounded-lg border border-gray-200 bg-white text-gray-700 shadow-sm hover:bg-blue-50 hover:text-blue-700 font-semibold transition" onClick={() => setShowStatusDropdown(v => !v)}>
            Filter By
          </button>
          {showStatusDropdown && (
            <div className="absolute z-10 mt-2 bg-white border border-gray-200 rounded shadow-lg w-48">
              {statusOptions.map(opt => (
                <div
                  key={opt}
                  className={`px-4 py-2 cursor-pointer hover:bg-blue-50 ${statusFilter === opt ? 'bg-blue-100 text-blue-700' : ''}`}
                  onClick={() => { setStatusFilter(opt); setShowStatusDropdown(false); }}
                >
                  {opt}
                </div>
              ))}
            </div>
          )}
        </div>
        <div className="relative">
          <button className="px-4 py-2 rounded-lg border border-gray-200 bg-white text-gray-700 shadow-sm hover:bg-blue-50 hover:text-blue-700 font-semibold transition" onClick={() => setGroupBy(g => g ? '' : GROUP_FIELDS[0].key)}>
            Group By
          </button>
          {groupBy && (
            <div className="absolute z-10 mt-2 bg-white border border-gray-200 rounded shadow-lg w-48">
              {GROUP_FIELDS.map(f => (
                <div
                  key={f.key}
                  className={`px-4 py-2 cursor-pointer hover:bg-blue-50 ${groupBy === f.key ? 'bg-blue-100 text-blue-700' : ''}`}
                  onClick={() => setGroupBy(f.key)}
                >
                  {f.label}
                </div>
              ))}
              <div className="px-4 py-2 cursor-pointer text-gray-400 hover:text-gray-700" onClick={() => setGroupBy('')}>Clear Grouping</div>
            </div>
          )}
        </div>
        <button className="px-4 py-2 rounded-lg border border-gray-200 bg-white text-gray-700 shadow-sm hover:bg-blue-50 hover:text-blue-700 font-semibold transition" onClick={handleRefresh}>
          Refresh
        </button>
      </div>

      {/* Table */}
      <div className="rounded-2xl shadow bg-white border border-gray-100 overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="text-gray-500 font-semibold bg-gray-50">
              <th className="px-4 py-3"><input type="checkbox" checked={allChecked} onChange={handleCheckAll} /></th>
              <th className="px-4 py-3 text-left">Position</th>
              <th className="px-4 py-3 text-left">Company Name</th>
              <th className="px-4 py-3 text-left">Last Updated Date</th>
              <th className="px-4 py-3 text-left">Source</th>
              <th className="px-4 py-3 text-center">Status</th>
              <th className="px-4 py-3 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(app => (
              <tr key={app.id} className="border-b border-gray-100 hover:bg-gray-50 transition">
                <td className="px-4 py-3"><input type="checkbox" checked={selectedRows.includes(app.id)} onChange={() => handleCheck(app.id)} /></td>
                <td className="px-4 py-3 font-medium text-gray-900 whitespace-nowrap">{app.position}</td>
                <td className="px-4 py-3 whitespace-nowrap">{app.company}</td>
                <td className="px-4 py-3 whitespace-nowrap">{new Date(app.lastUpdate).toLocaleDateString()}</td>
                <td className="px-4 py-3 whitespace-nowrap">{app.source}</td>
                <td className="px-4 py-3 text-center">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${statusColors[app.statusBadge] || 'bg-gray-200 text-gray-800'}`}>
                    {app.statusBadge}
                  </span>
                </td>
                <td className="px-4 py-3 text-center">
                  <button 
                    className="px-4 py-1 rounded bg-blue-600 text-white font-semibold hover:bg-blue-700 transition"
                    onClick={() => router.push(`/applications/${app.id}`)}
                  >
                    View Details
                  </button>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={7} className="text-center py-8 text-gray-400">No applications found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
} 
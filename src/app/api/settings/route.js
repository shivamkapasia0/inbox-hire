import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

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
    refreshInterval: 5,
  },
  api: {
    geminiKey: '',
  },
};

// Helper function to ensure data directory exists
async function ensureDataDirectory() {
  const dataDir = path.join(process.cwd(), 'src', 'data');
  try {
    await fs.access(dataDir);
  } catch {
    await fs.mkdir(dataDir, { recursive: true });
  }
}

export async function GET() {
  try {
    await ensureDataDirectory();
    const filePath = path.join(process.cwd(), 'src', 'data', 'settings.json');
    
    try {
      const fileContent = await fs.readFile(filePath, 'utf-8');
      const settings = JSON.parse(fileContent);
      return NextResponse.json(settings);
    } catch (error) {
      // If file doesn't exist or is invalid, return default settings
      return NextResponse.json(defaultSettings);
    }
  } catch (error) {
    console.error('Error reading settings:', error);
    return NextResponse.json(
      { error: 'Failed to read settings' },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const newSettings = await request.json();
    
    // Ensure api section exists before saving
    const settingsToSave = {
      ...defaultSettings,
      ...newSettings,
      api: {
        ...defaultSettings.api,
        ...(newSettings.api || {}),
      },
    };

    await ensureDataDirectory();
    const filePath = path.join(process.cwd(), 'src', 'data', 'settings.json');
    await fs.writeFile(filePath, JSON.stringify(settingsToSave, null, 2));

    return NextResponse.json(settingsToSave);
  } catch (error) {
    console.error('Error saving settings:', error);
    return NextResponse.json(
      { error: 'Failed to save settings' },
      { status: 500 }
    );
  }
} 
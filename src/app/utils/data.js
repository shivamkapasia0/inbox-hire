// Helper function to detect email status
function detectStatus(subject, textBody) {
  const content = (subject + ' ' + textBody).toLowerCase();
  if (content.includes('rejected')) return 'rejected';
  if (content.includes('interview')) return 'interview';
  if (content.includes('offer')) return 'offer';
  return 'other';
}

// Helper function to map email data to application format
export function mapEmailToApplication(email) {
  const fromEmail = email.from || '';
  const domainMatch = fromEmail.match(/@([^.]+)\./);
  const source = domainMatch ? domainMatch[1] : 'Unknown';

  return {
    id: email.id,
    position: email.subject.split('-')[0]?.trim() || 'Unknown Position',
    company: domainMatch ? fromEmail.split('@')[1]?.split('.')[0] || 'Unknown Company' : 'Unknown Company',
    name: email.from,
    lastUpdate: email.date,
    source: source.charAt(0).toUpperCase() + source.slice(1), // Capitalize the first letter
    status: email.status,
    statusBadge: email.status.charAt(0).toUpperCase() + email.status.slice(1),
    from: email.from,
    to: email.to,
    subject: email.subject,
    text: email.text,
    html: email.html,
    date: email.date
  };
}

// Function to fetch and process applications
export async function fetchApplications() {
  try {
    const response = await fetch('/api/get-emails');
    if (!response.ok) {
      throw new Error('Failed to fetch applications');
    }
    const emails = await response.json();
    return emails.map(mapEmailToApplication);
  } catch (error) {
    console.error('Error fetching applications:', error);
    throw error;
  }
}

// Function to get application by ID
export async function getApplicationById(id) {
  try {
    const response = await fetch('/api/get-emails');
    if (!response.ok) {
      throw new Error('Failed to fetch application');
    }
    const emails = await response.json();
    const email = emails.find(e => e.id === id);
    if (!email) {
      throw new Error('Application not found');
    }
    return mapEmailToApplication(email);
  } catch (error) {
    console.error('Error fetching application:', error);
    throw error;
  }
}

// Function to get summary statistics
export async function getSummaryStats() {
  try {
    const applications = await fetchApplications();
    
    // Calculate statistics
    const stats = {
      totalApplied: applications.length,
      interviewScheduled: applications.filter(app => app.status === 'interview').length,
      noResponse: applications.filter(app => app.status === 'other').length,
      notSelected: applications.filter(app => app.status === 'rejected').length,
      inProgress: applications.filter(app => app.status === 'offer').length,
    };

    // Calculate trends (comparing with previous month)
    const now = new Date();
    const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const lastMonthApps = applications.filter(app => {
      const appDate = new Date(app.date);
      return appDate >= lastMonth && appDate < thisMonth;
    });

    const thisMonthApps = applications.filter(app => {
      const appDate = new Date(app.date);
      return appDate >= thisMonth;
    });

    // Calculate trends
    const trends = {
      totalApplied: calculateTrend(thisMonthApps.length, lastMonthApps.length),
      interviewScheduled: calculateTrend(
        thisMonthApps.filter(app => app.status === 'interview').length,
        lastMonthApps.filter(app => app.status === 'interview').length
      ),
      noResponse: calculateTrend(
        thisMonthApps.filter(app => app.status === 'other').length,
        lastMonthApps.filter(app => app.status === 'other').length
      ),
      notSelected: calculateTrend(
        thisMonthApps.filter(app => app.status === 'rejected').length,
        lastMonthApps.filter(app => app.status === 'rejected').length
      ),
      inProgress: calculateTrend(
        thisMonthApps.filter(app => app.status === 'offer').length,
        lastMonthApps.filter(app => app.status === 'offer').length
      ),
    };

    return { stats, trends };
  } catch (error) {
    console.error('Error getting summary stats:', error);
    throw error;
  }
}

// Function to get recent applications
export async function getRecentApplications(limit = 5) {
  try {
    const applications = await fetchApplications();
    return applications
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, limit);
  } catch (error) {
    console.error('Error getting recent applications:', error);
    throw error;
  }
}

// Function to get application type distribution
export async function getApplicationTypeDistribution() {
  try {
    const applications = await fetchApplications();
    const distribution = {
      fullTime: applications.filter(app => app.subject.toLowerCase().includes('full time')).length,
      partTime: applications.filter(app => app.subject.toLowerCase().includes('part time')).length,
      contract: applications.filter(app => app.subject.toLowerCase().includes('contract')).length,
      internship: applications.filter(app => app.subject.toLowerCase().includes('internship')).length,
    };
    return distribution;
  } catch (error) {
    console.error('Error getting application type distribution:', error);
    throw error;
  }
}

// Function to get jobs applied overview
export async function getJobsAppliedOverview() {
  try {
    const applications = await fetchApplications();
    const now = new Date();
    const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const lastMonthApps = applications.filter(app => {
      const appDate = new Date(app.date);
      return appDate >= lastMonth && appDate < thisMonth;
    });

    const thisMonthApps = applications.filter(app => {
      const appDate = new Date(app.date);
      return appDate >= thisMonth;
    });

    return {
      lastMonth: {
        total: lastMonthApps.length,
        qualified: lastMonthApps.filter(app => app.status !== 'rejected').length,
        notQualified: lastMonthApps.filter(app => app.status === 'rejected').length,
      },
      thisMonth: {
        total: thisMonthApps.length,
        qualified: thisMonthApps.filter(app => app.status !== 'rejected').length,
        notQualified: thisMonthApps.filter(app => app.status === 'rejected').length,
      }
    };
  } catch (error) {
    console.error('Error getting jobs applied overview:', error);
    throw error;
  }
}

// Function to get impressions data
export async function getImpressionsData() {
  try {
    const applications = await fetchApplications();
    const now = new Date();
    const lastWeek = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 7);
    
    // Group applications by date
    const dailyData = {};
    for (let i = 0; i < 7; i++) {
      const date = new Date(lastWeek);
      date.setDate(date.getDate() + i);
      const dateStr = date.toISOString().split('T')[0];
      dailyData[dateStr] = {
        applications: 0,
        interviews: 0,
        offers: 0
      };
    }

    // Fill in the data
    applications.forEach(app => {
      const appDate = new Date(app.date);
      if (appDate >= lastWeek) {
        const dateStr = appDate.toISOString().split('T')[0];
        if (dailyData[dateStr]) {
          dailyData[dateStr].applications++;
          if (app.status === 'interview') dailyData[dateStr].interviews++;
          if (app.status === 'offer') dailyData[dateStr].offers++;
        }
      }
    });

    return Object.entries(dailyData).map(([date, data]) => ({
      date,
      ...data
    }));
  } catch (error) {
    console.error('Error getting impressions data:', error);
    throw error;
  }
}

// Function to get application source distribution
export async function getApplicationSourceDistribution() {
  try {
    const applications = await fetchApplications();
    const distribution = {};

    applications.forEach(app => {
      const source = app.source || 'Unknown';
      distribution[source] = (distribution[source] || 0) + 1;
    });
    
    return distribution;
  } catch (error) {
    console.error('Error getting application source distribution:', error);
    throw error;
  }
}

// Helper function to calculate trend percentage
function calculateTrend(current, previous) {
  if (previous === 0) return current > 0 ? '+100%' : '0%';
  const percentage = ((current - previous) / previous) * 100;
  return `${percentage >= 0 ? '+' : ''}${Math.round(percentage)}%`;
} 
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
  return {
    id: email.id,
    position: email.subject.split('-')[0]?.trim() || 'Unknown Position',
    company: email.from.split('@')[1]?.split('.')[0] || 'Unknown Company',
    name: email.from,
    lastUpdate: email.date,
    source: 'Email',
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
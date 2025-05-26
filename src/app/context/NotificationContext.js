'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

const NotificationContext = createContext();

export function NotificationProvider({ children }) {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [lastPollTime, setLastPollTime] = useState(null);
  const router = useRouter();

  // Function to add a new notification
  const addNotification = (email) => {
    console.log('Adding new notification for email:', email);
    const newNotification = {
      id: email.id,
      message: `New email from ${email.from}: ${email.subject}`,
      timestamp: new Date().toISOString(),
      read: false,
      email: email
    };

    setNotifications(prev => {
      // Check if notification already exists
      const exists = prev.some(n => n.id === newNotification.id);
      if (exists) {
        console.log('Notification already exists, skipping');
        return prev;
      }
      console.log('Adding new notification to state');
      return [newNotification, ...prev];
    });
    
    setUnreadCount(prev => prev + 1);
  };

  // Function to mark notifications as read
  const markAsRead = (notificationId) => {
    setNotifications(prev =>
      prev.map(notification =>
        notification.id === notificationId
          ? { ...notification, read: true }
          : notification
      )
    );
    setUnreadCount(prev => Math.max(0, prev - 1));
  };

  // Function to handle notification click
  const handleNotificationClick = (notification) => {
    markAsRead(notification.id);
    router.push('/applications');
  };

  // Poll for new emails every 5 seconds
  useEffect(() => {
    const pollEmails = async () => {
      try {
        console.log('Polling for new emails...');
        const response = await fetch('/api/get-emails');
        const emails = await response.json();
        
        if (!Array.isArray(emails)) {
          console.error('Invalid response format:', emails);
          return;
        }

        console.log('Received emails:', emails.length);
        
        // Get the latest notification timestamp
        const latestNotificationTime = notifications[0]?.timestamp;
        console.log('Latest notification time:', latestNotificationTime);
        
        // Add notifications for new emails
        emails.forEach(email => {
          // Convert email date to timestamp for comparison
          const emailDate = new Date(email.date).getTime();
          const latestTime = latestNotificationTime ? new Date(latestNotificationTime).getTime() : 0;
          
          console.log('Comparing dates:', {
            emailDate,
            latestTime,
            isNew: emailDate > latestTime
          });
          
          if (emailDate > latestTime) {
            console.log('Found new email:', email);
            addNotification(email);
          }
        });
        
        setLastPollTime(new Date().toISOString());
      } catch (error) {
        console.error('Error polling for new emails:', error);
      }
    };

    // Initial poll
    pollEmails();

    // Set up polling interval
    const interval = setInterval(pollEmails, 5000); // Poll every 5 seconds
    return () => clearInterval(interval);
  }, [notifications]);

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        markAsRead,
        handleNotificationClick,
        lastPollTime
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
} 
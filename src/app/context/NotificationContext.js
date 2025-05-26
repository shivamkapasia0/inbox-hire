'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useSettings } from '../utils/useSettings';

export const NotificationContext = React.createContext();

export function useNotification() {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  return context;
}

export function NotificationProvider({ children }) {
  const [allNotifications, setAllNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [lastPollTime, setLastPollTime] = useState(null);
  const router = useRouter();
  const { settings } = useSettings();

  // Get only the 3 most recent notifications
  const notifications = allNotifications.slice(0, 3);

  // Update unread count whenever notifications change
  useEffect(() => {
    const unread = allNotifications.filter(n => !n.read).length;
    setUnreadCount(unread);
  }, [allNotifications]);

  // Function to add a new notification
  const addNotification = useCallback((email) => {
    console.log('Adding new notification for email:', email);
    const newNotification = {
      id: email.id || email.messageId || Date.now().toString(),
      message: `New email from ${email.from}: ${email.subject}`,
      timestamp: new Date().toISOString(),
      read: false,
      email: email
    };

    setAllNotifications(prev => {
      // Check if notification already exists
      const exists = prev.some(n => n.id === newNotification.id);
      if (exists) {
        console.log('Notification already exists, skipping');
        return prev;
      }
      console.log('Adding new notification to state');
      return [newNotification, ...prev];
    });

    // Show browser notification if permission granted
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification('New Email Received', {
        body: `Subject: ${email.subject}`,
        icon: '/favicon.ico',
        tag: newNotification.id // Prevent duplicate notifications
      });
    }
  }, []);

  // Function to mark notifications as read
  const markAsRead = useCallback((notificationId) => {
    setAllNotifications(prev =>
      prev.map(notification =>
        notification.id === notificationId
          ? { ...notification, read: true }
          : notification
      )
    );
  }, []);

  // Function to mark all notifications as read
  const markAllAsRead = useCallback(() => {
    setAllNotifications(prev =>
      prev.map(notification => ({ ...notification, read: true }))
    );
  }, []);

  // Function to handle notification click
  const handleNotificationClick = useCallback((notification) => {
    markAsRead(notification.id);
    router.push('/applications');
  }, [markAsRead, router]);

  // Poll for new emails based on refresh interval
  useEffect(() => {
    let isPolling = true;
    const refreshInterval = settings?.dashboard?.refreshInterval || 5; // Default to 5 minutes if not set
    const pollInterval = refreshInterval * 60 * 1000; // Convert minutes to milliseconds

    const pollEmails = async () => {
      if (!isPolling) return;

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
        const latestNotificationTime = allNotifications[0]?.timestamp;
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
    const interval = setInterval(pollEmails, pollInterval);

    return () => {
      isPolling = false;
      clearInterval(interval);
    };
  }, [allNotifications, addNotification, settings?.dashboard?.refreshInterval]);

  return (
    <NotificationContext.Provider
      value={{
        notifications, // This will only contain the 3 most recent notifications
        allNotifications, // Keep track of all notifications for internal use
        unreadCount,
        addNotification,
        markAsRead,
        markAllAsRead,
        handleNotificationClick,
        lastPollTime
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
} 
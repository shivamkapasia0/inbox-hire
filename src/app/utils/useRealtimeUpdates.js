'use client';

import { useEffect, useState, createContext, useContext } from 'react';
import { useNotification } from '../context/NotificationContext';

const RealtimeUpdatesContext = createContext();

export function useRealtimeUpdates() {
  const context = useContext(RealtimeUpdatesContext);
  if (!context) {
    throw new Error('useRealtimeUpdates must be used within a RealtimeUpdatesProvider');
  }
  return context;
}

export function RealtimeUpdatesProvider({ children }) {
  const [isConnected, setIsConnected] = useState(false);
  const [lastEvent, setLastEvent] = useState(null);
  const [lastUpdate, setLastUpdate] = useState(null);
  const [reconnectAttempt, setReconnectAttempt] = useState(0);
  const { addNotification } = useNotification();

  useEffect(() => {
    let eventSource = null;
    let reconnectTimeout = null;

    const connect = () => {
      if (eventSource) {
        eventSource.close();
      }

      console.log('Connecting to SSE...');
      eventSource = new EventSource('/api/events');

      eventSource.onopen = () => {
        console.log('SSE connection established');
        setIsConnected(true);
        setReconnectAttempt(0); // Reset reconnect attempt counter on successful connection
      };

      eventSource.onmessage = (event) => {
        try {
          console.log('Received SSE message:', event.data);
          const data = JSON.parse(event.data);
          setLastEvent(data);
          
          // Update lastUpdate timestamp for new emails
          if (data.type === 'new_email') {
            console.log('New email received:', data.email);
            setLastUpdate(Date.now());
            
            // Add to notification context
            addNotification(data.email);
            
            // Show browser notification if permission granted
            if (Notification.permission === 'granted') {
              new Notification('New Email Received', {
                body: `Subject: ${data.email.subject}`,
                icon: '/favicon.ico',
                tag: data.email.id // Prevent duplicate notifications
              });
            }
          }
        } catch (error) {
          console.error('Error parsing SSE data:', error);
        }
      };

      eventSource.onerror = (error) => {
        console.error('SSE connection error:', error);
        setIsConnected(false);
        eventSource.close();
        
        const backoffTime = Math.min(1000 * Math.pow(2, reconnectAttempt), 30000);
        console.log(`Attempting to reconnect in ${backoffTime}ms...`);
        
        reconnectTimeout = setTimeout(() => {
          console.log('Attempting to reconnect...');
          setReconnectAttempt(prev => prev + 1);
          connect();
        }, backoffTime);
      };
    };

    // Request notification permission immediately
    if ('Notification' in window) {
      if (Notification.permission !== 'granted' && Notification.permission !== 'denied') {
        Notification.requestPermission().then(permission => {
          console.log('Notification permission:', permission);
        });
      }
    }

    // Initial connection
    connect();

    // Cleanup
    return () => {
      if (eventSource) {
        console.log('Closing SSE connection');
        eventSource.close();
      }
      if (reconnectTimeout) {
        clearTimeout(reconnectTimeout);
      }
    };
  }, [addNotification]);

  return (
    <RealtimeUpdatesContext.Provider value={{ isConnected, lastEvent, lastUpdate }}>
      {children}
    </RealtimeUpdatesContext.Provider>
  );
} 
// AlertContext.tsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import socketService from '../services/socketService'; // Adjust path as necessary
import * as Notifications from 'expo-notifications';

interface Alert {
  id: number;
  title: string;
  message: string;
  type: string;
  timestamp: string;
}

interface AlertContextType {
  alerts: Alert[];
  addAlert: (alert: Alert) => void;
}

const AlertContext = createContext<AlertContextType>({
  alerts: [],
  addAlert: () => {},
});

export const AlertProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [alerts, setAlerts] = useState<Alert[]>([]);

  useEffect(() => {
    // Request notification permissions
    const requestPermissions = async () => {
      const { status } = await Notifications.getPermissionsAsync();
      if (status !== 'granted') {
        const { status: newStatus } = await Notifications.requestPermissionsAsync();
        if (newStatus !== 'granted') {
          console.warn('Notification permissions not granted');
        }
      }
    };
    requestPermissions();

    // Connect to the socket
    socketService.connect();

    // Listen for incoming alerts
    socketService.on('alert', (alert: Alert) => {
      setAlerts((prevAlerts) => [alert, ...prevAlerts.slice(0, 49)]); // Limit to 50 alerts
      Notifications.scheduleNotificationAsync({
        content: {
          title: alert.title,
          body: alert.message,
          data: { alertId: alert.id },
        },
        trigger: null, // Show immediately
      });
    });

    // Handle connection errors (optional)
    socketService.on('connect_error', (error) => {
      console.error('Socket connection error:', error);
    });

    // Cleanup on unmount
    return () => {
      socketService.disconnect();
    };
  }, []);

  const addAlert = (alert: Alert) => {
    setAlerts((prevAlerts) => [alert, ...prevAlerts.slice(0, 49)]);
  };

  return (
    <AlertContext.Provider value={{ alerts, addAlert }}>
      {children}
    </AlertContext.Provider>
  );
};

export const useAlerts = () => useContext(AlertContext);
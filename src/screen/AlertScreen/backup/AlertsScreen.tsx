import React, { useEffect, useState } from 'react';
import { View, Text, Alert } from 'react-native';
import io from 'socket.io-client';

const AlertsScreen = () => {
  const [alerts, setAlerts] = useState([]);
  
  useEffect(() => {
    // Connect to your Socket.IO server
    const socket = io('https://your-server-url.com');
    
    // Listen for incoming alerts
    socket.on('emergency_alert', (alertData) => {
      // Add the new alert to state
      setAlerts(prevAlerts => [...prevAlerts, alertData]);
      
      // Show a native notification
      Alert.alert(
        'Emergency Alert',
        alertData.message,
        [{ text: 'OK' }]
      );
    });
    
    // Clean up the socket connection when component unmounts
    return () => {
      socket.disconnect();
    };
  }, []);
  
  return (
    <View>
      <Text>Emergency Alerts</Text>
      {alerts.map((alert, index) => (
        <View key={index}>
          <Text>{alert.title}</Text>
          <Text>{alert.message}</Text>
          <Text>{new Date(alert.timestamp).toLocaleString()}</Text>
        </View>
      ))}
    </View>
  );
};

export default AlertsScreen;
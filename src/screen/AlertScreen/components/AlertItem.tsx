import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface Alert {
  id: number;
  title: string;
  message: string;
  type: string;
  timestamp: string;
}

interface AlertItemProps {
  alert: Alert;
}

const AlertItem: React.FC<AlertItemProps> = ({ alert }) => {
  const getBackgroundColor = () => {
    switch (alert.type.toLowerCase()) {
      case 'warning':
        return '#fff3e0';
      case 'emergency':
        return '#ffebee';
      default:
        return '#f0f0f0';
    }
  };

  return (
    <View style={[styles.alertContainer, { backgroundColor: getBackgroundColor() }]}>
      <Text style={styles.alertTitle}>{alert.title}</Text>
      <Text style={styles.alertMessage}>{alert.message}</Text>
      <Text style={styles.alertTime}>
        {new Date(alert.timestamp).toLocaleString()}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  alertContainer: {
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  alertTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  alertMessage: {
    fontSize: 16,
    color: '#444',
    lineHeight: 22,
  },
  alertTime: {
    fontSize: 12,
    color: '#777',
    marginTop: 5,
    fontStyle: 'italic',
  },
});

export default AlertItem;
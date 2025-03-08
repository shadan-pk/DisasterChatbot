import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { EmergencyType } from '../types';

interface EmergencyMenuProps {
  onClose: () => void;
  onEmergencySelect: (emergencyType: EmergencyType) => void;
  emergencyTypes: EmergencyType[];
}

const EmergencyMenu: React.FC<EmergencyMenuProps> = ({
  onClose,
  onEmergencySelect,
  emergencyTypes,
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Emergency Alerts</Text>
        <TouchableOpacity 
          style={styles.closeButton}
          onPress={onClose}
        >
          <Ionicons name="close" size={24} color="#333" />
        </TouchableOpacity>
      </View>
      <Text style={styles.description}>
        Tap a button below to send an emergency alert with your location.
      </Text>
      <View style={styles.buttonsGrid}>
        {emergencyTypes.map((type) => (
          <TouchableOpacity
            key={type.id}
            style={[styles.button, { backgroundColor: type.color }]}
            onPress={() => onEmergencySelect(type)}
          >
            <Ionicons name={type.icon} size={24} color="#fff" />
            <Text style={styles.buttonText}>{type.name}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
    backgroundColor: '#F5F5F5',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#D32F2F',
  },
  closeButton: {
    padding: 5,
  },
  description: {
    fontSize: 14,
    color: '#666',
    marginBottom: 20,
  },
  buttonsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  button: {
    width: '48%',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginBottom: 15,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    marginTop: 8,
  },
});

export default EmergencyMenu;
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeArea } from '../types';

interface SafeAreaInfoProps {
  safeArea: SafeArea;
  onStartNavigation: () => void;
}

const SafeAreaInfo: React.FC<SafeAreaInfoProps> = ({ safeArea, onStartNavigation }) => {
  const getMarkerColor = (type: string): string => {
    switch (type) {
      case 'shelter':
        return '#4CAF50'; // Green
      case 'hospital':
        return '#F44336'; // Red
      case 'police':
        return '#2196F3'; // Blue
      default:
        return '#9C27B0'; // Purple
    }
  };

  return (
    <View style={styles.safeAreaInfoContainer}>
      <View style={styles.safeAreaInfo}>
        <View style={[styles.safeAreaTypeIndicator, { backgroundColor: getMarkerColor(safeArea.type) }]} />
        <View style={styles.safeAreaTextContainer}>
          <Text style={styles.safeAreaName}>{safeArea.name}</Text>
          <Text style={styles.safeAreaDescription}>{safeArea.description}</Text>
        </View>
      </View>
      
      <TouchableOpacity
        style={styles.startNavigationButton}
        onPress={onStartNavigation}
      >
        <Ionicons name="navigate" size={18} color="white" />
        <Text style={styles.buttonText}>Start Navigation</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  safeAreaInfoContainer: {
    marginTop: 15,
  },
  safeAreaInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  safeAreaTypeIndicator: {
    width: 10,
    height: 40,
    borderRadius: 5,
    marginRight: 15,
  },
  safeAreaTextContainer: {
    flex: 1,
  },
  safeAreaName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  safeAreaDescription: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  startNavigationButton: {
    backgroundColor: '#2196F3',
    borderRadius: 10,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 20,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
    marginLeft: 8,
  },
});

export default SafeAreaInfo;
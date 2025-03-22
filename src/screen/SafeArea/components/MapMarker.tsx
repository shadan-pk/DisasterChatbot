import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Marker } from 'react-native-maps';
import { Ionicons } from '@expo/vector-icons';
import { SafeArea } from '../types';

interface MapMarkerProps {
  safeArea: SafeArea;
  onPress: (safeArea: SafeArea) => void;
}

const MapMarker: React.FC<MapMarkerProps> = ({ safeArea, onPress }) => {
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

  const getMarkerIcon = (type: string): string => {
    switch (type) {
      case 'shelter':
        return 'home';
      case 'hospital':
        return 'medical';
      case 'police':
        return 'shield';
      default:
        return 'location';
    }
  };

  return (
    <Marker
      coordinate={safeArea.coordinate}
      title={safeArea.name}
      description={safeArea.description}
      onPress={() => onPress(safeArea)}
    >
      <View style={[styles.markerContainer, { backgroundColor: getMarkerColor(safeArea.type) }]}>
        <Ionicons name={getMarkerIcon(safeArea.type)} size={16} color="white" />
      </View>
    </Marker>
  );
};

const styles = StyleSheet.create({
  markerContainer: {
    borderRadius: 20,
    padding: 8,
    borderWidth: 1,
    borderColor: 'white',
  },
});

export default MapMarker;
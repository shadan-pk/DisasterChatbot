import React, { useRef, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import MapView, { Polyline, PROVIDER_GOOGLE, Region } from 'react-native-maps';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';

import { SafeAreaNavigationProps, SafeArea, RouteStep } from './types';
import { useLocation } from './hooks/useLocation';
import { calculateDistance } from './utils/location';
import { DirectionsService } from './services/DirectionsService';
import MapMarker from './components/MapMarker';
import NavigationInstructions from './components/NavigationInstructions';
import SafeAreaInfo from './components/SafeAreaInfo';
import { LATITUDE_DELTA, LONGITUDE_DELTA } from './constants';


const SafeAreaNavigation: React.FC<SafeAreaNavigationProps> = ({ navigation }) => {
  const { location, errorMsg, safeAreas, isLoading: isLocationLoading } = useLocation();
//   const [region, setRegion] = useState(null);
  const [region, setRegion] = useState<Region | null>(null);
  const [selectedSafeArea, setSelectedSafeArea] = useState<SafeArea | null>(null);
  const [routeCoordinates, setRouteCoordinates] = useState<any[]>([]);
  const [routeSteps, setRouteSteps] = useState<RouteStep[]>([]);
  const [isNavigating, setIsNavigating] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  
  const mapRef = useRef<MapView | null>(null);

  const findNearestSafeArea = async (): Promise<void> => {
    if (!location) {
      Alert.alert('Error', 'Cannot determine your location. Please try again.');
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Calculate distances to find nearest safe area
      const userLocation = {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude
      };
      
      let nearestArea = safeAreas[0];
      let shortestDistance = calculateDistance(
        userLocation,
        safeAreas[0].coordinate
      );
      
      safeAreas.forEach(area => {
        const distance = calculateDistance(userLocation, area.coordinate);
        if (distance < shortestDistance) {
          shortestDistance = distance;
          nearestArea = area;
        }
      });
      
      setSelectedSafeArea(nearestArea);
      
      // Get directions to the nearest safe area
      const directions = await DirectionsService.getDirections(
        userLocation, 
        nearestArea.coordinate,
        nearestArea.name
      );
      
      setRouteCoordinates(directions.route);
      setRouteSteps(directions.steps);
      
      // Zoom map to show both user and destination
      fitMapToCoordinates([userLocation, nearestArea.coordinate]);
    } catch (error) {
      console.error('Error finding nearest safe area:', error);
      Alert.alert('Error', 'Could not find directions to safe area. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const startNavigation = (): void => {
    if (!selectedSafeArea || routeCoordinates.length === 0) {
      Alert.alert('Error', 'Please select a safe area and get directions first.');
      return;
    }
    
    setIsNavigating(true);
    
    // In a real app, you would implement turn-by-turn navigation here
    // This would involve location updates and guidance through each step
    Alert.alert(
      'Navigation Started',
      `Follow the highlighted route to ${selectedSafeArea.name}. Stay safe!`,
      [{ text: 'OK' }]
    );
  };

  const stopNavigation = (): void => {
    setIsNavigating(false);
    setSelectedSafeArea(null);
    setRouteCoordinates([]);
    setRouteSteps([]);
    
    // Reset map view to user's location
    if (location) {
      setRegion({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: LATITUDE_DELTA,
        longitudeDelta: LONGITUDE_DELTA
      });
    }
  };

  const selectSafeArea = async (safeArea: SafeArea): Promise<void> => {
    if (!location) {
      Alert.alert('Error', 'Cannot determine your location. Please try again.');
      return;
    }
    
    setIsLoading(true);
    setSelectedSafeArea(safeArea);
    
    try {
      const userLocation = {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude
      };
      
      const directions = await DirectionsService.getDirections(
        userLocation, 
        safeArea.coordinate,
        safeArea.name
      );
      
      setRouteCoordinates(directions.route);
      setRouteSteps(directions.steps);
      
      fitMapToCoordinates([userLocation, safeArea.coordinate]);
    } catch (error) {
      console.error('Error getting directions:', error);
      Alert.alert('Error', 'Could not get directions. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const fitMapToCoordinates = (
    coordinates: Array<{ latitude: number; longitude: number }>
  ): void => {
    if (mapRef.current && coordinates.length >= 2) {
      mapRef.current.fitToCoordinates(coordinates, {
        edgePadding: { top: 50, right: 50, bottom: 200, left: 50 },
        animated: true
      });
    }
  };

  if (isLocationLoading && !location) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FF3B30" />
        <Text style={styles.loadingText}>Loading map and location data...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerText}>Safe Areas</Text>
      </View>
      
      {region && (
        <MapView
          ref={mapRef}
          style={styles.map}
          provider={PROVIDER_GOOGLE}
          initialRegion={region}
          showsUserLocation
          showsMyLocationButton
          followsUserLocation
        >
          {/* Render safe area markers */}
          {safeAreas.map((area) => (
            <MapMarker key={area.id} safeArea={area} onPress={selectSafeArea} />
          ))}
          
          {/* Render route if available */}
          {routeCoordinates.length > 0 && (
            <Polyline
              coordinates={routeCoordinates}
              strokeWidth={5}
              strokeColor="#2196F3"
            />
          )}
        </MapView>
      )}
      
      <View style={styles.actionContainer}>
        {isNavigating ? (
          <NavigationInstructions 
            destinationName={selectedSafeArea?.name || ''}
            steps={routeSteps}
            onStopNavigation={stopNavigation}
          />
        ) : (
          <>
            <TouchableOpacity
              style={styles.findButton}
              onPress={findNearestSafeArea}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator size="small" color="white" />
              ) : (
                <>
                  <Ionicons name="locate" size={20} color="white" />
                  <Text style={styles.buttonText}>Find Nearest Safe Area</Text>
                </>
              )}
            </TouchableOpacity>
            
            {selectedSafeArea && (
              <SafeAreaInfo
                safeArea={selectedSafeArea}
                onStartNavigation={startNavigation}
              />
            )}
          </>
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  loadingText: {
    marginTop: 15,
    fontSize: 16,
  },
  header: {
    backgroundColor: '#FF3B30',
    paddingTop: 10,
    paddingBottom: 15,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    zIndex: 10,
  },
  backButton: {
    marginRight: 15,
  },
  headerText: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
  map: {
    flex: 1,
  },
  actionContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -3,
    },
    shadowOpacity: 0.27,
    shadowRadius: 4.65,
    elevation: 6,
    maxHeight: '40%',
  },
  findButton: {
    backgroundColor: '#FF3B30',
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

export default SafeAreaNavigation;
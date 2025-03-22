  import React, { useState, useEffect, useRef } from 'react';
  import { View, Text, StyleSheet, TouchableOpacity, Alert, Dimensions, ActivityIndicator } from 'react-native';
  import * as Location from 'expo-location';
  import MapView, { Marker, Polyline, PROVIDER_GOOGLE, Region } from 'react-native-maps';
  import { Ionicons } from '@expo/vector-icons';
  import { StackNavigationProp } from '@react-navigation/stack';
  import { SafeAreaView } from 'react-native-safe-area-context';

  // Type definitions
  type RootStackParamList = {
    Home: undefined;
    SOSAlert: undefined;
    SafeAreaNavigation: undefined;
  };

  type SafeAreaNavigationProps = {
    navigation: StackNavigationProp<RootStackParamList, 'SafeAreaNavigation'>;
  };

  interface SafeArea {
    id: string;
    name: string;
    description: string;
    coordinate: {
      latitude: number;
      longitude: number;
    };
    type: 'shelter' | 'hospital' | 'police';
  }

  interface RouteStep {
    distance: string;
    duration: string;
    instruction: string;
  }

  const { width, height } = Dimensions.get('window');
  const ASPECT_RATIO = width / height;
  const LATITUDE_DELTA = 0.0922;
  const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

  const SafeAreaNavigation: React.FC<SafeAreaNavigationProps> = ({ navigation }) => {
    const [location, setLocation] = useState<Location.LocationObject | null>(null);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);
    const [safeAreas, setSafeAreas] = useState<SafeArea[]>([]);
    const [selectedSafeArea, setSelectedSafeArea] = useState<SafeArea | null>(null);
    const [routeCoordinates, setRouteCoordinates] = useState<any[]>([]);
    const [routeSteps, setRouteSteps] = useState<RouteStep[]>([]);
    const [isNavigating, setIsNavigating] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [region, setRegion] = useState<Region | null>(null);
    
    const mapRef = useRef<MapView | null>(null);

    // Mock safe areas - in production, these would come from your backend or API
    const mockSafeAreas: SafeArea[] = [
      {
        id: '1',
        name: 'Community Shelter',
        description: 'Emergency shelter with supplies',
        coordinate: { latitude: 37.785834, longitude: -122.406417 },
        type: 'shelter'
      },
      {
        id: '2',
        name: 'Central Hospital',
        description: '24/7 Emergency services',
        coordinate: { latitude: 37.780834, longitude: -122.412417 },
        type: 'hospital'
      },
      {
        id: '3',
        name: 'Police Station',
        description: 'City police headquarters',
        coordinate: { latitude: 37.775834, longitude: -122.408417 },
        type: 'police'
      }
    ];

    useEffect(() => {
      (async () => {
        setIsLoading(true);
        try {
          let { status } = await Location.requestForegroundPermissionsAsync();
          if (status !== 'granted') {
            setErrorMsg('Permission to access location was denied');
            return;
          }

          let location = await Location.getCurrentPositionAsync({
            accuracy: Location.Accuracy.High
          });
          setLocation(location);
          
          // Set initial region based on user's location
          setRegion({
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
            latitudeDelta: LATITUDE_DELTA,
            longitudeDelta: LONGITUDE_DELTA
          });

          // In a real app, you would fetch these from an API based on user's location
          // For this example, we'll adjust our mock data to be near the user's location
          const adjustedSafeAreas = mockSafeAreas.map(area => ({
            ...area,
            coordinate: {
              latitude: location.coords.latitude + (Math.random() - 0.5) * 0.01,
              longitude: location.coords.longitude + (Math.random() - 0.5) * 0.01
            }
          }));
          
          setSafeAreas(adjustedSafeAreas);
        } catch (error) {
          setErrorMsg('Error getting location');
          console.error(error);
        } finally {
          setIsLoading(false);
        }
      })();
    }, []);

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
        await getDirections(userLocation, nearestArea.coordinate);
        
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
        
        await getDirections(userLocation, safeArea.coordinate);
        fitMapToCoordinates([userLocation, safeArea.coordinate]);
      } catch (error) {
        console.error('Error getting directions:', error);
        Alert.alert('Error', 'Could not get directions. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    const getDirections = async (
      origin: { latitude: number; longitude: number },
      destination: { latitude: number; longitude: number }
    ): Promise<void> => {
      try {
        // IMPORTANT: In a production app, you would use the Google Directions API
        // For this example, we'll create a simulated route
        
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Create a simulated route with intermediate points
        const simulatedRoute = createSimulatedRoute(origin, destination);
        setRouteCoordinates(simulatedRoute);
        
        // Create simulated navigation steps
        const simulatedSteps = [
          {
            distance: '0.3 miles',
            duration: '4 mins',
            instruction: 'Head north on Market St'
          },
          {
            distance: '0.5 miles',
            duration: '7 mins',
            instruction: 'Turn right onto Montgomery St'
          },
          {
            distance: '0.2 miles',
            duration: '3 mins',
            instruction: `Arrive at destination: ${selectedSafeArea?.name}`
          }
        ];
        setRouteSteps(simulatedSteps);
        
        // NOTE: In a real app, you would use the Google Directions API:
        // const apiKey = 'YOUR_GOOGLE_API_KEY';
        // const response = await fetch(
        //   `https://maps.googleapis.com/maps/api/directions/json?origin=${origin.latitude},${origin.longitude}&destination=${destination.latitude},${destination.longitude}&key=${apiKey}`
        // );
        // const data = await response.json();
        // if (data.routes.length) {
        //   const points = decodePolyline(data.routes[0].overview_polyline.points);
        //   setRouteCoordinates(points);
        //   setRouteSteps(data.routes[0].legs[0].steps.map(step => ({
        //     distance: step.distance.text,
        //     duration: step.duration.text,
        //     instruction: step.html_instructions.replace(/<[^>]*>/g, '')
        //   })));
        // }
      } catch (error) {
        console.error('Error getting directions:', error);
        throw error;
      }
    };

    const createSimulatedRoute = (
      start: { latitude: number; longitude: number },
      end: { latitude: number; longitude: number }
    ): Array<{ latitude: number; longitude: number }> => {
      const points = [];
      const steps = 8; // Number of points in the route
      
      for (let i = 0; i <= steps; i++) {
        const lat = start.latitude + (end.latitude - start.latitude) * (i / steps);
        const lng = start.longitude + (end.longitude - start.longitude) * (i / steps);
        
        // Add some randomness to make it look like a real route
        const jitter = i > 0 && i < steps ? (Math.random() - 0.5) * 0.001 : 0;
        
        points.push({
          latitude: lat + jitter,
          longitude: lng + jitter
        });
      }
      
      return points;
    };

    const calculateDistance = (
      point1: { latitude: number; longitude: number },
      point2: { latitude: number; longitude: number }
    ): number => {
      const R = 6371; // Earth's radius in km
      const dLat = deg2rad(point2.latitude - point1.latitude);
      const dLon = deg2rad(point2.longitude - point1.longitude);
      const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(deg2rad(point1.latitude)) * Math.cos(deg2rad(point2.latitude)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      return R * c;
    };

    const deg2rad = (deg: number): number => {
      return deg * (Math.PI / 180);
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

    if (isLoading && !location) {
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
              <Marker
                key={area.id}
                coordinate={area.coordinate}
                title={area.name}
                description={area.description}
                pinColor={getMarkerColor(area.type)}
                onPress={() => selectSafeArea(area)}
              >
                <View style={[styles.markerContainer, { backgroundColor: getMarkerColor(area.type) }]}>
                  <Ionicons name={getMarkerIcon(area.type)} size={16} color="white" />
                </View>
              </Marker>
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
            <View style={styles.navigationContainer}>
              <View style={styles.navigationHeader}>
                <Text style={styles.navigationTitle}>
                  Navigating to {selectedSafeArea?.name}
                </Text>
                <TouchableOpacity
                  style={styles.stopButton}
                  onPress={stopNavigation}
                >
                  <Text style={styles.stopButtonText}>End Navigation</Text>
                </TouchableOpacity>
              </View>
              
              <View style={styles.stepsContainer}>
                {routeSteps.map((step, index) => (
                  <View key={index} style={styles.stepItem}>
                    <View style={styles.stepIconContainer}>
                      <Text style={styles.stepNumber}>{index + 1}</Text>
                    </View>
                    <View style={styles.stepContent}>
                      <Text style={styles.stepInstruction}>{step.instruction}</Text>
                      <Text style={styles.stepDetails}>
                        {step.distance} • {step.duration}
                      </Text>
                    </View>
                  </View>
                ))}
              </View>
            </View>
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
                <View style={styles.safeAreaInfoContainer}>
                  <View style={styles.safeAreaInfo}>
                    <View style={[styles.safeAreaTypeIndicator, { backgroundColor: getMarkerColor(selectedSafeArea.type) }]} />
                    <View style={styles.safeAreaTextContainer}>
                      <Text style={styles.safeAreaName}>{selectedSafeArea.name}</Text>
                      <Text style={styles.safeAreaDescription}>{selectedSafeArea.description}</Text>
                    </View>
                  </View>
                  
                  <TouchableOpacity
                    style={styles.startNavigationButton}
                    onPress={startNavigation}
                  >
                    <Ionicons name="navigate" size={18} color="white" />
                    <Text style={styles.buttonText}>Start Navigation</Text>
                  </TouchableOpacity>
                </View>
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
    markerContainer: {
      borderRadius: 20,
      padding: 8,
      borderWidth: 1,
      borderColor: 'white',
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
    navigationContainer: {
      paddingBottom: 15,
    },
    navigationHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 10,
    },
    navigationTitle: {
      fontSize: 18,
      fontWeight: 'bold',
    },
    stopButton: {
      backgroundColor: '#FF3B30',
      borderRadius: 8,
      paddingVertical: 8,
      paddingHorizontal: 12,
    },
    stopButtonText: {
      color: 'white',
      fontWeight: 'bold',
    },
    stepsContainer: {
      maxHeight: 200,
    },
    stepItem: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      marginBottom: 12,
      paddingBottom: 12,
      borderBottomWidth: 1,
      borderBottomColor: '#eee',
    },
    stepIconContainer: {
      width: 24,
      height: 24,
      borderRadius: 12,
      backgroundColor: '#2196F3',
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: 12,
      marginTop: 2,
    },
    stepNumber: {
      color: 'white',
      fontWeight: 'bold',
      fontSize: 12,
    },
    stepContent: {
      flex: 1,
    },
    stepInstruction: {
      fontSize: 14,
      fontWeight: '500',
    },
    stepDetails: {
      fontSize: 12,
      color: '#666',
      marginTop: 2,
    },
  });

  export default SafeAreaNavigation;
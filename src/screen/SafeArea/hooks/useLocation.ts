import { useState, useEffect } from 'react';
import * as Location from 'expo-location';
import { Region } from 'react-native-maps';
import { SafeArea } from '../types';
import { LATITUDE_DELTA, LONGITUDE_DELTA, MOCK_SAFE_AREAS } from '../constants';

interface UseLocationReturn {
  location: Location.LocationObject | null;
  errorMsg: string | null;
  region: Region | null;
  safeAreas: SafeArea[];
  isLoading: boolean;
}

export const useLocation = (): UseLocationReturn => {
  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [region, setRegion] = useState<Region | null>(null);
  const [safeAreas, setSafeAreas] = useState<SafeArea[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

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
        const adjustedSafeAreas = MOCK_SAFE_AREAS.map(area => ({
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

  return {
    location,
    errorMsg,
    region,
    safeAreas,
    isLoading
  };
};
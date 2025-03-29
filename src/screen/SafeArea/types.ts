import { StackNavigationProp } from '@react-navigation/stack';
import { Region } from 'react-native-maps';
import * as Location from 'expo-location';

export type RootStackParamList = {
  Home: undefined;
  SOSAlert: undefined;
  SafeAreaNavigation: undefined;
};

export type SafeAreaNavigationProps = {
  navigation: StackNavigationProp<RootStackParamList, 'SafeAreaNavigation'>;
};

export interface SafeArea {
  id: string;
  name: string;
  description: string;
  coordinate: {
    latitude: number;
    longitude: number;
  };
  type: 'shelter' | 'hospital' | 'police';
}

export interface RouteStep {
  distance: string;
  duration: string;
  instruction: string;
}

export interface AppState {
  location: Location.LocationObject | null;
  errorMsg: string | null;
  safeAreas: SafeArea[];
  selectedSafeArea: SafeArea | null;
  routeCoordinates: any[];
  routeSteps: RouteStep[];
  isNavigating: boolean;
  isLoading: boolean;
  region: Region | null;
}
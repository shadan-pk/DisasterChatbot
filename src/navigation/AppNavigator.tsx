import React, { useEffect, useState } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import SplashScreen from '../screen/SplashScreen';
import LoginScreen from '../screen/LoginScreen';
import SignupScreen from '../screen/SignupScreen';
import HomeScreen from '../screen/HomeScreen';
import ProfileScreen  from '../screen/ProfileScreen';
import EditProfileScreen from '../screen/EditProfileScreen';
import OfflineHelpScreen from '../screen/offlineHelpScreen';
import ChatScreen from '../screen/ChatbotScreen/screens/ChatScreen';
import SOSAlert  from '../screen/SOSAlert';
import SurvivalGuidance  from '../screen/SurvivalGuidance';
import SafeAreaNavigation from '../screen/SafeArea/backup/SafeAreaNavigation';
import AlertItem from '../screen/AlertScreen/screens/AlertScreen';
// import WeatherDisplay from '../screen/WeatherInfo/WeatherDisplay';
// import AlertItem from '../screen/AlertScreen/backup/AlertsScreen';




// Define available screens and their parameters
export type RootStackParamList = {
  Splash: undefined;
  Login: undefined;
  Signup: undefined;
  Home: undefined;
  OfflineHelp: undefined;
  Flashlight: undefined;
  Alarm: undefined;
  LocationShare: undefined;
  EmergencyContacts: undefined;
  SurvivalGuidance: undefined;
  QuickMessages: undefined;
  SOSAlert: undefined;
  ProfileScreen: undefined;
  EditProfileScreen: undefined;
  ChatScreen: undefined;
  SafeAreaNavigation: undefined;
  AlertItem: undefined;
  // WeatherDisplay: { weatherData: any };
};


const Stack = createStackNavigator<RootStackParamList>();

const AppNavigator: React.FC = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Splash" screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Splash" component={SplashScreen} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Signup" component={SignupScreen} />
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="OfflineHelp" component={OfflineHelpScreen} />
        <Stack.Screen name="ProfileScreen" component={ProfileScreen} />
        <Stack.Screen name="EditProfileScreen" component={EditProfileScreen} />
        <Stack.Screen name="ChatScreen" component={ChatScreen} />
        <Stack.Screen name="SOSAlert" component={SOSAlert} />
        <Stack.Screen name="SurvivalGuidance" component={SurvivalGuidance} />
        <Stack.Screen name="SafeAreaNavigation" component={SafeAreaNavigation} />
        <Stack.Screen name="AlertItem" component={AlertItem} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;

// // App.tsx
import React from 'react';
import * as Notifications from 'expo-notifications';
import { AlertProvider } from './src/screen/AlertContext'; // Adjust path based on your project structure
import AppNavigator from './src/navigation/AppNavigator';

// Configure notification handler
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,    // Show notification even when app is in foreground
    shouldPlaySound: true,   // Optional: enable sound if desired
    shouldSetBadge: true,    // Optional: enable badge if desired
  }),
});

const App: React.FC = () => {
  return (
    <AlertProvider>
      <AppNavigator />
    </AlertProvider>
  );
};

export default App;
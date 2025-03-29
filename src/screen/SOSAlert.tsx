import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, Linking, Platform, ScrollView } from 'react-native';
import * as Location from 'expo-location';
import { Ionicons } from '@expo/vector-icons';
import { StackNavigationProp } from '@react-navigation/stack';

// Define your navigation param list type
type RootStackParamList = {
  Home: undefined;
  SOSAlert: undefined;
  // Add other screens as needed
};

// Define props type for the component
type SOSAlertProps = {
  navigation: StackNavigationProp<RootStackParamList, 'SOSAlert'>;
};

const SOSAlert: React.FC<SOSAlertProps> = ({ navigation }) => {
  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [countdown, setCountdown] = useState<number>(5);
  const [isCountingDown, setIsCountingDown] = useState<boolean>(false);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setLocation(location);
    })();
  }, []);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isCountingDown && countdown > 0) {
      interval = setInterval(() => {
        setCountdown(countdown - 1);
      }, 1000);
    } else if (countdown === 0) {
      callEmergencyServices();
      setIsCountingDown(false);
      setCountdown(5);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [countdown, isCountingDown]);

  const startCountdown = (): void => {
    Alert.alert(
      "Emergency Call",
      "Starting 5-second countdown to call emergency services. Tap 'Cancel' to stop.",
      [
        {
          text: "Cancel",
          onPress: () => setIsCountingDown(false),
          style: "cancel"
        },
        {
          text: "Continue",
          onPress: () => setIsCountingDown(true)
        }
      ]
    );
  };

  const callEmergencyServices = (): void => {
    const emergencyNumber = Platform.OS === 'android' ? 'tel:100' : 'telprompt:100';
    Linking.openURL(emergencyNumber).catch(err => {
      Alert.alert('Failed to make emergency call', 'Please dial emergency services manually');
    });
  };

  const sendSMS = (): void => {
    let messageBody = 'EMERGENCY: I need help!';
    
    if (location) {
      const { latitude, longitude } = location.coords;
      messageBody += `\nMy current location: https://maps.google.com/?q=${latitude},${longitude}`;
    }
    
    const url = Platform.select({
      ios: `sms:&body=${encodeURIComponent(messageBody)}`,
      android: `sms:?body=${encodeURIComponent(messageBody)}`
    });
    
    if (url) {
      Linking.openURL(url).catch(err => {
        Alert.alert('Failed to open SMS app', 'Please send emergency message manually');
      });
    }
  };

  const shareLocation = (): void => {
    if (!location) {
      Alert.alert('Location not available', 'Please wait while we get your location or check your location permissions.');
      return;
    }
    
    const { latitude, longitude } = location.coords;
    const mapUrl = `https://maps.google.com/?q=${latitude},${longitude}`;
    
    Linking.canOpenURL(mapUrl).then(supported => {
      if (supported) {
        Linking.openURL(mapUrl);
      } else {
        Alert.alert('Cannot open map link', 'Please manually share your coordinates.');
      }
    });
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerText}>Emergency SOS</Text>
      </View>
      
      <View style={styles.content}>
        {isCountingDown ? (
          <View style={styles.countdownContainer}>
            <Text style={styles.countdownText}>Calling emergency services in</Text>
            <Text style={styles.countdownNumber}>{countdown}</Text>
            <TouchableOpacity 
              style={styles.cancelButton} 
              onPress={() => setIsCountingDown(false)}>
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <>
            <TouchableOpacity 
              style={styles.emergencyButton} 
              onPress={startCountdown}>
              <Ionicons name="call" size={32} color="white" />
              <Text style={styles.buttonText}>Call Emergency Services</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.actionButton} 
              onPress={sendSMS}>
              <Ionicons name="chatbubble" size={24} color="white" />
              <Text style={styles.actionButtonText}>Send Emergency SMS</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.actionButton} 
              onPress={shareLocation}>
              <Ionicons name="location" size={24} color="white" />
              <Text style={styles.actionButtonText}>Share My Location</Text>
            </TouchableOpacity>
            
            <View style={styles.infoCard}>
              <Text style={styles.infoTitle}>Your Current Status:</Text>
              {errorMsg ? (
                <Text style={styles.infoText}>{errorMsg}</Text>
              ) : !location ? (
                <Text style={styles.infoText}>Getting your location...</Text>
              ) : (
                <Text style={styles.infoText}>
                  Location ready to share{'\n'}
                  Latitude: {location.coords.latitude.toFixed(6)}{'\n'}
                  Longitude: {location.coords.longitude.toFixed(6)}
                </Text>
              )}
            </View>

            <View style={styles.infoCard}>
              <Text style={styles.infoTitle}>Emergency Contacts:</Text>
              <Text style={styles.infoText}>
                Police: 911{'\n'}
                Ambulance: 911{'\n'}
                Fire Department: 911
              </Text>
            </View>
          </>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#FF3B30',
    paddingTop: 50,
    paddingBottom: 20,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    marginRight: 15,
  },
  headerText: {
    color: 'white',
    fontSize: 22,
    fontWeight: 'bold',
  },
  content: {
    padding: 20,
    alignItems: 'center',
  },
  emergencyButton: {
    backgroundColor: '#FF3B30',
    borderRadius: 12,
    width: '100%',
    height: 100,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.27,
    shadowRadius: 4.65,
    elevation: 6,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 10,
  },
  actionButton: {
    backgroundColor: '#007AFF',
    borderRadius: 8,
    width: '100%',
    padding: 15,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },
  actionButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 10,
  },
  infoCard: {
    backgroundColor: 'white',
    borderRadius: 8,
    width: '100%',
    padding: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    elevation: 3,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  infoText: {
    fontSize: 14,
    lineHeight: 20,
  },
  countdownContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 300,
  },
  countdownText: {
    fontSize: 20,
    marginBottom: 15,
  },
  countdownNumber: {
    fontSize: 80,
    fontWeight: 'bold',
    color: '#FF3B30',
  },
  cancelButton: {
    backgroundColor: '#FF3B30',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 8,
    marginTop: 20,
  },
  cancelButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default SOSAlert;
// Enhanced ChatScreen.tsx with emergency alert functionality

import React, { useState, useRef, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  SafeAreaView,
  ScrollView,
  Alert,
  PermissionsAndroid,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { FIREBASE_AUTH, FIREBASE_DB } from '../../../../FirebaseConfig';
import { collection, addDoc, serverTimestamp, query, orderBy, onSnapshot, doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import * as Location from 'expo-location';

// Define message interface
interface Message {
  id?: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp?: any;
  isEmergency?: boolean;
}

// Emergency type interface
interface EmergencyType {
  id: string;
  name: string;
  icon: string;
  color: string;
}

// Location interface
interface LocationData {
  latitude: number;
  longitude: number;
  accuracy?: number;
  address?: string;
}

// Your API configuration
const API_KEY = 'YOUR_API_KEY'; // Replace with your actual API key
const API_URL = 'YOUR_MODEL_ENDPOINT'; // Replace with your model's endpoint URL

const ChatScreen = ({ navigation }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [userName, setUserName] = useState('');
  const [userLocation, setUserLocation] = useState<LocationData | null>(null);
  const [isEmergencyMenuOpen, setIsEmergencyMenuOpen] = useState(false);
  const [policeStation, setPoliceStation] = useState('');
  const [userAddress, setUserAddress] = useState('');
  const [userPhone, setUserPhone] = useState('');
  const flatListRef = useRef<FlatList>(null);

  // Emergency types
  const emergencyTypes: EmergencyType[] = [
    { id: 'flood', name: 'Flood', icon: 'water', color: '#3498db' },
    { id: 'earthquake', name: 'Earthquake', icon: 'earth', color: '#e67e22' },
    { id: 'fire', name: 'Fire', icon: 'flame', color: '#e74c3c' },
    { id: 'medical', name: 'Medical', icon: 'medkit', color: '#2ecc71' },
    { id: 'crime', name: 'Crime', icon: 'warning', color: '#9b59b6' },
  ];

  // Fetch user data
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userId = FIREBASE_AUTH.currentUser?.uid;
        if (userId) {
          const userDoc = await getDoc(doc(FIREBASE_DB, 'users', userId));
          if (userDoc.exists()) {
            const userData = userDoc.data();
            setUserName(`${userData.firstName || ''} ${userData.lastName || ''}`.trim());
            setPoliceStation(userData.policeStation || '');
            setUserAddress(userData.address || '');
            setUserPhone(userData.phone || '');
          }
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUserData();
    
    // Request location permission
    requestLocationPermission();
    
    // Add initial greeting message
    setMessages([
      {
        id: 'welcome-msg',
        text: 'Hello! I\'m here to help. You can use the emergency buttons below or type your message.',
        sender: 'bot',
        timestamp: new Date(),
      },
    ]);
  }, []);

  // Request location permission
  const requestLocationPermission = async () => {
    if (Platform.OS === 'ios') {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Denied', 'We need location permission to send emergency alerts.');
        return;
      }
    } else {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          {
            title: 'Location Permission',
            message: 'We need your location to send emergency alerts.',
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
          },
        );
        if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
          Alert.alert('Permission Denied', 'We need location permission to send emergency alerts.');
          return;
        }
      } catch (err) {
        console.warn(err);
      }
    }
    
    // Get current location
    getCurrentLocation();
  };

  // Get current location
  const getCurrentLocation = async () => {
    try {
      const { coords } = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });
      
      // Get address from coordinates
      const [address] = await Location.reverseGeocodeAsync({
        latitude: coords.latitude,
        longitude: coords.longitude,
      });
      
      const locationData: LocationData = {
        latitude: coords.latitude,
        longitude: coords.longitude,
        accuracy: coords.accuracy,
        address: `${address.street || ''}, ${address.city || ''}, ${address.region || ''}, ${address.postalCode || ''}, ${address.country || ''}`,
      };
      
      setUserLocation(locationData);
    } catch (error) {
      console.error('Error getting location:', error);
      Alert.alert('Location Error', 'Unable to get your current location. Please ensure location services are enabled.');
    }
  };

  // Save messages to Firestore
  const saveMessageToFirestore = async (message: Message) => {
    try {
      const userId = FIREBASE_AUTH.currentUser?.uid;
      if (!userId) return;

      await addDoc(collection(FIREBASE_DB, 'users', userId, 'chatHistory'), {
        text: message.text,
        sender: message.sender,
        timestamp: serverTimestamp(),
        isEmergency: message.isEmergency || false,
      });
    } catch (error) {
      console.error('Error saving message:', error);
    }
  };

  // Load chat history from Firestore
  useEffect(() => {
    const userId = FIREBASE_AUTH.currentUser?.uid;
    if (!userId) return;

    const q = query(
      collection(FIREBASE_DB, 'users', userId, 'chatHistory'),
      orderBy('timestamp', 'asc')
    );

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const loadedMessages: Message[] = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        loadedMessages.push({
          id: doc.id,
          text: data.text,
          sender: data.sender,
          timestamp: data.timestamp,
          isEmergency: data.isEmergency || false,
        });
      });
      
      if (loadedMessages.length > 0) {
        setMessages(loadedMessages);
      }
    });

    return () => unsubscribe();
  }, []);

  // Send message to AI model
  const sendMessageToAI = async (userMessage: string, isEmergency: boolean = false) => {
    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${API_KEY}`,
        },
        body: JSON.stringify({
          messages: [
            // You can include context about the user here
            { role: 'system', content: `You are chatting with ${userName}. ${isEmergency ? 'This is an EMERGENCY situation. Be concise and helpful.' : 'Be helpful and friendly.'}` },
            { role: 'user', content: userMessage },
          ],
          max_tokens: 500,
        }),
      });

      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
      }

      const data = await response.json();
      const botReply = data.choices[0].message.content;
      
      const botMessage: Message = {
        text: botReply,
        sender: 'bot',
        timestamp: new Date(),
        isEmergency: isEmergency,
      };
      
      setMessages(prevMessages => [...prevMessages, botMessage]);
      saveMessageToFirestore(botMessage);
    } catch (error) {
      console.error('Error sending message to AI:', error);
      const errorMessage: Message = {
        text: isEmergency 
          ? 'Emergency alert has been sent to authorities. Stay safe and follow local emergency protocols.'
          : 'Sorry, I encountered an error processing your request. Please try again later.',
        sender: 'bot',
        timestamp: new Date(),
        isEmergency: isEmergency,
      };
      setMessages(prevMessages => [...prevMessages, errorMessage]);
      saveMessageToFirestore(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle sending a message
  const handleSend = () => {
    if (inputText.trim() === '') return;
    
    const userMessage: Message = {
      text: inputText.trim(),
      sender: 'user',
      timestamp: new Date(),
    };
    
    setMessages(prevMessages => [...prevMessages, userMessage]);
    saveMessageToFirestore(userMessage);
    setInputText('');
    setIsLoading(true);
    
    // Send message to AI
    sendMessageToAI(inputText.trim());
  };

  // Handle emergency alert
  const handleEmergency = async (emergencyType: EmergencyType) => {
    // Close emergency menu
    setIsEmergencyMenuOpen(false);
    
    // Update location before sending alert
    await getCurrentLocation();
    
    if (!userLocation) {
      Alert.alert('Location Unavailable', 'We cannot send an emergency alert without your location. Please enable location services and try again.');
      return;
    }
    
    // Create emergency message
    const emergencyMessage: Message = {
      text: `EMERGENCY: ${emergencyType.name} reported`,
      sender: 'user',
      timestamp: new Date(),
      isEmergency: true,
    };
    
    // Add emergency message to chat
    setMessages(prevMessages => [...prevMessages, emergencyMessage]);
    saveMessageToFirestore(emergencyMessage);
    
    // Send emergency alert to Firestore
    try {
      setIsLoading(true);
      
      const userId = FIREBASE_AUTH.currentUser?.uid;
      if (!userId) {
        throw new Error('User not authenticated');
      }
      
      // Create emergency alert in Firestore
      const alertRef = await addDoc(collection(FIREBASE_DB, 'emergencyAlerts'), {
        userId,
        userName,
        emergencyType: emergencyType.id,
        emergencyName: emergencyType.name,
        location: {
          latitude: userLocation.latitude,
          longitude: userLocation.longitude,
          address: userLocation.address,
        },
        userAddress,
        userPhone,
        policeStation,
        status: 'pending',
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      
      // Send auto response from chatbot
      const autoResponse: Message = {
        text: `Emergency alert for ${emergencyType.name} has been sent to authorities. Your current location has been shared. Stay safe and follow local emergency protocols. An official will contact you shortly.`,
        sender: 'bot',
        timestamp: new Date(),
        isEmergency: true,
      };
      
      setMessages(prevMessages => [...prevMessages, autoResponse]);
      saveMessageToFirestore(autoResponse);
      
      // Send message to AI for additional guidance
      sendMessageToAI(`I have a ${emergencyType.name} emergency. Please provide immediate safety guidance.`, true);
      
      // Update user status in Firestore
      await updateDoc(doc(FIREBASE_DB, 'users', userId), {
        lastEmergency: {
          type: emergencyType.id,
          alertId: alertRef.id,
          timestamp: serverTimestamp(),
        },
      });
      
    } catch (error) {
      console.error('Error sending emergency alert:', error);
      Alert.alert('Error', 'Failed to send emergency alert. Please try again or call emergency services directly.');
      setIsLoading(false);
    }
  };

  // Scroll to bottom when messages change
  useEffect(() => {
    if (messages.length > 0 && flatListRef.current) {
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 200);
    }
  }, [messages]);

  // Render a chat message
  const renderMessage = ({ item }: { item: Message }) => (
    <View style={[
      styles.messageBubble,
      item.sender === 'user' ? styles.userMessage : styles.botMessage,
      item.isEmergency && item.sender === 'user' ? styles.emergencyUserMessage : null,
      item.isEmergency && item.sender === 'bot' ? styles.emergencyBotMessage : null,
    ]}>
      {item.isEmergency && (
        <View style={styles.emergencyBadge}>
          <Ionicons name="warning" size={12} color="#fff" />
          <Text style={styles.emergencyBadgeText}>EMERGENCY</Text>
        </View>
      )}
      <Text style={[
        styles.messageText,
        item.isEmergency ? styles.emergencyMessageText : null
      ]}>
        {item.text}
      </Text>
      <Text style={styles.timestamp}>
        {item.timestamp ? 
          (item.timestamp instanceof Date ? 
            item.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 
            new Date(item.timestamp.toDate()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          ) : ''}
      </Text>
    </View>
  );

  // Render emergency buttons
  const renderEmergencyButtons = () => (
    <View style={styles.emergencyContainer}>
      <View style={styles.emergencyHeader}>
        <Text style={styles.emergencyTitle}>Emergency Alerts</Text>
        <TouchableOpacity 
          style={styles.closeButton}
          onPress={() => setIsEmergencyMenuOpen(false)}
        >
          <Ionicons name="close" size={24} color="#333" />
        </TouchableOpacity>
      </View>
      <Text style={styles.emergencyDescription}>
        Tap a button below to send an emergency alert with your location.
      </Text>
      <View style={styles.emergencyButtonsGrid}>
        {emergencyTypes.map((type) => (
          <TouchableOpacity
            key={type.id}
            style={[styles.emergencyButton, { backgroundColor: type.color }]}
            onPress={() => handleEmergency(type)}
          >
            <Ionicons name={type.icon} size={24} color="#fff" />
            <Text style={styles.emergencyButtonText}>{type.name}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="auto" />
      
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Emergency Assistant</Text>
      </View>
      
      {isEmergencyMenuOpen ? (
        renderEmergencyButtons()
      ) : (
        <FlatList
          ref={flatListRef}
          data={messages}
          renderItem={renderMessage}
          keyExtractor={(item, index) => item.id || `msg-${index}`}
          contentContainerStyle={styles.messagesList}
        />
      )}
      
      {isLoading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator color="#007AFF" size="small" />
          <Text style={styles.loadingText}>AI is typing...</Text>
        </View>
      )}
      
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
      >
        <View style={styles.inputContainer}>
          <TouchableOpacity
            style={styles.emergencyMenuButton}
            onPress={() => setIsEmergencyMenuOpen(!isEmergencyMenuOpen)}
          >
            <Ionicons name="warning" size={24} color="red" />
          </TouchableOpacity>
          
          <TextInput
            style={styles.input}
            value={inputText}
            onChangeText={setInputText}
            placeholder="Type a message..."
            multiline
            maxLength={500}
          />
          
          <TouchableOpacity 
            style={[styles.sendButton, !inputText.trim() && styles.sendButtonDisabled]}
            onPress={handleSend}
            disabled={!inputText.trim() || isLoading}
          >
            <Ionicons name="send" size={20} color={inputText.trim() ? "#fff" : "#A0A0A0"} />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
    backgroundColor: '#FFFFFF',
  },
  backButton: {
    padding: 5,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 15,
  },
  messagesList: {
    padding: 15,
    paddingBottom: 20,
  },
  messageBubble: {
    maxWidth: '80%',
    padding: 12,
    borderRadius: 16,
    marginBottom: 12,
  },
  userMessage: {
    alignSelf: 'flex-end',
    backgroundColor: '#DCF8C6',
    borderBottomRightRadius: 4,
  },
  botMessage: {
    alignSelf: 'flex-start',
    backgroundColor: '#FFFFFF',
    borderBottomLeftRadius: 4,
  },
  emergencyUserMessage: {
    backgroundColor: '#FFCDD2',
  },
  emergencyBotMessage: {
    backgroundColor: '#FFEBEE',
  },
  emergencyBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#D32F2F',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
    alignSelf: 'flex-start',
    marginBottom: 6,
  },
  emergencyBadgeText: {
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold',
    marginLeft: 4,
  },
  messageText: {
    fontSize: 16,
    color: '#333333',
  },
  emergencyMessageText: {
    fontWeight: '500',
  },
  timestamp: {
    fontSize: 11,
    color: '#7F7F7F',
    alignSelf: 'flex-end',
    marginTop: 4,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  input: {
    flex: 1,
    backgroundColor: '#F0F0F0',
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 10,
    maxHeight: 100,
    fontSize: 16,
  },
  sendButton: {
    backgroundColor: '#007AFF',
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 10,
  },
  sendButtonDisabled: {
    backgroundColor: '#E0E0E0',
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    backgroundColor: '#F0F0F0',
    borderRadius: 16,
    alignSelf: 'flex-start',
    marginHorizontal: 15,
    marginBottom: 10,
  },
  loadingText: {
    fontSize: 14,
    color: '#7F7F7F',
    marginLeft: 5,
  },
  emergencyMenuButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#FFEBEE',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  emergencyContainer: {
    flex: 1,
    padding: 15,
    backgroundColor: '#F5F5F5',
  },
  emergencyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  emergencyTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#D32F2F',
  },
  closeButton: {
    padding: 5,
  },
  emergencyDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 20,
  },
  emergencyButtonsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  emergencyButton: {
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
  emergencyButtonText: {
    color: 'white',
    fontWeight: 'bold',
    marginTop: 8,
  },
});

export default ChatScreen;
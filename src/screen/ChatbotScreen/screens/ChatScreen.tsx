import React, { useState, useRef, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  SafeAreaView,
  Alert,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';

// Import components
import ChatHeader from '../components/ChatHeader';
import MessageBubble from '../components/MessageBubble';
import ChatInput from '../components/ChatInput';
import EmergencyMenu from '../components/EmergencyMenu';

// Import services
import { LocationService } from '../services/LocationService';
import { FirestoreService } from '../services/FirestoreService';
import { AIService } from '../services/AIService';

// Import types
import { Message, EmergencyType, LocationData, UserData } from '../types';

const ChatScreen = ({ navigation }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [userName, setUserName] = useState('');
  const [userLocation, setUserLocation] = useState<LocationData | null>(null);
  const [isEmergencyMenuOpen, setIsEmergencyMenuOpen] = useState(false);
  const [userData, setUserData] = useState<UserData>({});
  const flatListRef = useRef<FlatList>(null);

  // Emergency types
  const emergencyTypes: EmergencyType[] = [
    { id: 'flood', name: 'Flood', icon: 'water', color: '#3498db' },
    { id: 'earthquake', name: 'Earthquake', icon: 'earth', color: '#e67e22' },
    { id: 'fire', name: 'Fire', icon: 'flame', color: '#e74c3c' },
    { id: 'medical', name: 'Medical', icon: 'medkit', color: '#2ecc71' },
    { id: 'crime', name: 'Crime', icon: 'warning', color: '#9b59b6' },
  ];

  // Initialize app
  useEffect(() => {
    const initializeApp = async () => {
      // Fetch user data
      const userDataResult = await FirestoreService.getUserData();
      setUserData(userDataResult);
      setUserName(`${userDataResult.firstName || ''} ${userDataResult.lastName || ''}`.trim());
      
      // Request location permission
      await LocationService.requestLocationPermission();
      const location = await LocationService.getCurrentLocation();
      setUserLocation(location);
      
      // Add initial greeting message
      addBotMessage('Hello! I\'m here to help. You can use the emergency buttons below or type your message.');
    };

    initializeApp();
    
    // Subscribe to messages
    const unsubscribe = FirestoreService.subscribeToMessages(setMessages);
    
    return () => unsubscribe();
  }, []);

  // Add bot message helper
  const addBotMessage = (text: string, isEmergency: boolean = false) => {
    const botMessage: Message = {
      text,
      sender: 'bot',
      timestamp: new Date(),
      isEmergency,
    };
    
    setMessages(prevMessages => [...prevMessages, botMessage]);
    FirestoreService.saveMessage(botMessage);
  };

  // Handle sending a message
  const handleSend = async () => {
    if (inputText.trim() === '') return;
    
    // Add user message to chat
    const userMessage: Message = {
      text: inputText.trim(),
      sender: 'user',
      timestamp: new Date(),
    };
    
    setMessages(prevMessages => [...prevMessages, userMessage]);
    FirestoreService.saveMessage(userMessage);
    setInputText('');
    setIsLoading(true);
    
    // Send message to AI
    const botReply = await AIService.sendMessage(inputText.trim(), userName);
    setIsLoading(false);
    
    if (botReply) {
      addBotMessage(botReply);
    } else {
      addBotMessage('Sorry, I encountered an error processing your request. Please try again later.');
    }
  };

  // Handle emergency alert
  const handleEmergency = async (emergencyType: EmergencyType) => {
    // Close emergency menu
    setIsEmergencyMenuOpen(false);
    
    // Update location before sending alert
    const updatedLocation = await LocationService.getCurrentLocation();
    setUserLocation(updatedLocation);
    
    if (!updatedLocation) {
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
    FirestoreService.saveMessage(emergencyMessage);
    
    // Send emergency alert to Firestore
    setIsLoading(true);
    const alertId = await FirestoreService.sendEmergencyAlert(emergencyType, updatedLocation, userData);
    
    if (alertId) {
      // Send auto response from chatbot
      addBotMessage(
        `Emergency alert for ${emergencyType.name} has been sent to authorities. Your current location has been shared. Stay safe and follow local emergency protocols. An official will contact you shortly.`,
        true
      );
      
      // Send message to AI for additional guidance
      const botReply = await AIService.sendMessage(
        `I have a ${emergencyType.name} emergency. Please provide immediate safety guidance.`, 
        userName,
        true
      );
      
      if (botReply) {
        addBotMessage(botReply, true);
      }
    } else {
      Alert.alert('Error', 'Failed to send emergency alert. Please try again or call emergency services directly.');
    }
    
    setIsLoading(false);
  };

  // Scroll to bottom when messages change
  useEffect(() => {
    if (messages.length > 0 && flatListRef.current) {
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 200);
    }
  }, [messages]);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="auto" />
      
      <ChatHeader onBackPress={() => navigation.goBack()} />
      
      {isEmergencyMenuOpen ? (
        <EmergencyMenu
          onClose={() => setIsEmergencyMenuOpen(false)}
          onEmergencySelect={handleEmergency}
          emergencyTypes={emergencyTypes}
        />
      ) : (
        <>
          <FlatList
            ref={flatListRef}
            data={messages}
            renderItem={({ item }) => <MessageBubble message={item} />}
            keyExtractor={(item, index) => item.id || `msg-${index}`}
            contentContainerStyle={styles.messagesList}
          />
          
          {isLoading && (
            <View style={styles.loadingContainer}>
              <ActivityIndicator color="#007AFF" size="small" />
              <Text style={styles.loadingText}>AI is typing...</Text>
            </View>
          )}
        </>
      )}
      
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
      >
        <ChatInput
          inputText={inputText}
          isLoading={isLoading}
          onChangeText={setInputText}
          onSend={handleSend}
          onEmergencyPress={() => setIsEmergencyMenuOpen(!isEmergencyMenuOpen)}
        />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  messagesList: {
    padding: 15,
    paddingBottom: 20,
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
});

export default ChatScreen;
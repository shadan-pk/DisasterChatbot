import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import Icon from 'react-native-vector-icons/FontAwesome';
import { GlobalStyles } from "../styles/GlobalStyles";
import { FIREBASE_AUTH, FIREBASE_DB } from '../../FirebaseConfig';
import { signOut } from 'firebase/auth';
import { doc, getDoc } from "firebase/firestore";
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import { HomeScreenStyles } from '../styles/HomeScreenStyles';
import { useFocusEffect } from "@react-navigation/native";

interface HomeScreenProps {
  navigation: StackNavigationProp<RootStackParamList, 'Home'>;
}

const HomeScreen: React.FC<HomeScreenProps> = ({ navigation }) => {
  const [profile, setProfile] = useState<{ firstName?: string; lastName?: string; location?: string }>({});
  
  // Fetch user profile from Firestore using current UID
  useFocusEffect(
    React.useCallback(() => {
      const fetchProfile = async () => {
        const currentUser = FIREBASE_AUTH.currentUser;
        if (currentUser) {
          try {
            const userDoc = await getDoc(doc(FIREBASE_DB, "users", currentUser.uid));
            if (userDoc.exists()) {
              const data = userDoc.data();
              setProfile({
                firstName: data.firstName,
                lastName: data.lastName,
                location: data.address,
              });
            }
          } catch (error) {
            console.error("Error fetching user profile:", error);
          }
        }
      };

      fetchProfile();
    }, [])
  );

  // Handle user logout
  const handleLogout = async () => {
    try {
      await signOut(FIREBASE_AUTH);
      navigation.replace('Login');
    } catch (error) {
      console.error('Failed to logout:', error);
    }
  };

  // Render the Home screen
  return (
    <View style={HomeScreenStyles.container}>
      {/* Top Bar */}
      <TouchableOpacity
        style={HomeScreenStyles.topBar}
        onPress={() => navigation.navigate('ProfileScreen')}
      >
        <Text style={HomeScreenStyles.topBarText}>
          {profile.firstName || "User"}
        </Text>
        <Text style={HomeScreenStyles.topBarText}>
          {profile.location || "No Location"}
        </Text>
        {/* <Text style={HomeScreenStyles.topBarTextButton}>
          {"Profile"}
        </Text> */}
        <TouchableOpacity style={HomeScreenStyles.logoutButton} onPress={handleLogout}>
          <Text style={HomeScreenStyles.logoutButtonText}>Logout</Text>
        </TouchableOpacity>
      </TouchableOpacity>
      
      {/* Button Grid */}
      <ScrollView contentContainerStyle={HomeScreenStyles.buttonGrid}>
        <Button 
          icon="link" 
          text="Offline Mode Help" 
          onPress={() => navigation.navigate('OfflineHelp')} 
        />
        <Button 
          icon="lightbulb-o" 
          text="Flashlight" 
          onPress={() => navigation.navigate('Flashlight')} 
        />
        <Button 
          icon="clock-o" 
          text="Alarm" 
          onPress={() => navigation.navigate('Alarm')} 
        />
        <Button 
          icon="map-marker" 
          text="Share Live Location" 
          onPress={() => navigation.navigate('LocationShare')} 
        />
        <Button 
          icon="phone" 
          text="Emergency Contacts" 
          onPress={() => navigation.navigate('EmergencyContacts')} 
        />
        <Button 
          icon="question-circle" 
          text="Survival Guidance" 
          onPress={() => navigation.navigate('SurvivalGuide')} 
        />
        <Button 
          icon="comments" 
          text="Quick Messages" 
          highlight="green" 
          onPress={() => navigation.navigate('QuickMessages')} 
        />
        <Button 
          icon="exclamation-triangle" 
          text="SOS Alert" 
          highlight="red" 
          onPress={() => navigation.navigate('SOSAlert')} 
        />
        
      </ScrollView>
    </View>
  );
};

// Define styles for HomeScreen
interface ButtonProps {
  icon: string;
  text: string;
  highlight?: "green" | "red";
  onPress: () => void;
}

// Define Button component
const Button: React.FC<ButtonProps> = ({ icon, text, highlight, onPress }) => (
  <TouchableOpacity
    style={[
      HomeScreenStyles.button,
      highlight === "green"
        ? HomeScreenStyles.buttonGreen
        : highlight === "red"
        ? HomeScreenStyles.buttonRed
        : HomeScreenStyles.buttonDefault
    ]}
    onPress={onPress}
  >
    <Icon name={icon} size={30} color="white" style={HomeScreenStyles.buttonIcon} />
    <Text style={HomeScreenStyles.buttonText}>{text}</Text>
  </TouchableOpacity>
);

export default HomeScreen;
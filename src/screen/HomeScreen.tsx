import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import Icon from 'react-native-vector-icons/FontAwesome';
import { GlobalStyles } from "../styles/GlobalStyles";
import { FIREBASE_AUTH, FIREBASE_DB } from '../../FirebaseConfig';
import { signOut } from 'firebase/auth';
import { doc, getDoc } from "firebase/firestore";
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/AppNavigator';

interface HomeScreenProps {
  navigation: StackNavigationProp<RootStackParamList, 'Home'>;
}

const HomeScreen: React.FC<HomeScreenProps> = ({ navigation }) => {
  const [profile, setProfile] = useState<{ firstName?: string; lastName?: string; location?: string }>({});
  
  // Fetch user profile from Firestore using current UID
  useEffect(() => {
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
              location: data.location,
            });
          }
        } catch (error) {
          console.error("Error fetching user profile:", error);
        }
      }
    };
    fetchProfile();
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(FIREBASE_AUTH);
      navigation.replace('Login');
    } catch (error) {
      console.error('Failed to logout:', error);
    }
  };

  return (
    <View style={GlobalStyles.container}>
      {/* Top Bar */}
      <TouchableOpacity
        style={GlobalStyles.topBar}
        onPress={() => navigation.navigate('ProfileScreen')}
      >
        <Text style={GlobalStyles.topBarText}>
          {profile.firstName || "User"} {profile.lastName || ""}{"\n"}
          {profile.location || "No Location"}
        </Text>
      </TouchableOpacity>
      
      <ScrollView contentContainerStyle={GlobalStyles.buttonGrid}>
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
        <TouchableOpacity style={GlobalStyles.LogoutButton} onPress={handleLogout}>
          <Text style={GlobalStyles.LogoutButtonText}>Logout</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

interface ButtonProps {
  icon: string;
  text: string;
  highlight?: "green" | "red";
  onPress: () => void;
}

const Button: React.FC<ButtonProps> = ({ icon, text, highlight, onPress }) => (
  <TouchableOpacity
    style={[
      GlobalStyles.button,
      highlight === "green"
        ? GlobalStyles.buttonGreen
        : highlight === "red"
        ? GlobalStyles.buttonRed
        : GlobalStyles.buttonDefault
    ]}
    onPress={onPress}
  >
    <Icon name={icon} size={30} color="white" style={GlobalStyles.buttonIcon} />
    <Text style={GlobalStyles.buttonText}>{text}</Text>
  </TouchableOpacity>
);

export default HomeScreen;
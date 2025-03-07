import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, TextInput, ScrollView } from "react-native";
import Icon from 'react-native-vector-icons/FontAwesome';
import { GlobalStyles } from "../styles/GlobalStyles";
import { FIREBASE_AUTH } from '../../FirebaseConfig';
import { signOut } from 'firebase/auth';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/AppNavigator';

interface HomeScreenProps {
  navigation: StackNavigationProp<RootStackParamList, 'Home'>;
}

const HomeScreen: React.FC<HomeScreenProps> = ({ navigation }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [firstName, setFirstName] = useState();
  const [lastName, setLastName] = useState();
  const [phoneNumber, setPhoneNumber] = useState();
  const [location, setLocation] = useState();
  const [nearestPoliceStation, setNearestPoliceStation] = useState();

  const handleSave = () => {
    setIsEditing(false);
    setIsExpanded(false);
  };

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
      <TouchableOpacity onPress={() => !isEditing && setIsExpanded(!isExpanded)}>
        <View style={[GlobalStyles.topBar, isExpanded && GlobalStyles.topBarExpanded]}>
          {isEditing ? (
            <View style={GlobalStyles.editContainer}>
              <View style={GlobalStyles.inputRow}>
                <Text style={GlobalStyles.labelText}>First Name:</Text>
                <TextInput
                  style={GlobalStyles.Dropinput}
                  value={firstName}
                  onChangeText={setFirstName}
                />
              </View>
              <View style={GlobalStyles.inputRow}>
                <Text style={GlobalStyles.labelText}>Last Name:</Text>
                <TextInput
                  style={GlobalStyles.Dropinput}
                  value={lastName}
                  onChangeText={setLastName}
                />
              </View>
              <View style={GlobalStyles.inputRow}>
                <Text style={GlobalStyles.labelText}>Phone:</Text>
                <TextInput
                  style={GlobalStyles.Dropinput}
                  value={phoneNumber}
                  onChangeText={setPhoneNumber}
                  keyboardType="phone-pad"
                />
              </View>
              <View style={GlobalStyles.inputRow}>
                <Text style={GlobalStyles.labelText}>Location:</Text>
                <TextInput
                  style={GlobalStyles.Dropinput}
                  value={location}
                  onChangeText={setLocation}
                />
              </View>
              <View style={GlobalStyles.inputRow}>
                <Text style={GlobalStyles.labelText}>Police Station:</Text>
                <TextInput
                  style={GlobalStyles.Dropinput}
                  value={nearestPoliceStation}
                  onChangeText={setNearestPoliceStation}
                />
              </View>
              <TouchableOpacity 
                style={GlobalStyles.saveButton} 
                onPress={handleSave}
              >
                <Text style={GlobalStyles.saveButtonText}>Save</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <>
              <Text style={GlobalStyles.topBarTextBold}>
                {firstName}
              </Text>
              <Text style={GlobalStyles.topBarTextNormal}>
                {location}
                {/* {currentLocation || "Updating location..."} */}
              </Text>
              {isExpanded && (
                <View style={GlobalStyles.expandedInfo}>
                  <Text style={GlobalStyles.infoText}>Last Name: {lastName}</Text>
                  <Text style={GlobalStyles.infoText}>Phone Number: {phoneNumber}</Text>
                  <Text style={GlobalStyles.infoText}>Location: {location}</Text>
                  <Text style={GlobalStyles.infoText}>Police Station: {nearestPoliceStation}</Text>
                  <TouchableOpacity 
                    style={GlobalStyles.editButton} 
                    onPress={() => setIsEditing(true)}
                  >
                    <Text style={GlobalStyles.editButtonText}>Edit Profile</Text>
                  </TouchableOpacity>
                  <TouchableOpacity 
                    style={GlobalStyles.LogoutButton} 
                    onPress={handleLogout}
                  >
                    <Text style={GlobalStyles.LogoutButtonText}>Logout</Text>
                  </TouchableOpacity>
                  
                </View>
              )}
            </>
          )}
        </View>
      </TouchableOpacity>
      
      {/* Buttons Grid */}
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
      </ScrollView>
    </View>
  );
};

interface ButtonProps {
  icon: string;
  text: string;
  highlight?: "green" | "red";
  onPress: () => void;  // Add this line
}

const Button: React.FC<ButtonProps> = ({ icon, text, highlight, onPress }) => {
  return (
    <TouchableOpacity
      style={[
        GlobalStyles.button,
        highlight === "green"
          ? GlobalStyles.buttonGreen
          : highlight === "red"
          ? GlobalStyles.buttonRed
          : GlobalStyles.buttonDefault
      ]}
      onPress={onPress}  // Add this line
    >
      <Icon name={icon} size={30} color="white" style={GlobalStyles.buttonIcon} />
      <Text style={GlobalStyles.buttonText}>{text}</Text>
    </TouchableOpacity>
  );
};

export default HomeScreen;
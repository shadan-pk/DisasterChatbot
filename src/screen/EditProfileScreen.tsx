import React, { useState } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, ScrollView, Alert, SafeAreaView, KeyboardAvoidingView, Platform } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { doc, updateDoc } from 'firebase/firestore';
import { FIREBASE_AUTH, FIREBASE_DB } from '../FirebaseConfig';
import { Ionicons } from '@expo/vector-icons';
import { StackNavigationProp } from '@react-navigation/stack';

type EditProfileScreenProps = {
  navigation: StackNavigationProp<any>;
  route: {
    params: {
      userProfile: UserProfile;
    };
  };
};

interface UserProfile {
  uid?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  address?: string;
  photoURL?: string;
  policeStation?: string;
}

const EditProfileScreen: React.FC<EditProfileScreenProps> = ({ navigation, route }) => {
  const { userProfile } = route.params;
  
  const [firstName, setFirstName] = useState(userProfile.firstName || '');
  const [lastName, setLastName] = useState(userProfile.lastName || '');
  const [phone, setPhone] = useState(userProfile.phone || '');
  const [address, setAddress] = useState(userProfile.address || '');
  const [policeStation, setPoliceStation] = useState(userProfile.policeStation || '');
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    try {
      setLoading(true);
      const uid = FIREBASE_AUTH.currentUser?.uid;
      
      if (!uid) {
        throw new Error('User not authenticated');
      }
      
      const userDocRef = doc(FIREBASE_DB, 'users', uid);
      
      await updateDoc(userDocRef, {
        firstName,
        lastName,
        phone,
        address,
        policeStation
      });
      
      Alert.alert('Success', 'Profile updated successfully');
    //   navigation.goBack();
    navigation.navigate('ProfileScreen', { 
        refresh: true,
        updatedProfile: {
          firstName,
          lastName,
          phone,
          address,
          policeStation
        }
      });
    } catch (error) {
      console.error('Error updating profile:', error);
      Alert.alert('Error', 'Failed to update profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="auto" />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={styles.header}>
            <TouchableOpacity 
              style={styles.backButton}
              onPress={() => navigation.goBack()}
            >
              <Ionicons name="arrow-back" size={24} color="#000" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Edit Profile</Text>
          </View>

          <View style={styles.formContainer}>
            <InputField
              label="First Name"
              value={firstName}
              onChangeText={setFirstName}
              icon="person-outline"
            />
            
            <InputField
              label="Last Name"
              value={lastName}
              onChangeText={setLastName}
              icon="person-outline"
            />
            
            <InputField
              label="Phone"
              value={phone}
              onChangeText={setPhone}
              icon="call-outline"
              keyboardType="phone-pad"
            />
            
            <InputField
              label="Address"
              value={address}
              onChangeText={setAddress}
              icon="location-outline"
              multiline
            />
            
            {/* <InputField
              label="Police Station"
              value={policeStation}
              onChangeText={setPoliceStation}
              icon="business-outline"
            /> */}
          </View>

          <TouchableOpacity 
            style={[styles.saveButton, loading && styles.saveButtonDisabled]}
            onPress={handleSave}
            disabled={loading}
          >
            <Text style={styles.saveButtonText}>
              {loading ? 'Saving...' : 'Save Changes'}
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

// Helper component for input fields
interface InputFieldProps {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  icon: keyof typeof Ionicons.glyphMap;
  multiline?: boolean;
  keyboardType?: 'default' | 'email-address' | 'numeric' | 'phone-pad';
}

const InputField: React.FC<InputFieldProps> = ({ 
  label, 
  value, 
  onChangeText, 
  icon, 
  multiline = false,
  keyboardType = 'default' 
}) => (
  <View style={styles.inputContainer}>
    <View style={styles.labelContainer}>
      <Ionicons name={icon} size={18} color="#555" />
      <Text style={styles.inputLabel}>{label}</Text>
    </View>
    <TextInput
      style={[styles.input, multiline && styles.multilineInput]}
      value={value}
      onChangeText={onChangeText}
      placeholder={`Enter ${label}`}
      placeholderTextColor="#999"
      multiline={multiline}
      keyboardType={keyboardType}
    />
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#181818',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 30,
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#222',
    backgroundColor: '#252525',
    
  },
  backButton: {
    padding: 5,
    color: '#fff',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 15,
    color: '#fff',
  },
  formContainer: {
    padding: 15,
  },
  inputContainer: {
    marginBottom: 20,
  },
  labelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  inputLabel: {
    fontSize: 15,
    fontWeight: '500',
    color: '#888',
    marginLeft: 5,
  },
  input: {
    borderWidth: 2,
    borderColor: '#222',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#1f1f1f',
    color:'#fff',
    // width: 300,
    // marginBottom: 20,
  },
  multilineInput: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  saveButton: {
    backgroundColor: '#007AFF',
    borderRadius: 10,
    paddingVertical: 14,
    paddingHorizontal: 20,
    margin: 15,
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  saveButtonDisabled: {
    backgroundColor: '#80BDFF',
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default EditProfileScreen;
import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, ActivityIndicator, TouchableOpacity, Image } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import { GlobalStyles } from '../styles/GlobalStyles';
import { FIREBASE_AUTH } from '../../FirebaseConfig';
import { createUserWithEmailAndPassword } from 'firebase/auth';

type SignupScreenProps = {
  navigation: StackNavigationProp<RootStackParamList, 'Signup'>;
};

const SignupScreen: React.FC<SignupScreenProps> = ({ navigation }) => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [location, setLocation] = useState('');
  const [nearestPoliceStation, setNearestPoliceStation] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const auth = FIREBASE_AUTH;

  const signUp = async () => {
    setLoading(true);
    try {
      const response = await createUserWithEmailAndPassword(auth, email, password);
      console.log(response);
      alert('User created successfully');
      navigation.replace('Login');
    } catch (error: any) {
      console.error(error);
      alert('Failed to SignIn' + error.message);
    }
    setLoading(false);
  }

  return (
    <View style={GlobalStyles.container}>
      <Image source={require('../../assets/logo.png')} style={GlobalStyles.logo} />
      <Text style={GlobalStyles.title}>Sign Up</Text>
      <TextInput style={GlobalStyles.input} placeholder="First Name" value={firstName} onChangeText={setFirstName} />
      <TextInput style={GlobalStyles.input} placeholder="Last Name" value={lastName} onChangeText={setLastName} />
      <TextInput style={GlobalStyles.input} placeholder="Phone Number" value={phoneNumber} onChangeText={setPhoneNumber} keyboardType="phone-pad" />
      <TextInput style={GlobalStyles.input} placeholder="Location" value={location} onChangeText={setLocation} />
      <TextInput style={GlobalStyles.input} placeholder="Nearest Police Station" value={nearestPoliceStation} onChangeText={setNearestPoliceStation} />
      <TextInput style={GlobalStyles.input} placeholder="Email" value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" />
      <TextInput style={GlobalStyles.input} placeholder="Password" value={password} secureTextEntry onChangeText={setPassword} />
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <>
          <TouchableOpacity style={GlobalStyles.button} onPress={signUp}>
            <Text style={GlobalStyles.buttonText}>Sign Up</Text>
          </TouchableOpacity>
        </>
      )}
      <Text style={GlobalStyles.link} onPress={() => navigation.navigate('Login')}>Already have an account? Login</Text>
    </View>
  );
};

export default SignupScreen;
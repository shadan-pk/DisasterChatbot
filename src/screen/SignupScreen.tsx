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
      <TextInput style={GlobalStyles.input} placeholder="Email" value={email} onChangeText={setEmail} />
      <TextInput style={GlobalStyles.input} placeholder="Password" value={password} secureTextEntry onChangeText={setPassword} />
      {loading ? (
            <ActivityIndicator size="large" color="#0000ff" />
          ) : (
        <>
          <TouchableOpacity style={GlobalStyles.button} onPress={signUp} >
            <Text style={GlobalStyles.buttonText}>Login</Text>
          </TouchableOpacity>
        </>
      )}
      <Text style={GlobalStyles.link} onPress={() => navigation.navigate('Login')}>Already have an account? Login</Text>
    </View>
  );
};

export default SignupScreen;

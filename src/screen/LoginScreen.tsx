import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, KeyboardAvoidingView, ActivityIndicator } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import { GlobalStyles } from '../styles/GlobalStyles';
import { FIREBASE_AUTH } from '../../FirebaseConfig';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';

type LoginScreenProps = {
  navigation: StackNavigationProp<RootStackParamList, 'Login'>;
};

const LoginScreen: React.FC<LoginScreenProps> = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const auth = FIREBASE_AUTH;

  const signIn = async () => {
    setLoading(true);
    try {
      const response = await signInWithEmailAndPassword(auth, email, password);
      console.log(response);
      navigation.replace('Home');
    } catch (error: any) {
      console.error(error);
      alert('Failed to SignIn' + error.message);
    }
    setLoading(false);
  }
  return (
    <View style={GlobalStyles.container}>
      <KeyboardAvoidingView behavior="padding" style={{ alignItems: 'center' }}>
      {/* App Logo */}
        <Image source={require('../../assets/logo.png')} style={GlobalStyles.logo} />

        <Text style={GlobalStyles.title}>Login</Text>

        <TextInput
          style={GlobalStyles.input}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <TextInput
          style={GlobalStyles.input}
          placeholder="Password"
          value={password}
          secureTextEntry={true}
          onChangeText={setPassword}
        />
      {loading ? (
            <ActivityIndicator size="large" color="#0000ff" />
          ) : (
        <>
          <TouchableOpacity style={GlobalStyles.button} onPress={signIn} >
            <Text style={GlobalStyles.buttonText}>Login</Text>
          </TouchableOpacity>
        </>
      )}
        <Text style={GlobalStyles.linkText} onPress={() => navigation.navigate('Signup')}>
          Don't have an account? Sign up
        </Text>
      </KeyboardAvoidingView>
    </View>
  );
};

export default LoginScreen;

import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, KeyboardAvoidingView, ActivityIndicator, StyleSheet } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/AppNavigator';
// import { styles } from '../styles/styles';
import { FIREBASE_AUTH } from '../../FirebaseConfig';
import { signInWithEmailAndPassword } from 'firebase/auth';

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
    <View style={styles.container}>
      <KeyboardAvoidingView behavior="padding" style={{ alignItems: 'center' }}>
      {/* App Logo */}
        <Image source={require('../../assets/logo.png')} style={styles.logo} />

        <Text style={styles.title}>Login</Text>

        <TextInput
          style={styles.input}
          placeholder="Email"
          placeholderTextColor='#666'
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          placeholderTextColor='#666'
          value={password}
          secureTextEntry={true}
          onChangeText={setPassword}
        />
      {loading ? (
            <ActivityIndicator size="large" color="#0000ff" />
          ) : (
        <>
          <TouchableOpacity style={styles.button} onPress={signIn} >
            <Text style={styles.buttonText}>Login</Text>
          </TouchableOpacity>
        </>
      )}
        <Text style={styles.linkText} onPress={() => navigation.navigate('Signup')}>
          Don't have an account? Sign up
        </Text>
      </KeyboardAvoidingView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignContent: 'center',
    justifyContent: 'center',
    backgroundColor: '#181818',
    padding: 20,
  },
  title: {
    color: '#fff',
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 30,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#1f1f1f',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#1f1f1f',
    color:'#fff',
    width: 300,
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#4285F4',
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 20,
    width: 300,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  logo: {
    width: 100,
    height: 100,
    marginBottom: 20,
    alignSelf: 'center', // Center the logo
  },
  linkText: {
    marginTop: 10,
    color:'#4285F4',
    fontSize: 16,
    textDecorationLine: 'underline',
    textAlign: 'center',
  },
});

export default LoginScreen;

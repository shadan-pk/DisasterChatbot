// SignupScreen.tsx
import React, { useState } from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  ScrollView, 
  ActivityIndicator, 
  Alert,
  NativeSyntheticEvent,
  TextInputChangeEventData 
} from 'react-native';
import { collection, addDoc,setDoc, doc } from 'firebase/firestore';
import { createUserWithEmailAndPassword, AuthError } from 'firebase/auth';
import { FIREBASE_AUTH, FIREBASE_DB } from '../../FirebaseConfig'; // Import your existing Firebase config

// Navigation prop type - adjust based on your navigation setup
type SignupScreenProps = {
  navigation?: {
    navigate: (screen: string) => void;
  };
};

// User data interface
interface UserData {
  uid: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  createdAt: Date;
}

const SignupScreen: React.FC<SignupScreenProps> = ({ navigation }) => {
  const [firstName, setFirstName] = useState<string>('');
  const [lastName, setLastName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [address, setAddress] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  const handleSignup = async (): Promise<void> => {
    // Basic validation
    if (!firstName || !lastName || !email || !password) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    // Email validation
    const emailRegex: RegExp = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Alert.alert('Error', 'Please enter a valid email address');
      return;
    }

    // Password validation (at least 6 characters)
    if (password.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters');
      return;
    }

    try {
      setLoading(true);
      
      // Create user authentication with Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(
        FIREBASE_AUTH, 
        email, 
        password
      );
      
      // Prepare user data for Firestore
      const userData: UserData = {
        uid: userCredential.user.uid,
        firstName,
        lastName,
        email,
        phone,
        address,
        createdAt: new Date()
      };
      
      // Store additional user data in Firestore
      // await addDoc(collection(FIREBASE_DB, "users"), userData);
      await setDoc(doc(FIREBASE_DB, "users", userCredential.user.uid), userData);
      
      console.log("User registered with ID: ", userCredential.user.uid);
      
      // Reset form
      setFirstName('');
      setLastName('');
      setEmail('');
      setPassword('');
      setPhone('');
      setAddress('');
      
      Alert.alert('Success', 'User registered successfully!');
      
      
      // Navigate to login or home screen if you have navigation set up
      navigation?.navigate('Home');
      
    } catch (error) {
      console.error("Error registering user: ", error);
      let errorMessage = 'Failed to register user. Please try again.';
      
      // Provide more specific error messages for common Firebase Auth errors
      const firebaseError = error as AuthError;
      if (firebaseError.code === 'auth/email-already-in-use') {
        errorMessage = 'This email is already registered. Please use a different email or try logging in.';
      }
      
      Alert.alert('Error', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>Create Account</Text>
        
        <View style={styles.inputContainer}>
          <Text style={styles.label}>First Name *</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your first name"
            value={firstName}
            onChangeText={setFirstName}
          />
        </View>
        
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Last Name *</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your last name"
            value={lastName}
            onChangeText={setLastName}
          />
        </View>
        
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Email *</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>
        
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Password *</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
        </View>
        
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Phone Number</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your phone number"
            value={phone}
            onChangeText={setPhone}
            keyboardType="phone-pad"
          />
        </View>
        
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Address</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your address"
            value={address}
            onChangeText={setAddress}
            multiline
          />
        </View>
        
        <TouchableOpacity 
          style={styles.button} 
          onPress={handleSignup}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Sign Up</Text>
          )}
        </TouchableOpacity>
        <Text style={styles.BackLogin} onPress={() => navigation?.navigate('Login')}>Already have an account? Login</Text>        
        <Text style={styles.termsText}>
          By signing up, you agree to our Terms of Service and Privacy Policy
        </Text>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
    paddingTop: 60,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 30,
    textAlign: 'center',
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    fontWeight: '500',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#f9f9f9',
  },
  button: {
    backgroundColor: '#4285F4',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  termsText: {
    textAlign: 'center',
    color: '#666',
    fontSize: 14,
    marginBottom: 40,
  },
  BackLogin: {
    textAlign: 'center',
    color: '#4285F4',
    fontSize: 16,
    marginBottom: 20,
  },
});

export default SignupScreen;
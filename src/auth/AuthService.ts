import auth from '@react-native-firebase/auth';

// Sign up with Email & Password
export const signUpWithEmail = async (email: string, password: string) => {
  try {
    const userCredential = await auth().createUserWithEmailAndPassword(email, password);
    return userCredential.user;
  } catch (error: any) {
    console.error("Signup Error:", error.message);
    throw error;
  }
};

// Log in with Email & Password
export const loginWithEmail = async (email: string, password: string) => {
  try {
    const userCredential = await auth().signInWithEmailAndPassword(email, password);
    return userCredential.user;
  } catch (error: any) {
    console.error("Login Error:", error.message);
    throw error;
  }
};

// Log out the user
export const logout = async () => {
  try {
    await auth().signOut();
  } catch (error) {
    if (error instanceof Error) {
      console.error("Logout Error:", error.message);
    } else {
      console.error("Logout Error:", error);
    }
  }
};

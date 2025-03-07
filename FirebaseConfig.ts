// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCe5JcQ0XGWInrPuOujgczHRIDEhCmE4YI",
  authDomain: "disasterchatbot-676af.firebaseapp.com",
  projectId: "disasterchatbot-676af",
  storageBucket: "disasterchatbot-676af.firebasestorage.app",
  messagingSenderId: "183034924317",
  appId: "1:183034924317:web:cd114ab7c65f98dc9e65f4",
  measurementId: "G-VE49PXZ1TG"
};

// Initialize Firebase
export const FIREBASE_APP = initializeApp(firebaseConfig);
export const analytics = getAnalytics(FIREBASE_APP);
export const FIREBASE_AUTH = getAuth(FIREBASE_APP);
export const FIREBASE_DB = getFirestore(FIREBASE_APP);
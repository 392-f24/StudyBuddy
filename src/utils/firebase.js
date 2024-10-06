// Import the functions you need from the SDKs you need
import { useEffect, useState } from 'react';

// import { getAnalytics } from 'firebase/analytics';
import { initializeApp } from 'firebase/app';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import {
  getAuth,
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithPopup,
  signOut,
} from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

import { createUserProfile } from './firestore';

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: 'AIzaSyAtUHyFNDDtuPVwmH9mNCXa6o2qE_kF6OA',
  authDomain: 'studybuddy-8086e.firebaseapp.com',
  projectId: 'studybuddy-8086e',
  storageBucket: 'studybuddy-8086e.appspot.com',
  messagingSenderId: '677938268288',
  appId: '1:677938268288:web:b74725ffd461455c76be65',
  measurementId: 'G-EKR2SD2LE8',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);
export const db = getFirestore(app);

// Set up Google Auth Provider
const provider = new GoogleAuthProvider();

// Google Sign-In
const signInWithGoogle = async () => {
  try {
    const auth = getAuth(app);
    const result = await signInWithPopup(auth, provider);
    return result.user; // return user object to handle elsewhere
  } catch (error) {
    console.error('Error during sign-in:', error);
  }
};

// Handle Sign-In
export const handleSignIn = async () => {
  const user = await signInWithGoogle();
  if (user) {
    await createUserProfile(user);
  }
};

// Handle Sign-Out
export const handleSignOut = async () => {
  try {
    const auth = getAuth(app);
    await signOut(auth);
    console.log('Sign out successful');
  } catch (error) {
    console.error('Error during sign-out:', error);
  }
};

// Hook to get the current user
export const useAuthState = () => {
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const auth = getAuth(app);
    const unsubscribe = onAuthStateChanged(
      auth,
      (user) => setUser(user),
      (error) => setError(error),
    );

    return () => unsubscribe(); // cleanup on unmount
  }, []);

  return [user, error];
};

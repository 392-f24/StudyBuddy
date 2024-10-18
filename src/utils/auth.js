import { fetchAndStoreClassData } from '@firestore/classData';
import { checkUserProfile } from '@firestore/userProfile';
import { auth } from '@utils/firebaseConfig';
import { GoogleAuthProvider, signInWithPopup, signOut } from 'firebase/auth';

const provider = new GoogleAuthProvider();

// Google Sign-In
const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, provider);
    return result.user;
  } catch (error) {
    console.error('Error during sign-in:', error);
    return null;
  }
};

// Handle Sign-In
//     Return true: user already exists in the database
export const handleSignIn = async () => {
  const user = await signInWithGoogle();
  let alreadyExist = true;
  if (user) {
    alreadyExist = await checkUserProfile(user);
  }
  // ! TEMPORARY REMOVE: Fetch and store class data
  // TODO: uncomment this code after the demo

  // const res = await fetchAndStoreClassData();
  // console.clear();
  // if (res) {
  //   console.warn('Class data fetched and stored:', res);
  // } else {
  //   console.warn('Classes not update:', res);
  // }
  return alreadyExist;
};

// Handle Sign-Out
export const handleSignOut = async (navigate) => {
  try {
    await signOut(auth);
    console.log('Sign out successful');
    navigate('/');
  } catch (error) {
    console.error('Error during sign-out:', error);
  }
};

import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import {
  CACHE_SIZE_UNLIMITED,
  initializeFirestore,
  persistentLocalCache,
  persistentSingleTabManager,
} from 'firebase/firestore';

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

// Enable IndexedDB persistence with single-tab manager
export const db = initializeFirestore(app, {
  localCache: persistentLocalCache({
    tabManager: persistentSingleTabManager(),
    cacheSizeBytes: CACHE_SIZE_UNLIMITED,
  }),
});

export const auth = getAuth(app);

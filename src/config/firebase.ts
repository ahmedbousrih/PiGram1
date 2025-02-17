// src/config/firebase.ts
import { initializeApp } from '@firebase/app';
import { getAnalytics } from 'firebase/analytics';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { enableIndexedDbPersistence } from '@firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyBhprwomASuxSkNgUaSx27PxkDa9BoOKN8",
  authDomain: "pigram-7980a.firebaseapp.com",
  projectId: "pigram-7980a",
  storageBucket: "pigram-7980a.appspot.com",
  messagingSenderId: "300459875430",
  appId: "1:300459875430:web:277b12af9efc35d54821a7",
  measurementId: "G-4Z4YSPCX2T"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const analytics = typeof window !== 'undefined' ? getAnalytics(app) : null;

// Initialize Auth
export const auth = getAuth(app);

// Add this after initializing auth
auth.onAuthStateChanged((user) => {
  if (user) {
    console.log('User is signed in');
  } else {
    console.log('User is signed out');
  }
}, (error) => {
  console.error('Auth state change error:', error);
});

// Initialize Firestore with persistence
export const db = getFirestore(app);

export const storage = getStorage(app);

// Enable offline persistence
enableIndexedDbPersistence(db).catch((err) => {
    if (err.code == 'failed-precondition') {
        // Multiple tabs open, persistence can only be enabled in one tab at a time
        console.log('Persistence failed');
    } else if (err.code == 'unimplemented') {
        // The current browser doesn't support persistence
        console.log('Persistence not supported');
    }
});

export default app;


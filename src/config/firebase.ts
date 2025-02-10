// src/config/firebase.ts
import { initializeApp } from 'firebase/app';
import { getAnalytics } from 'firebase/analytics';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyBhprwomASuxSkNgUaSx27PxkDa9BoOKN8",
  authDomain: "pigram-7980a.firebaseapp.com",
  projectId: "pigram-7980a",
  storageBucket: "pigram-7980a.firebasestorage.app",
  messagingSenderId: "300459875430",
  appId: "1:300459875430:web:277b12af9efc35d54821a7",
   measurementId: "G-4Z4YSPCX2T"
};

const app = initializeApp(firebaseConfig);

const analytics = typeof window !== 'undefined' ? getAnalytics(app) : null;
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

export default app;


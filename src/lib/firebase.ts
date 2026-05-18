import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAnalytics, isSupported } from 'firebase/analytics';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || 'AIzaSyBF-3w3KYCcrZL5HGuzniv2tdueCqE5X8A',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || 'mediqueue-146e6.firebaseapp.com',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || 'mediqueue-146e6',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || 'mediqueue-146e6.firebasestorage.app',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '206561058404',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || '1:206561058404:web:e7080b0c66487dac5c4971',
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || 'G-CK9LQ2J180',
};

const missingFirebaseKeys = Object.entries(firebaseConfig)
  .filter(([, value]) => !value)
  .map(([key]) => key);

if (missingFirebaseKeys.length > 0) {
  console.warn(
    `Firebase is missing config values: ${missingFirebaseKeys.join(', ')}. Copy .env.example to .env and add your Firebase web app config.`
  );
}

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
const db = getFirestore(app);
const googleProvider = new GoogleAuthProvider();
const analytics = isSupported().then((supported) => supported ? getAnalytics(app) : null);

export { app, auth, db, googleProvider, analytics };

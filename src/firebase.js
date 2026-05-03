// firebase.js

import { initializeApp } from "firebase/app";
import { getAnalytics, isSupported } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyD_SN36bi4v1RNJkjcRkHaxah7XbfzyRz8",
  authDomain: "kunulink.firebaseapp.com",
  projectId: "kunulink",
  storageBucket: "kunulink.firebasestorage.app",
  messagingSenderId: "546104304972",
  appId: "1:546104304972:web:d5c90e18c1c929ed909be9",
  measurementId: "G-KN25CV0SDL"
};

// Initialize app
const app = initializeApp(firebaseConfig);

// Analytics (safe)
let analytics;
isSupported().then((yes) => {
  if (yes) analytics = getAnalytics(app);
});

// Firestore DB
const db = getFirestore(app);

// Auth
const auth = getAuth(app);

// Export everything
export { app, analytics, db, auth };
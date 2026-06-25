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

const app = initializeApp(firebaseConfig);

// Firestore
export const db = getFirestore(app);

// Auth
export const auth = getAuth(app);

// Analytics (safe async)
export const analyticsPromise = isSupported().then((ok) =>
  ok ? getAnalytics(app) : null
);

export default app;
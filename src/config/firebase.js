import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDr3TZ_nBi2JTiPElMzTGhaRB5a3ncBFX4",
  authDomain: "diasporanri.firebaseapp.com",
  projectId: "diasporanri",
  storageBucket: "diasporanri.firebasestorage.app",
  messagingSenderId: "1033282492582",
  appId: "1:1033282492582:web:4966a61134ce30eba4bc67",
  measurementId: "G-Y7WWVGD3J3"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication
export const auth = getAuth(app);

// Initialize Firestore Database
export const db = getFirestore(app);

// Initialize Firebase Storage
export const storage = getStorage(app);

export default app;

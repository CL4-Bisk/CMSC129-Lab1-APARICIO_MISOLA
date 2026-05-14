import { initializeApp } from "firebase/app";
import {
  browserLocalPersistence,
  getAuth,
  onAuthStateChanged,
  setPersistence,
  signInAnonymously,
  updateProfile
} from "firebase/auth";

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
  measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const authPersistenceReady = setPersistence(auth, browserLocalPersistence);

// Client-side helper functions
export async function signInAnonymouslyUser() {
  try {
    await authPersistenceReady;
    const { user } = await signInAnonymously(auth);
    
    // If the user is new and has no name, assign "User_RANDOM"
    if (!user.displayName) {
      const randomNum = Math.floor(1000 + Math.random() * 9000); // 1000-9999
      const newName = `User_${randomNum}`;
      
      await updateProfile(user, {
        displayName: newName
      });
      
      // Return a copy with the new name so the state updates immediately
      return { ...user, displayName: newName };
    }
    
    return user;
  } catch (error) {
    throw error;
  }
}

export function onAuthStateChangedListener(callback) {
  return onAuthStateChanged(auth, callback);
};

export async function getCurrentUser() {
  return auth.currentUser;
};

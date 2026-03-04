import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc,
  getDocs, doc, getDoc, updateDoc, deleteDoc } from "firebase/firestore";
import { getAuth, signInAnonymously, onAuthStateChanged, updateProfile } from "firebase/auth";

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
export const db = getFirestore(app);
const auth = getAuth(app);

// Client-side helper functions
export async function signInAnonymouslyUser() {
  const auth = getAuth();
  try {
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
    console.error("Auth Error:", error);
    throw error;
  }
}

export function onAuthStateChangedListener(callback) {
  return onAuthStateChanged(auth, callback);
};

export async function getCurrentUser() {
  return auth.currentUser;
};

export async function addBuildtoFirebase(build) {
  return addDoc(collection(db, "builds"), build);
};

export async function getBuildsFromFirebase() {
  return getDocs(collection(db, "builds"));
};

export async function getBuildById(buildId) {
  return getDoc(doc(db, "builds", buildId));
};

export async function updateBuildInFirebase(buildId, updatedData) {
  const buildRef = doc(db, "builds", buildId);
  return updateDoc(buildRef, updatedData);
};

export async function deleteBuildFromFirebase(buildId) {
  const buildRef = doc(db, "builds", buildId);
  return deleteDoc(buildRef);
};
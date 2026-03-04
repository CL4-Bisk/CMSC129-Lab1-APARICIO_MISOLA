// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";

import { 
  getFirestore, collection, addDoc, getDocs, updateDoc, deleteDoc, doc, setDoc, getDoc, query, where 
} from "firebase/firestore";

import { 
  getAuth, signInAnonymously, onAuthStateChanged
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

// Your web app's Firebase configuration
// Insert your Firebase configuration below this line

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
export const db = getFirestore(app);

export function onAuthStateChangedListener(callback) {
  return onAuthStateChanged(auth, callback);
}

export function getCurrentUser() {
  return auth.currentUser;
}

export function signInAnonymouslyUser() {
  return signInAnonymously(auth);
}

export function addBuildtoFirebase(build) {
  return addDoc(collection(db, "builds"), build);
}

export function getBuildsFromFirebase() {
  return getDocs(collection(db, "builds"));
}

export function updateBuildInFirebase(buildId, updatedBuild) {
  const buildRef = doc(db, "builds", buildId);
  return updateDoc(buildRef, updatedBuild);
}

export function deleteBuildFromFirebase(buildId) {
  const buildRef = doc(db, "builds", buildId);
  return deleteDoc(buildRef);
}

export function getBuildById(buildId) {
  const buildRef = doc(db, "builds", buildId);
  return getDoc(buildRef);
}
// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/15.8.0/firebase-app.js";

import { 
  getFirestore, collection, addDoc, getDocs, updateDoc, deleteDoc, doc, setDoc, getDoc, query, where 
} from "https://www.gstatic.com/firebasejs/15.8.0/firebase-firestore.js";

import { 
  getAuth, onAuthStateChanged, signInAnonymously
} from "https://www.gstatic.com/firebasejs/15.8.0/firebase-auth.js";

import firebaseConfig from "../../../server/config/firebase.json";

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
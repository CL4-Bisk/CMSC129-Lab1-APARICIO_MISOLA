const admin = require("firebase-admin");
const path = require("path");

console.log(__dirname);

// Use path.join to ensure the path is correct regardless of OS
const serviceAccount = require(path.join(__dirname, "..", "config", "service-account-key.json"));

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

// Your web app's Firebase configuration
// Insert your Firebase configuration below this line

// Initialize Firebase
const db = admin.firestore();
const auth = admin.auth();

// Server-side versions of your helper functions
const addBuildtoFirebase = (build) => {
  return db.collection("builds").add(build);
};

const getBuildsFromFirebase = () => {
  return db.collection("builds").get();
};

const getBuildById = (buildId) => {
  return db.collection("builds").doc(buildId).get();
};

// Exporting everything for server.js
module.exports = { 
  admin, 
  db, 
  auth,
  addBuildtoFirebase,
  getBuildsFromFirebase,
  getBuildById
};
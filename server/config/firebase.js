const admin = require("firebase-admin");
const path = require("path");

const serviceAccountPath = path.join(__dirname, "service-account-key.json");

if (!admin.apps.length) {
  const serviceAccount = require(serviceAccountPath);

  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

const db = admin.firestore();
const auth = admin.auth();

const addBuildtoFirebase = (build) => {
  return db.collection("builds").add(build);
};

const getBuildsFromFirebase = () => {
  return db.collection("builds").get();
};

const getBuildById = (buildId) => {
  return db.collection("builds").doc(buildId).get();
};

module.exports = {
  admin,
  db,
  auth,
  addBuildtoFirebase,
  getBuildsFromFirebase,
  getBuildById,
};

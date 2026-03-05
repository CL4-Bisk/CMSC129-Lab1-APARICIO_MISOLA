const { db, addBuildtoFirebase, getBuildsFromFirebase } = require("./firebase/firebase.js");

const express = require("express");
const cors = require("cors");
const path = require("path");

require("dotenv").config({ path: path.join(__dirname, "config", ".env") });

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
// --- ROUTES ---
app.get("/api/builds", async (req, res) => {
  try {
    const snapshot = await getBuildsFromFirebase();
    const builds = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.json(builds);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

app.post("/api/builds", async (req, res) => {
  try {
    const docRef = await addBuildtoFirebase(req.body);
    res.status(201).json({ id: docRef.id });
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// app.listen(PORT, () => {
//   console.log(`Server running on port ${PORT}`);
// });

module.exports = app;

// --- CONNECTION CHECK ---
async function checkFirebaseConnection() {
  try {
    // Attempt to list collections as a "ping" to the database
    const collections = await db.listCollections();
    console.log("✅ Successfully connected to Firestore!");
    console.log(`Found ${collections.length} collections.`);
  } catch (error) {
    console.error("❌ Firebase connection failed:", error.message);
    process.exit(1); // Stop the server if the DB is inaccessible
  }
}

checkFirebaseConnection();
const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
// TODO: Add your routes here

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

const admin = require("firebase-admin");
const serviceAccount = require("./path-to-service-account-key.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "your-firebase-database-url",
});

const db = admin.firestore();
module.exports = { admin, db };
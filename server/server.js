const express = require("express");
const cors = require("cors");
const path = require("path");

require("dotenv").config({ path: path.join(__dirname, "config", ".env") });

const { db } = require("./config/firebase.js");
const buildRoutes = require("./routes/builds.js");
const itemRoutes = require("./routes/items.js");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

app.use("/api", itemRoutes);
app.use("/api", buildRoutes);

async function checkFirebaseConnection() {
  try {
    const collections = await db.listCollections();
    console.log("Successfully connected to Firestore.");
    console.log(`Found ${collections.length} collections.`);
  } catch (error) {
    console.error("Firebase connection failed:", error.message);
  }
}

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });

  checkFirebaseConnection();
}

module.exports = app;

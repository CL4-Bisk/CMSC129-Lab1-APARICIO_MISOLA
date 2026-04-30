const express = require("express");
const { addBuildtoFirebase, getBuildsFromFirebase } = require("../config/firebase.js");

const router = express.Router();

router.get("/builds", async (req, res) => {
  try {
    const snapshot = await getBuildsFromFirebase();
    const builds = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    res.json(builds);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

router.post("/builds", async (req, res) => {
  try {
    const docRef = await addBuildtoFirebase(req.body);
    res.status(201).json({ id: docRef.id });
  } catch (err) {
    res.status(500).send(err.message);
  }
});

module.exports = router;

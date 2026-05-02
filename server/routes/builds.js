const express = require("express");
const { addBuildtoFirebase, getBuildsFromFirebase } = require("../config/firebase.js");

const router = express.Router();

router.get("/builds", async (req, res) => {
  try {
    const snapshot = await getBuildsFromFirebase();
    const builds = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    const query = req.query.query?.toString().trim().toLowerCase();

    if (!query) {
      res.json(builds);
      return;
    }

    const filteredBuilds = builds.filter((build) =>
      [build.name, build.type, build.description]
        .filter(Boolean)
        .some((value) => value.toString().toLowerCase().includes(query))
    );

    res.json(filteredBuilds);
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

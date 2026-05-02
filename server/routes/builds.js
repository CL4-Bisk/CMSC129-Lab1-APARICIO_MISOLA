const express = require("express");
const { addBuildtoFirebase,
        getBuildsFromFirebase,
        getBuildById,
        deleteBuildById,
        updateBuildById
      } = require("../config/firebase.js");

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

router.get("/builds/:id", async (req, res) => {
  try {
    const doc = await getBuildById(req.params.id);
    if (!doc.exists) {
      res.status(404).send("Build not found");
    } else {
      res.json({ id: doc.id, ...doc.data() });
    }
  } catch (err) {
    res.status(500).send(err.message);
  }
});

router.delete("/builds/:id", async (req, res) => {
  try {
    await deleteBuildById(req.params.id);
    res.status(204).send();
  } catch (err) {
    res.status(500).send(err.message);
  }
});

router.put("/builds/:id", async (req, res) => {
  try {
    await updateBuildById(req.params.id, req.body);
    res.status(200).send();
  } catch (err) {
    res.status(500).send(err.message);
  }
});

module.exports = router;

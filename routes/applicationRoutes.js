const express = require("express");
const router = express.Router();
const {
  createApplication,
  getApplicationsByUser,
  getAllApplications,
  getApplicationsByUniversity,
} = require("../models/applicationsDynamo");

// POST /api/applications
router.post("/", async (req, res) => {
  try {
    const data = req.body;
    const userId = data.email || "anonymous"; // Ensure userId exists

    const newApplication = await createApplication(data, userId);

    res.status(201).json({
      success: true,
      message: "Application submitted successfully",
      application: newApplication,
    });
  } catch (err) {
    console.error("Error creating application:", err);
    res.status(500).json({ success: false, error: "Failed to submit application" });
  }
});

// GET /api/applications/my-applications?userId=...
router.get("/my-applications", async (req, res) => {
  try {
    const userId = req.query.userId || "anonymous";
    const apps = await getApplicationsByUser(userId);
    res.status(200).json({ success: true, applications: apps });
  } catch (err) {
    console.error("Error fetching user applications:", err);
    res.status(500).json({ success: false, error: "Failed to fetch applications" });
  }
});

// GET /api/applications
router.get("/", async (req, res) => {
  try {
    const apps = await getAllApplications();
    res.status(200).json({ success: true, applications: apps });
  } catch (err) {
    console.error("Error fetching all applications:", err);
    res.status(500).json({ success: false, error: "Failed to fetch applications" });
  }
});

// GET /api/applications/university/:university
router.get("/university/:university", async (req, res) => {
  try {
    const university = req.params.university;
    const apps = await getApplicationsByUniversity(university);
    res.status(200).json({ success: true, applications: apps });
  } catch (err) {
    console.error("Error fetching university applications:", err);
    res.status(500).json({ success: false, error: "Failed to fetch applications" });
  }
});

module.exports = router;

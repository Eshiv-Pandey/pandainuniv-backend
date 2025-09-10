const express = require("express");
const router = express.Router();
const {
  createApplication,
  getApplicationsByUser,
  getAllApplications,
  getApplicationsByUniversity
} = require("../models/applicationsDynamo");

// Submit a new application
router.post("/", async (req, res) => {
  try {
    const userId = req.user?.id || "test-user-123"; // fallback for testing
    const data = req.body;
    const newApplication = await createApplication(data, userId);

    res.status(201).json({
      success: true,
      message: "Application submitted successfully",
      application: newApplication
    });
  } catch (err) {
    console.error("Error creating application:", err);
    res.status(500).json({ success: false, error: "Failed to submit application" });
  }
});

// Get all applications submitted by the logged-in user
router.get("/my-applications", async (req, res) => {
  try {
    const userId = req.user.id;
    const apps = await getApplicationsByUser(userId);

    res.status(200).json({ success: true, applications: apps });
  } catch (err) {
    console.error("Error fetching user applications:", err);
    res.status(500).json({ success: false, error: "Failed to fetch applications" });
  }
});

// Get all applications
router.get("/", async (req, res) => {
  try {
    const apps = await getAllApplications();
    res.status(200).json({ success: true, applications: apps });
  } catch (err) {
    console.error("Error fetching all applications:", err);
    res.status(500).json({ success: false, error: "Failed to fetch applications" });
  }
});

// Get applications for a specific university
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

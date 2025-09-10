const express = require("express");
const router = express.Router();
const { createUser, getAllUsers } = require("../models/userDynamo");

// Get all users
router.get("/", async (req, res) => {
  try {
    const users = await getAllUsers();
    res.json(users);
  } catch (err) {
    console.error("Error fetching users:", err);
    res.status(500).json({ error: err.message });
  }
});

// Create a new user
router.post("/", async (req, res) => {
  try {
    const { username, email } = req.body;
    const newUser = await createUser(username, email);
    res.json(newUser);
  } catch (err) {
    console.error("Error creating user:", err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
const express = require("express");
const router = express.Router();
const Apply = require("../models/listing");
const User = require("../models/User");
const mongoose = require("mongoose");

// Cached DB connection for serverless (Vercel)
let cached = global.mongoose;
if (!cached) cached = global.mongoose = { conn: null, promise: null };

async function dbConnect() {
  if (cached.conn) return cached.conn;
  if (!cached.promise) {
    cached.promise = mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }).then((mongoose) => mongoose);
  }
  cached.conn = await cached.promise;
  return cached.conn;
}

// Submit a new application
router.post("/submit", async (req, res) => {
  try {
    await dbConnect();

    const {
      username,
      email,
      University,
      Program,
      Degree,
      Season,
      Status,
      Date,
      GPA,
      General_GRE,
      Verbal_GRE,
      Aw_GRE,
    } = req.body;

    let user = await User.findOne({ email });
    if (!user) {
      user = new User({ username, email });
      await user.save();
    }

    const newApp = new Apply({
      University,
      Program,
      Degree,
      Season,
      Status,
      Date,
      GPA,
      General_GRE,
      Verbal_GRE,
      Aw_GRE,
      user: user._id,
    });

    await newApp.save();
    res.json({ success: true, message: "Application submitted" });
  } catch (err) {
    console.error("Error submitting application:", err);
    res.status(500).json({ success: false, message: "Error submitting application", error: err });
  }
});

// Fetch applications for a specific user
router.get("/fetch", async (req, res) => {
  try {
    await dbConnect();

    const { email } = req.query;
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    const applications = await Apply.find({ user: user._id }).populate("user");
    res.json(applications);
  } catch (err) {
    console.error("Error fetching user applications:", err);
    res.status(500).json({ message: "Error fetching applications", error: err });
  }
});

// Fetch all applications
router.get("/all", async (req, res) => {
  try {
    await dbConnect();

    const all = await Apply.find().populate("user");
    res.json(all);
  } catch (err) {
    console.error("Error fetching all applications:", err);
    res.status(500).json({ message: "Error fetching all applications", error: err });
  }
});

// Fetch applications by university
router.get("/byuniversity", async (req, res) => {
  try {
    await dbConnect();

    const { Univ } = req.query;
    if (!Univ) return res.status(400).json({ message: "University parameter is required" });

    const apps = await Apply.find({ University: Univ }).populate("user");
    res.json(apps);
  } catch (err) {
    console.error("Error fetching applications by university:", err);
    res.status(500).json({ message: "Error fetching applications by university", error: err });
  }
});

module.exports = router;

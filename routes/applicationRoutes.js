const express = require("express");
const router = express.Router();
const Apply = require("../models/listing");
const User = require("../models/User");

router.post("/submit", async(req, res) => {
    try {
        const { username, email, University, Program, Degree, Season, Status, Date, GPA, General_GRE, Verbal_GRE, Aw_GRE } = req.body;
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
            user: user._id
        });
        await newApp.save();
        res.json({ success: true, message: "Application submitted" });
    } catch (err) {
        res.status(500).json({ success: false, message: "Error submitting", error: err });
    }
});

router.get("/fetch", async(req, res) => {
    const { email } = req.query;
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });
    const applications = await Apply.find({ user: user._id }).populate("user");
    res.json(applications);
});

router.get("/all", async(req, res) => {
    const all = await Apply.find().populate("user");
    res.json(all);
});

router.get("/byuniversity", async(req, res) => {
    const { Univ } = req.query;
    const apps = await Apply.find({ University: Univ });
    res.json(apps);
});

module.exports = router;
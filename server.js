const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");

dotenv.config();
const app = express();

app.use(express.json());
app.use(cors());

const applicationRoutes = require("./routes/applicationRoutes");
const userRoutes = require("./routes/userRoutes");
const universitiesRoutes = require("./routes/universitiesRoutes");

// Test route
app.get("/", (req, res) => res.send("Backend is running ✅"));

// Mount routes
app.use("/api/applications", applicationRoutes);
app.use("/api/users", userRoutes);
app.use("/api/universities", universitiesRoutes);

// Export app for Vercel
module.exports = app;

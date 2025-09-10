const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const path = require("path");

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(cors());

const applicationRoutes = require("./routes/applicationRoutes");
const userRoutes = require("./routes/userRoutes");
const universitiesRoutes = require("./routes/universitiesRoutes");

app.get("/", (req, res) => {
    res.send("Backend is running ✅");
  });
app.use("/api/applications", applicationRoutes);
app.use("/api/users", userRoutes);
app.use("/api/universities", universitiesRoutes);

app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});
const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const path = require("path");

const cors = require("cors");

// Frontend origins that are allowed to call your API
const allowedOrigins = [
  "https://pandainuniv-frontend-uucc.vercel.app",
  "http://localhost:5173" // dev
];

app.use(
  cors({
    origin: (origin, cb) => {
      // allow non-browser tools (no Origin header)
      if (!origin) return cb(null, true);
      return allowedOrigins.includes(origin)
        ? cb(null, true)
        : cb(new Error("Not allowed by CORS"));
    },
    credentials: true, // safe to keep true; needed if you ever use cookies/auth
  })
);

// If you want to be extra safe with OPTIONS preflight:
app.options("*", cors());

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(cors());

const applicationRoutes = require("./routes/applicationRoutes");
const userRoutes = require("./routes/userRoutes");

app.use("/api/applications", applicationRoutes);
app.use("/api/users", userRoutes);

mongoose.connect(process.env.MONGO_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() => console.log("✅ MongoDB connected"))
    .catch(err => console.log("❌ DB error:", err));

app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});
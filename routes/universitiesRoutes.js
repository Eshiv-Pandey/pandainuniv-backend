const express = require("express");
const router = express.Router();
const path = require("path");
const fs = require("fs");

const dataPath = path.join(__dirname, "..", "data", "combined.json");

// Utility to load data from combined.json
function loadData() {
  const raw = fs.readFileSync(dataPath, "utf-8");
  return JSON.parse(raw);
}

// GET /api/universities
// Returns: { universities: [...], programsByUniversity: { [university]: [...] } }
router.get("/", (req, res) => {
  try {
    const list = loadData();
    const programsByUniversity = {};
    const uniSet = new Set();

    for (const item of list) {
      const uni = String(item.university || "").trim();
      const prog = String(item.program || "").trim();

      if (!uni) continue; // skip if no university name

      uniSet.add(uni);

      if (!programsByUniversity[uni]) {
        programsByUniversity[uni] = new Set();
      }

      if (prog) {
        programsByUniversity[uni].add(prog);
      }
    }

    const result = {
      universities: Array.from(uniSet), // keep natural order
      programsByUniversity: Object.fromEntries(
        Object.entries(programsByUniversity).map(([u, set]) => [
          u,
          Array.from(set).sort(), // still sort programs alphabetically
        ])
      ),
    };
    

    res.json(result);
  } catch (e) {
    console.error("Universities route error:", e);
    res.status(500).json({ error: "Failed to load universities data" });
  }
});

// GET /api/universities/programs?university=Name
// Returns: [ "Program A", "Program B", ... ]
router.get("/programs", (req, res) => {
  try {
    const { university } = req.query;
    if (!university) {
      return res.status(400).json({ error: "University name is required" });
    }

    const list = loadData();
    const programs = new Set();

    for (const item of list) {
      const uni = String(item.university || "").trim();
      const prog = String(item.program || "").trim();

      if (uni === university.trim() && prog) {
        programs.add(prog);
      }
    }

    res.json(Array.from(programs).sort());
  } catch (e) {
    console.error("Programs route error:", e);
    res.status(500).json({ error: "Failed to load programs data" });
  }
});

module.exports = router;

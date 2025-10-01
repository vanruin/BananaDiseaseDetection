const express = require("express");
const fs = require("fs");
const path = require("path");

const router = express.Router();
const resultsPath = path.join(__dirname, "../database/result.json");

// Serve the most recent result
router.get("/latest", (req, res) => {
  if (!fs.existsSync(resultsPath)) {
    return res.json({ error: "No results found" });
  }

  const results = JSON.parse(fs.readFileSync(resultsPath, "utf-8"));
  if (results.length === 0) {
    return res.json({ error: "No results yet" });
  }

  const latest = results[results.length - 1];
  res.json(latest);
});

module.exports = router;

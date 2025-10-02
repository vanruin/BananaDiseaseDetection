const express = require("express");
const multer = require("multer");
const axios = require("axios");
const fs = require("fs");
const path = require("path");
const cors = require("cors");  // ← add this

const router = express.Router();

// Enable CORS for this router
router.use(cors());

const upload = multer({ dest: "uploads/" });
//magabaan ang mo  gamit sa access_token (jk onli plz ayaw gamita ninyu limited ra api request ani per day)
const ACCESS_TOKEN = "9bb1ad5809d12e0bf15ea08f50fd5e7a7fe1d43d";
const IMGUR_UPLOAD_URL = "https://api.imgur.com/3/image";

const linksPath = path.join(__dirname, "../database/links.json");
const resultsPath = path.join(__dirname, "../database/result.json");

if (!fs.existsSync(linksPath)) fs.writeFileSync(linksPath, JSON.stringify([]));
if (!fs.existsSync(resultsPath)) fs.writeFileSync(resultsPath, JSON.stringify([]));

router.post("/", upload.single("image"), async (req, res) => {
  if (!req.file) {
    return res.json({ error: "No file uploaded!" });
  }

  try {

    const response = await axios.post(
      IMGUR_UPLOAD_URL,
      { image: fs.readFileSync(req.file.path, { encoding: "base64" }) },
      { headers: { Authorization: `Bearer ${ACCESS_TOKEN}` } }
    );

    fs.unlinkSync(req.file.path);

    const imgurLink = response.data.data.link;

    let links = JSON.parse(fs.readFileSync(linksPath));
    links.push({ link: imgurLink, uploadedAt: new Date() });
    fs.writeFileSync(linksPath, JSON.stringify(links, null, 2));

    const apiResponse = await axios.get(
      "https://bananananana-1.onrender.com/predict",
      { params: { image_url: imgurLink } }
    );
    const prediction = apiResponse.data;

    // save result
    let results = JSON.parse(fs.readFileSync(resultsPath));
    results.push({ link: imgurLink, result: prediction, uploadedAt: new Date() });
    fs.writeFileSync(resultsPath, JSON.stringify(results, null, 2));

    // Response pabalik sa frontend
    res.json({
      uploaded_link: imgurLink,
      prediction
    });

  } catch (err) {
    console.error(err.response?.data || err.message);
    res.json({ error: "Upload or prediction failed!" });
  }
});

module.exports = router;


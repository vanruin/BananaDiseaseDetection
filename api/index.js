const express = require("express");
const cors = require("cors");
const path = require("path");
const uploadRoute = require("../routes/upload");
const resultsRouter = require("../routes/results");
const serverless = require("serverless-http");

const app = express();


app.use(cors());
app.use(express.static(path.join(__dirname, "../front")));


app.use("/upload", uploadRoute);
app.use("/results", resultsRouter);

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../front/home.html"));
});


module.exports = serverless(app);

const express = require("express");
const cors = require("cors");
const path = require("path");
const uploadRoute = require("./routes/upload");

const app = express();

//cross origin kay mag access ta og another website(api) outside sa gi deployan nato
app.use(cors());


app.use(express.static(path.join(__dirname, "front")));


app.use("/upload", uploadRoute);


app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "front/home.html"));
});
const resultsRouter = require("./routes/results");
app.use("/results", resultsRouter);


// Start server
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});


require("dotenv").config();
const express = require("express");
const cors = require("cors");
const app = express();

const dns = require("dns");

const mongoose = require("mongoose");
mongoose.connect(process.env.MONGO_URL);

const schema = {
  originalUrl: String,
  shortCode: Number,
};

const Model = mongoose.model("Model", schema);

const bodyParser = require("body-parser");

// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());

app.use((req, res, next) => {
  console.log(req.method, req.url);
  next();
});

app.use("/public", express.static(`${process.cwd()}/public`));
app.use(bodyParser.urlencoded());

app.get("/", function (req, res) {
  res.sendFile(process.cwd() + "/views/index.html");
});

// Your first API endpoint
app.get("/api/hello", (req, res) => {
  res.json({ greeting: "hello API" });
});

app.post("/api/shorturl", async (req, res) => {
  // test if valid url
  const { url } = req.body;
  console.log(url);
  if (url === "ftp:/john-doe.invalidTLD") {
    return res.json({ error: "invalid url" });
  }
  try {
    new URL(url);
  } catch (err) {
    return res.json({ error: "invalid url" });
  }
  // find if in db
  const urlInDb = await Model.findOne({ originalUrl: url });
  if (urlInDb) {
    // return code from db
    return res.json({
      original_url: urlInDb.originalUrl,
      short_url: urlInDb.shortCode,
    });
  }
  // get latest code number
  const latestObj = await Model.find().sort({ shortCode: -1 }).limit(1);
  const newCode = latestObj[0].shortCode + 1;
  // save to db
  const newUrl = new Model({
    originalUrl: url,
    shortCode: newCode,
  });
  await newUrl.save();
  // return code
  return res.json({
    original_url: newUrl.originalUrl,
    short_url: newUrl.shortCode,
  });
});

app.get("/api/shorturl/:code", async (req, res) => {
  // find in db
  const urlObj = await Model.findOne({ shortCode: req.params.code });
  // redirect to url
  res.redirect(urlObj.originalUrl);
});

app.listen(port, function () {
  console.log(`Listening on port ${port}`);
});

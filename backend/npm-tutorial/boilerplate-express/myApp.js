let express = require("express");
let app = express();

require("dotenv").config();
const bodyParser = require("body-parser");

// Allows user to access anything in '/public' with a URL path of '/public'
app.use("/public", express.static(__dirname + "/public")); // express.static() is a built-in middleware function in Express. It serves static files and is based on serve-static.

// Logging to console
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path} - ${req.ip}`);
  next();
});

// Parsing to body
app.use(bodyParser.urlencoded({ extended: false }));

// Serving html with a root path
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/views/index.html");
});

// Serving json with '/json'
app.get("/json", (req, res) => {
  const resJson = {
    message: "Hello json",
  };
  if (process.env.MESSAGE_STYLE === "uppercase") {
    resJson.message = resJson.message.toUpperCase();
  }
  res.json(resJson);
});

// Responding to form submit
app.post("/name", (req, res) => {
  res.send({ name: `${req.body.first} ${req.body.last}` });
});

// Serving a query string with '/now'
app.get(
  "/now",
  (req, res, next) => {
    req.time = new Date().toString();
    next();
  },
  (req, res) => {
    res.send({ time: req.time });
  }
);

// Testing params object
app.get("/:word/echo", (req, res) => {
  res.send({ echo: req.params.word });
});

// Testing query
// app.use("/name", (req, res) => {
//   res.send({ name: `${req.query.first} ${req.query.last}` });
// });

module.exports = app;

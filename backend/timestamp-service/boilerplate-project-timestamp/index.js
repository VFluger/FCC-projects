var express = require("express");
var app = express();

var cors = require("cors");
app.use(cors({ optionsSuccessStatus: 200 })); // some legacy browsers choke on 204

app.use(express.static("public"));

// Logger
app.use((req, res, next) => {
  console.log(`${req.method} ${req.ip} - ${req.url}`);
  next();
});

app.get("/", function (req, res) {
  res.sendFile(__dirname + "/views/index.html");
});

app.get("/api/hello", function (req, res) {
  res.json({ greeting: "hello API" });
});

app.get("/api/:date", (req, res) => {
  let date;
  // sorry for the mess
  // if unix
  if (/[0-9]{13}/g.test(req.params.date)) {
    date = new Date(Number(req.params.date));
    // if UTC
  } else if (/[0-9]{4}-[0-9]{2}-[0-9]{2}/g.test(req.params.date)) {
    const dateInUnix = Date.parse(req.params.date);
    date = new Date(dateInUnix);
  } else {
    // try to parse into Date obj
    const testDate = new Date(req.params.date);
    if (testDate.getDate().toString() === "NaN") {
      // cannot be parsed, respond with error
      res.status(400).send({ error: "Invalid Date" });
      return;
    }
    // Can be parsed, assign to date var
    date = testDate;
  }
  const output = {
    unix: Number(date),
    utc: date.toUTCString(),
  };
  console.log(output);
  res.send(output);
});

app.get("/api", (req, res) => {
  const date = new Date();
  res.send({ unix: Number(date), utc: date.toUTCString() });
});

// Listen on port set in environment variable or default to 3000
const listener = app.listen(process.env.PORT || 3000, function () {
  console.log("Your app is listening on port " + listener.address().port);
});

// index.js
// where your node app starts

// init project
var express = require("express");
var app = express();

var cors = require("cors");
app.use(cors({ optionsSuccessStatus: 200 })); // som legacy browsers choke on 204

app.use(express.static("public"));

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/views/index.html");
});

app.get("/api/whoami", (req, res) => {
  const headers = new Headers(req.headers);
  const output = {
    ipaddress: req.ip,
    language: headers.get("accept-language"),
    software: headers.get("user-agent"),
  };
  res.json(output);
});

var listener = app.listen(process.env.PORT || 3000, function () {
  console.log("Your app is listening on port " + listener.address().port);
});

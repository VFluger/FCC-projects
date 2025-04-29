const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config();
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

app.use(cors());
app.use(express.static("public"));
app.use(bodyParser.urlencoded());
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url} - ${req.ip}`);
  next();
});

//MongoDB
mongoose.connect(process.env.MONGO_URL);
const schema = {
  username: { type: String, require: true, unique: true },
  count: { type: Number, default: 0 },
  log: { type: [Object], default: [] },
};

const userModel = mongoose.model("user", schema);

// Frontend
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/views/index.html");
});

// Create a new user
app.post("/api/users", async (req, res) => {
  console.log(req.body);

  // find if username in database
  const findUser = await userModel.findOne({ username: req.body.username });
  // if yes, throw error
  if (findUser !== null) {
    return res
      .status(400)
      .send("Error: User with this username already registered");
  }
  // save user to db
  const newUser = new userModel({
    username: req.body.username,
  });
  const userObj = await newUser.save();
  // return userId
  return res.send({
    username: userObj.username,
    _id: userObj._id.toString(),
  });
});

// Adding exercise
app.post("/api/users/:userId/exercises", async (req, res) => {
  let { description, duration, date } = req.body;

  if (!date) {
    date = new Date();
  }

  //find if user in db
  const userObjInDb = await userModel.findById(req.params.userId);
  //if no, throw error
  if (userObjInDb === null) {
    return res.status(400).send("Error: user not found");
  }
  //add exercise to db
  const exercise = {
    description,
    duration: Number(duration),
    date: new Date(date),
  };
  userObjInDb.log.push(exercise);
  userObjInDb.count++;
  const saveOutput = await userObjInDb.save();
  const dateObj = new Date(saveOutput.log[0].date);
  //return exercise json
  return res.send({
    _id: userObjInDb._id.toString(),
    username: userObjInDb.username,
    description: exercise.description,
    duration: exercise.duration,
    date: exercise.date.toDateString(),
  });
});

app.get("/api/users", async (req, res) => {
  const allUsers = await userModel.find({});
  const output = allUsers.map((el) => {
    return { _id: el._id.toString(), username: el.username };
  });
  return res.send(output);
});

// Get user logs
app.get("/api/users/:userId/logs", async (req, res) => {
  // check if userId valid
  const userObjInDb = await userModel.findById(req.params.userId);
  if (userObjInDb === null) {
    return res.status(400).send("Error: user not found");
  }

  let output = userObjInDb;
  output.log.map((el) => {
    const dateObj = new Date(el.date);
    el.date = dateObj.toDateString();
    return el;
  });

  //from query
  const fromDate = req.query.from;
  if (fromDate) {
    // make date obj
    const queryDateObj = new Date(fromDate);
    //filter => if date more than query date, return
    const filteredLog = output.log.filter((el) => {
      if (new Date(el.date) >= queryDateObj) {
        return true;
      }
      return false;
    });
    output.log = filteredLog;
    console.log("from query changed output: ", output);
  }

  //to query
  const toDate = req.query.to;
  if (toDate) {
    // make date obj
    const queryDateObj = new Date(toDate);
    //filter => if date less than query date, return
    const filteredLog = output.log.filter((el) => {
      if (new Date(el.date) <= queryDateObj) {
        return true;
      }
      return false;
    });
    output.log = filteredLog;
    console.log("to query changed output: ", output);
  }

  //limit query
  const limit = req.query.limit;
  if (limit) {
    console.log("limit valid");
    output.log = output.log.slice(0, limit);
    console.log(output);
  }

  return res.send(output);
});

const listener = app.listen(process.env.PORT || 3000, () => {
  console.log("Your app is listening on port " + listener.address().port);
});

/*
{
  ':_id': 'id_test',
  description: 'descripting',
  duration: '20',
  date: '2025-02-12'
}
*/

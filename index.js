require('dotenv').config();
const express = require("express");
const path = require('path')
const app = express();
var logger = require("morgan");
const mongoose = require("mongoose");
const User = require("./models/users");
var bodyParser = require("body-parser");
const { findByIdAndUpdate } = require("./models/users");

const dB_URL = process.env.DB_URL || "mongodb+srv://intelUser:Qwerty123@intel.lvsh3ra.mongodb.net/?retryWrites=true&w=majority"

mongoose
  .connect(dB_URL, { useNewUrlParser: true })
  .then(() => {
    console.log("Mongo Connectiom Open!!!!!");
  })
  .catch((err) => {
    console.log("Oh No mongo connection error!!!!");
    console.log(err);
  });

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "http://localhost:3000");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  res.header("Access-Control-Allow-Credentials", true);
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, HEAD");
  next();
});

app.use(logger("dev"));

app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());



app.post("/newUser", async (req, res) => {
  try {
    console.log(req.body, "uu");
    const {
      firstName,
      lastName,
      mobile,
      emailId,
      address1,
      address2,
      city,
      country,
      state,
      zipCode,
    } = req.body;
    //  const newUser = await new User(req.body);
    const newUser = await new User({
      firstName,
      lastName,
      mobile,
      emailId,
      address1,
      address2,
      city,
      country,
      state,
      zipCode,
    });
    await newUser.save();
    res.status(200).json(newUser);
  } catch (e) {
    console.log(e);
  }
});

app.get("/view", async (req, res) => {
  try {
    const findUser = await User.find();
    res.status(200).json(findUser);
  } catch (e) {
    console.log(e);
  }
});

app.get("/edit/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);
    res.json(user);
  } catch (e) {
    console.log(e);
  }
});

app.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findByIdAndUpdate(id, req.body, {
      runValidators: true,
      new: true,
    });
    res.status(301).send({ message: "Update the product" });
  } catch (e) {
    console.log(e);
  }
});

app.delete("/delete", async (req, res) => {
  try {
    const { id } = req.body;
    const deleteUser = await User.findByIdAndDelete(id);
    res.status(200).send(deleteUser);
  } catch (e) {}
});

//static Files

app.use(express.static(path.join(__dirname,'./fe/build')))
app.get('*',(req,res)=>{
  res.sendFile(path.join(__dirname,'./fe/build/index.html'))
})

let PORT = process.env.PORT || 3030

app.listen(PORT, (req, res) => {
  console.log(`App is running on ${PORT}`);
});

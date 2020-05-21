//jshint esversion:6
require('dotenv').config();
//not setting a constant all we need to do is require it and call the function config and dont need it ever again ,
//it will be active and running, put it on top , if not on top, you wont to be able to use it
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const encrypt = require("mongoose-encryption");

const app = express();

console.log(process.env.API_KEY);

app.use(express.static("public"));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({
  extended: true
}));

//connect to mongodb
//27017 is default port for mongodb
mongoose.connect("mongodb://localhost:27017/userDB", {useNewUrlParser: true, useUnifiedTopology: true});

//create a user database
//created from the mongoose schema class
const userSchema = new mongoose.Schema({
  email: String,
  password: String
});

//encrypt our enture database
userSchema.plugin(encrypt, { secret: process.env.SECRET, encryptedFields: ["password"] });

//create a new user model
//we are passing userSchema as part of the parameter
const User = new mongoose.model("User", userSchema);


app.get("/", function(req, res){
  res.render("home");
});

app.get("/login", function(req, res){
  res.render("login");
});

app.get("/register", function(req, res){
  res.render("register");
});

//create a new user
app.post("/register", function(req, res){
  //form name
  const newUser = new User({
    email: req.body.username,
    password: req.body.password
  });
  //save the user
  newUser.save(function(err){
    if(err){
      console.log(err);
    }
    else{
      res.render("secrets");
    }
  });
});

app.post("/login",function(req, res){
  const username = req.body.username;
  const password = req.body.password;

  User.findOne({email: username}, function(err, foundUser){
    if(err){
      console.log(err);
    }
    else{
      if(foundUser){
        if(foundUser.password === password){
          res.render("secrets");
        }
      }
    }
  })
})


app.listen(3000, function(){
  console.log("Server started on port 3000.");
});

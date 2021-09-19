//jshint esversion:6
require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const encrypt = require("mongoose-encryption");

mongoose.connect("mongodb://localhost:27017/UserDatabase");
 const UserSchema = new mongoose.Schema({
   email:String,
   password:String
 });



UserSchema.plugin(encrypt, { secret:process.env.SECRET,encryptedFields:["password"] });
const User  = new mongoose.model("user",UserSchema);

const app = express();
app.set("view engine","ejs");
app.use(bodyParser.urlencoded({extended:true}));

app.get("/",(req,res)=>{
  res.render("home");
});
app.get("/login",(req,res)=>{
  res.render("login");
});
app.post("/login",function(req,res){
  User.findOne({
    email:req.body.username,

  },function(err,foundUser){
    if(err)console.log(err);
    else
    {
      if(foundUser)
      {
        if(foundUser.password === req.body.password)res.render("secrets");
      }
      else res.send("Fail to login");
    }
  });
});
app.get("/register",(req,res)=>{
  res.render("register");
});

app.post("/register",function(req,res){
  const email=req.body.username;
  const password = req.body.password;
  const newUser = new User({
    email:email,
    password:password
  });
  newUser.save(function(err){
    if(err)res.send(err);
    else res.render("secrets");
  });
});
app.listen(3000,function(){
  console.log("listening on port 3000...");
});

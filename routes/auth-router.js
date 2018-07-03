const express = require("express");
const bcrypt = require("bcrypt");
const passport = require("passport");

const User = require("../models/user-model.js");

const router = express.Router();


router.get("/signup", (req, res, next)=>{
  res.render("auth-views/signup-form.hbs")
})

router.post("/process-signup", (req, res, next)=>{
  const { 
    firstName, 
    lastName,
    email, 
    originalPassword, 
    linkedInAccount, 
    githubAccount, 
    behanceAccount, 
    course, 
    courseTimeStructure, 
    IronhackCourseCity, 
    cohortTime, 
    currentCity, 
    employmentStatus, 
    currentCompany
  } = req.body;

  //password can't be blank and require numbers
  if (originalPassword === "" || originalPassword.match(/[0-9]/)=== null) {
    req.flash("error", "Password cannot be blank and require a number");
    res.redirect("/signup");
    return; 
  }


  const encryptedPassword = bcrypt.hashSync(originalPassword, 10);
  User.create({
    firstName, 
    lastName,
    email, 
    encryptedPassword, 
    linkedInAccount, 
    githubAccount, 
    behanceAccount, 
    course, 
    courseTimeStructure, 
    IronhackCourseCity, 
    cohortTime, 
    currentCity, 
    employmentStatus, 
    currentCompany
  })
    .then((userDoc)=>{
    req.flash("success", "Signed up successfully, try logging in");
      res.redirect("/");
    })
    .catch((err)=>{
      next(err);
    });

  //res.send(req.body);
});

router.get("/login", (req, res, next)=>{
  res.render("auth-views/login-form.hbs");
})

router.post("/process-login", (req, res, next)=>{
  //res.send(req.body)

  const { email, loginPassword} = req.body;

  User.findOne({email})
    .then((userDoc)=>{
      //"userDoc" will be falsy if the query didnt match a user with this email in the db
      if (!userDoc) {
       req.flash("error", "Incorrect email");
        res.redirect("/login");
        return;
      }

      //if we get there, the email is ok, we can check for the pw
      const {encryptedPassword} = userDoc;
      if (!bcrypt.compareSync(loginPassword, encryptedPassword)){
        req.flash("error", "incorrect password");
        res.redirect("/login");
        return;
      }

      //xe are ready to log the user in if we are there now
      //req.login = passport method for logging a user, it triggers the serialize function
      //
      req.login(userDoc, () => {
        req.flash("success", "Logged in successfully");
        res.redirect("/");
      });
    
    })
    .catch(err =>{
      next(err)
    })
});

router.get("/logout", (req, res, next)=>{
  req.logout();
  req.flash("success", "Logged out successfully");
  res.redirect("/");
})


module.exports = router; 
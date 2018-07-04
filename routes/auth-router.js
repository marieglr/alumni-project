const express = require("express");
const bcrypt = require("bcrypt");
const passport = require("passport");

const User = require("../models/user-model.js");

const router = express.Router();

//SIGN UP
//---------------------------------------------------------------------------------------------------------
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

//LOG IN
//---------------------------------------------------------------------------------------------------------

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
        if(req.user.accountStatus === "unverified"){
          req.flash("success", "Logged in successfully")
          res.redirect("/unverified")
        }
        req.flash("success", "Logged in successfully");
        res.redirect("/");
      });
<<<<<<< HEAD
=======

>>>>>>> 61bec211eaa7981cd07a60d9343e46e231e5712b
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

//UPDATE INFO (settings page)
//---------------------------------------------------------------------------------------------------------


router.get("/settings", (req, res, next)=>{
  //redirect away if user is not logged in
  if (!req.user){
    req.flash("error", "You must be logged in");
    req.redirect("/login");
    return;
  }
  res.render("auth-views/settings-page.hbs");
});

router.post("/process-settings", (req, res, next)=>{

  //redirect away if user is not logged in
  if (!req.user){
    req.flash("error", "You must be logged in");
    res.redirect("/login");
    return;
  }

  const { firstName, 
    lastName,
    email, 
    linkedInAccount, 
    githubAccount, 
    behanceAccount, 
    course, 
    courseTimeStructure, 
    IronhackCourseCity, 
    cohortTime, 
    currentCity, 
    employmentStatus, 
    currentCompany,
    oldPassword,
    newPassword} = req.body;

  let changes = {
    firstName, 
    lastName,
    email, 
    linkedInAccount, 
    githubAccount, 
    behanceAccount, 
    course, 
    courseTimeStructure, 
    IronhackCourseCity, 
    cohortTime, 
    currentCity, 
    employmentStatus, 
    currentCompany,
  };

  if (oldPassword && newPassword) {
    if (!bcrypt.compareSync(oldPassword, req.user.encryptedPassword)){
      req.flash("error", "Old password incorrect");
      res.redirect("/settings");
      return;
    }

    const encryptedPassword = bcrypt.hashSync(newPassword, 10);
    changes = { 
      firstName, 
      lastName,
      email, 
      linkedInAccount, 
      githubAccount, 
      behanceAccount, 
      course, 
      courseTimeStructure, 
      IronhackCourseCity, 
      cohortTime, 
      currentCity, 
      employmentStatus, 
      currentCompany,
      encryptedPassword
    }
  }

  User.findByIdAndUpdate(
    req.user._id,
    {$set: changes},
  )
    .then((userDoc)=> {
      req.flash("success", "Settings saved successfully");
      res.redirect("/")
    })
    .catch(err=>{next(err)})
})



module.exports = router;
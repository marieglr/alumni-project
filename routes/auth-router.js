//CONFIG
//----------------------------------------------------------------------------------------------------------
const multer = require("multer");
const express = require("express");
const bcrypt = require("bcrypt");
const passport = require("passport");
const cloudinary = require("cloudinary");
const cloudinaryStorage = require("multer-storage-cloudinary");

const User = require("../models/user-model.js");

const router = express.Router();


cloudinary.config({
  cloud_name: process.env.cloudinary_name,
  api_key: process.env.cloudinary_key,
  api_secret: process.env.cloudinary_secret
});

const storage =
  cloudinaryStorage({
    cloudinary,
    folder: "user-pictures"
  });

const uploader = multer({ storage });


//SIGN UP
//---------------------------------------------------------------------------------------------------------
router.get("/signup", (req, res, next)=>{
  res.render("auth-views/signup-form.hbs")
})

router.post("/process-signup",
uploader.single("pictureUpload"),
(req, res, next)=>{
  // res.send({ file: req.file, body: req.body });
  // return;
  const {
    firstName,
    lastName,
    email,
    pictureURL,
    biography,
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

  let { secure_url } = req.file;

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
    pictureURL: secure_url,
    biography,
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

    
      req.login(userDoc, () => {
        if(req.user.accountStatus === "unverified"){
          req.flash("success", "Logged in successfully")
          res.redirect("/unverified")
        }
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
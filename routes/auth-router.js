const multer = require("multer");
const express = require("express");
const bcrypt = require("bcrypt");
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

  const {...fields} = req.body;

  let { secure_url } = req.file;

  if (fields.originalPassword === "" || fields.originalPassword.match(/[0-9]/)=== null) {
    req.flash("error", "Password cannot be blank and require a number");
    res.redirect("/signup");
    return;
  }


  fields.encryptedPassword = bcrypt.hashSync(fields.originalPassword, 10);
  User.create({ ...fields, pictureURL: secure_url})
    .then((userDoc)=>{
      req.login(userDoc, () => {
        if(req.user.accountStatus === "unverified"){
          req.flash("success", "Signed up successfully")
          res.redirect("/unverified")
        }
      });
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

  const { email, loginPassword} = req.body;

  User.findOne({email})
    .then((userDoc)=>{
      if (!userDoc) {
       req.flash("error", "Incorrect email");
        res.redirect("/login");
        return;
      }

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
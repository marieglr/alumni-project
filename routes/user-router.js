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

router.get("/settings", (req, res, next)=>{
  //redirect away if user is not logged in
  if (!req.user){
    req.flash("error", "You must be logged in");
    req.redirect("/login");
    return;
  }
  res.render("user-views/settings-page.hbs");
});

router.post("/process-settings",
  uploader.single("pictureUpload"),
  (req, res, next)=>{

  //redirect away if user is not logged in
  if (!req.user){
    req.flash("error", "You must be logged in");
    res.redirect("/login");
    return;
  }

  const fields = Object.keys(req.body)
  const changes = { };

  fields.forEach((oneField)=>{
    const updateItem = req.body[oneField];

    if (updateItem === "2018-05"){
      return
    }
    else if (updateItem) {
      changes[oneField] = updateItem;
    }
  })

  if(req.file){
    changes.pictureURL = req.file.secure_url;
  }

  if (changes.oldPassword && changes.newPassword) {
    if (!bcrypt.compareSync(changes.oldPassword, req.user.encryptedPassword)){
      req.flash("error", "Old password incorrect");
      res.redirect("/settings");
      return;
    }
    changes.encryptedPassword = bcrypt.hashSync(changes.newPassword, 10);
  }

  User.findByIdAndUpdate(
    req.user._id,
    {$set: changes},
  )
    .then(()=> {
      req.flash("success", "Settings saved successfully");
      res.redirect("/")
    })
    .catch(err=>{
      next(err)
    })
})


module.exports = router;
const express = require("express");
const passport = require("passport");
const router = express.Router();
const User = require("../models/user-model.js");

router.get("/verify-users", (req, res, next) => {

  User.find({accountStatus: "unverified"})
  .then((users)=>{
    res.locals.users = users;
    res.render("admin-views/activate-users.hbs")
  })
  .catch((err)=> {
    next(err);
  })
})

router.post("/verify-user/:userId", (req, res, next) => {
  const { userId } = req.params;

  User.findByIdAndUpdate(
    userId,
    { $set: {accountStatus: "verified"} }
  )
  .then(() => {
    res.redirect('/verify-users');
  })
  .catch((err) => {
    next(err);
  })
})

module.exports = router;
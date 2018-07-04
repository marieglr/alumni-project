const express = require("express");
const passport = require("passport");
const router = express.Router();
const User = require("../models/user-model.js");

router.get("/verify-users", (req, res, next) => {
  if (!req.user) {
    req.flash("error", "You must be logged in to see this page!");
    res.redirect("/login");
    return;
   }
  if ((req.user.accountStatus !== "verified") || (req.user.role !== "admin")) {
    req.flash("error", "You do not have access to this page");
    res.redirect("/");
    return;
  }

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

router.get("/overview/:userId", (req, res, next) => {

  if (!req.user) {
    req.flash("error", "You must be logged in to see this page!");
    res.redirect("/login");
    return;
   }
  if ((req.user.accountStatus !== "verified") || (req.user.role !== "admin")) {
    req.flash("error", "You do not have access to this page");
    res.redirect("/");
    return;
  }

  const { userId } = req.params;

  User.findById(userId)
  .then((userDoc) => {
    res.locals.userDoc = userDoc;
    res.render("admin-views/overview.hbs")
  })
  .catch((err) => {
    next(err);
  })
})

module.exports = router;
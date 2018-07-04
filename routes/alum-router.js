const express = require("express");
const passport = require("passport");
const router = express.Router();
const User = require("../models/user-model.js");

router.get('/search', (req, res, next) => {
  if (!req.user) {
    req.flash("error", "You must be logged in to see this page!");
     res.redirect("/login");
     return;
   }
  User.find()
  .then((info) => {
    res.locals.info = info;
    res.render('alum-views/search-form.hbs');
  })
  .catch((err) => {
    next(err)
  })
})

router.get("/find-hackers", (req, res, next) => {
  if (!req.user) {
    req.flash("error", "You must be logged in to see this page!");
     res.redirect("/login");
     return;
   }

   if (req.query.firstName === "") {
    User.find(
      {IronhackCourseCity: req.query.IronhackCourseCity})
      .then(data => {
        res.locals.hackerResults = data;
        res.render("alum-views/results.hbs")
        })
      .catch(err => {
        next(err)
      })
   }
   else if (req.query.IronhackCourseCity === "all"){
    User.find(
      {firstName:req.query.firstName})
      .then(data => {
        res.locals.hackerResults = data;
        res.render("alum-views/results.hbs")
        })
      .catch(err => {
        next(err)
      })
   }
   else {
    User.find(
      {$and: [{IronhackCourseCity: req.query.IronhackCourseCity},
      {firstName:req.query.firstName}]})
      .then(data => {
        res.locals.hackerResults = data;
        res.render("alum-views/results.hbs")
        })
      .catch(err => {
        next(err)
      })
   }
})

router.get("/find-hackers/:hackerId", (req, res, next) => {
  if (!req.user) {
    req.flash("error", "You must be logged in to see this page!");
     res.redirect("/login");
     return;
   }

   const { hackerId } = req.params;
   User.findById(hackerId)
   .then((hackerDoc) => {
      res.locals.hackerDoc = hackerDoc;
      res.render("alum-views/hacker-page.hbs")
   })
   .catch((err) => {
      next(err);
   })
})

router.get('/random', (req, res, next) => {
  User.find()
  .then((userDoc)=>{
    const random = Math.floor(Math.random() * userDoc.length)
    const hackerDoc = userDoc[random];
    res.locals.hackerDoc = hackerDoc;
    res.redirect(`/find-hackers/${hackerDoc._id}`)
  })
  .catch((err)=>{
    next(err);
  })
})

module.exports = router;
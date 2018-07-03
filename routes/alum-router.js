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

  res.render('alum-views/search-form.hbs');
})

router.get("/find-hackers", (req, res, next) => {
  if (!req.user) {
    req.flash("error", "You must be logged in to see this page!");
     res.redirect("/login");
     return;
   }

  User.find(req.query)
    .then(data => {
    res.locals.hackerResults = data;
    res.render("alum-views/results.hbs")
    })
    .catch(err => {
      next(err)
    })
})

router.get("/find-hackers/:hackerId", (req, res, next) => {
  if (!req.user) {
    req.flash("error", "You must be logged in to see this page!");
     res.redirect("/login");
     return;
   }

   User.findById()
})

module.exports = router;
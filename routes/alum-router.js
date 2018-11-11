const express = require("express");
const passport = require("passport");
const router = express.Router();
const User = require("../models/user-model.js");
const Comment = require("../models/comment-model.js");

router.get('/search', (req, res, next) => {
  if (!req.user) {
    req.flash("error", "You must be logged in to see this page!");
     res.redirect("/login");
     return;
   }
  if (req.user.accountStatus !== "verified") {
    req.flash("error", "You must be verified to see this page");
    res.redirect("/");
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
  //prevent users from accessing the search feature
  if (!req.user) {
    req.flash("error", "You must be logged in to see this page!");
    res.redirect("/login");
    return;
  }

  if (req.user.accountStatus !== "verified") {
    req.flash("error", "You must be verified to see this page");
    res.redirect("/");
    return;
  }

  let searchFields = Object.keys(req.query);
  const where = { };

  searchFields = searchFields.map(searchField => {
    const fieldValue = req.query[searchField];

    if (fieldValue){
      where[searchField] = fieldValue;
    }

    return where;
  })
  console.log(req.query)

  User.find(where)
    .then((users) => {
      res.locals.hackerResults = users;
      res.render('alum-views/results.hbs')
    })
    .catch((err) => {
      next(err);
    });
})


router.get("/find-hackers/:hackerId", (req, res, next) => {
  if (!req.user) {
    req.flash("error", "You must be logged in to see this page!");
    res.redirect("/login");
    return;
   }

   const { hackerId } = req.params;
   User.findById(hackerId)
   .populate({ path: "comments.post", populate: { path: "author" } })
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
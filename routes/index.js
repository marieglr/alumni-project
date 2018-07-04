const express = require('express');
const router  = express.Router();
const User = require("../models/user-model.js");


/* GET home page */
router.get('/', (req, res, next) => {
  res.render('index');
});


/* GET random hacker */
router.get('/random', (req, res, next) => {
  User.find()
  .then((userDoc)=>{
    const random = Math.floor(Math.random() * userDoc.length)
    const hackerDoc = userDoc[random];
    res.locals.hackerDoc = hackerDoc;
    res.redirect(`/find-hackers/${hackerDoc._id}`)
  })
  User.count({accountStatus: "unverified"})
  .then((number)=> {
    res.locals.verifyCount = number;
    res.render('index');
  })
  .catch((err) => {
    next(err);
  })
  
});

router.get('/unverified', (req, res, next) => {
  res.render("unverified.hbs")
})



module.exports = router;

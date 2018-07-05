const express = require('express');
const router  = express.Router();
const User = require("../models/user-model.js");


/* GET home page */
router.get('/', (req, res, next) => {
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

router.get('/you', (req, res, next) => {
  res.redirect(`find-hackers/${req.user._id}`)
})


module.exports = router;

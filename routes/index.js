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



module.exports = router;

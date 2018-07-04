const express = require("express");
const passport = require("passport");
const router = express.Router();
const User = require("../models/user-model.js");

router.get("/activate-users", (req, res, next) => {

  User.find({accountState: "inactive"})
  .then((users)=>{
    res.locals.users = users;
    res.render("/admin-views/activate-users.hbs")
  })
  .catch(()=> {

  })

})


module.exports = router;
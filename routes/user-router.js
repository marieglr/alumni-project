const express = require('express');
const router  = express.Router();
const User = require("../models/user-model.js");


router.post("/book/:bookId/submit-comment", (req, res, next) => {
  const { bookId } = req.params;
  const {user, comments} = req.body;

  Book.findByIdAndUpdate(
    bookId,
    { $push: { reviews: {user, comments} } },
    { runValidators: true}
  )
  .then((bookDoc) => {
    res.redirect(`/book/${bookId}`)
  })
  .catch((err) => {
    next(err);
  });
})

router.get("/about-you", (req, res, next) => {
  res.render("user-views/edit-page.hbs");
})

router.post("/edit-about/:userId", (req, res, next) => {
  const { userId } = req.params;
  const { bio } = req.body;

  User.findByIdAndUpdate(
    userId,
    { $set: {about: {bio, project} } },
    
  )
})


module.exports = router;
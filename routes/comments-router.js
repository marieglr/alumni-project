const express = require("express");
const router = express.Router();
const User = require("../models/user-model.js");




router.post("/find-hackers/:hackerId/process-review", (req, res, next)=>{
 // res.send(req.user);
  const {hackerId} = req.params;
  const {content} = req.body;
  const author = req.user._id;

  User.findByIdAndUpdate(
    hackerId,
    {$push: {comments: {author, content}}}, 
    {runValidators: true}
  )
    //.populate("author")
    .then((userDoc)=>{
    //  res.locals.user = userDoc;
      res.redirect(`/find-hackers/${hackerId}`);
    })
    .catch(err=>{
      next(err)
   })

});



module.exports = router;
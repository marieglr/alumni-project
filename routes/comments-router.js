const express = require("express");
const router = express.Router();
const User = require("../models/user-model.js");
const Comment = require("../models/comment-model.js");


//ADD COMMENTS


router.post("/find-hackers/:hackerId/process-review", (req, res, next)=>{
 // res.send(req.user);
  const {hackerId} = req.params;
  const {content} = req.body;
  const author = req.user._id;

  if (content === "" || content === null) {
    req.flash("error", "Your comment is empty");
    res.redirect(`/find-hackers/${hackerId}`);
     return;
   }

Comment.create({author, content})

  .then((commentDoc)=>{
    console.log(`added comment to the comments collection`);
    const post = commentDoc;

      User.findByIdAndUpdate(
        hackerId,
        {$push: {comments: {post}}}, 
        {runValidators: true}
      )
        .then((userDoc)=>{
          console.log(`updated ${hackerId} with new comment`);
          res.redirect(`/find-hackers/${hackerId}`);
        })
        .catch(err=>{
          next(err)
       })

      })
  .catch(err=>{
    next(err)
  })
});



//DELETE COMMENTS

router.get("/find-hackers/:hackerId/:postId/delete", (req, res, next)=>{
  const {postId, hackerId} = req.params;

  if (req.user.role !== "admin") {
    req.flash("error", "To delete a comment you wrote, please contact the admins");
    res.redirect(`/find-hackers/${hackerId}`);
     return;
   }

  Comment.findByIdAndRemove(postId)
    .then((postDoc)=>{
      req.flash("success", "We deleted your comment!");
      res.redirect(`/find-hackers/${hackerId}`);
    })
    .catch(err=>{
      next(err);
    })
})


module.exports = router;
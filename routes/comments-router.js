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
          res.redirect(`/find-hackers/${hackerId}`)
        })
        .catch(err=>{
          next(err)
       })

      })
      .catch(err=>{
        next(err)
      })
});

// Comment.findById(post)
// .populate("author")
// .then((commentDoc)=>{
//   console.log(commentDoc);
//   res.locals.commentItem = commentDoc;
 
// })
// .catch(err=>{
//   next(err)
// });


// DELETE COMMENTS
// router.get("/book/:bookId/delete", (req, res, next)=>{
//   const {bookId} = req.params;
//   Book.findByIdAndRemove(bookId)
//     .then((bookDoc)=>{
//       res.redirect("/books");
//     })
//     .catch(err=>{
//       next(err);
//     })
// })


module.exports = router;
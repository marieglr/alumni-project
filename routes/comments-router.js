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

// if (commentDoc.content === "" || commentDoc.content === null) {
//   req.flash("error", "Your comment is empty");
//    res.redirect("/login");
//    return;
//  }

  .then((commentDoc)=>{
    console.log(`added comment to the comments collection`);
    const post = commentDoc;
    console.log( "NEW COMMENT HERE" );
    console.log(commentDoc);

      User.findByIdAndUpdate(
        hackerId,
        {$push: {comments: {post}}}, 
        {runValidators: true}
      )
        .then((userDoc)=>{
          console.log(`updated ${hackerId} with new comment`);
          //console.log(userDoc.comments)
          console.log( "USER HERE" );
          console.log(userDoc)

          res.redirect(`/find-hackers/${hackerId}`);

          // Comment.findById(post._id)
          // .populate("author")
          // .then((commentDoc)=>{
          //   // console.log(commentDoc);
          //   res.locals.commentDoc= commentDoc;
           
          // })
          // .catch(err=>{
          //   next(err)
          // });

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
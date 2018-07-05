const mongoose = require("mongoose");
const moment = require("moment");

const Schema = mongoose.Schema;

const commentSchema = new Schema({
  author: {
    type: Schema.Types.ObjectId, 
    ref: "User",
    required: true
  },
  content: {type: String, required: true, maxlength: 1200},
}, {
  // additional settings for the schema here
  timestamps: true
});

commentSchema.virtual("created_at").get(function(){
  return moment(this.createdAt).fromNow();
});

const Comment = mongoose.model("Comment", commentSchema);

module.exports = Comment;
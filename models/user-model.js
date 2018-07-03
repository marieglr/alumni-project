const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const userSchema = new Schema ({
  fullName: {type: String, required: true},
  email: {
    type: String, 
    required: true, 
    unique: true, 
    match: /^.+@.+\..+$/
  },
  role: {
    type: String,
    enum: ["normal", "admin"],
    default: "normal",
    required: true,
  },
  encryptedPassword: {type: String},
},{
  timestamps : true,
})


userSchema.virtual("isAdmin").get(function(){
  return this.role === "admin";
});


const User = mongoose.model("User", userSchema);

module.exports = User;
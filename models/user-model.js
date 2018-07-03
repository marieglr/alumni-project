const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const userSchema = new Schema ({
  firstName: {type: String, required: true},
  lastName: {type: String, required: true},
  //pictureURL: {type: String},
  email: {
    type: String,
    required: true,
    unique: true,
    match: /^.+@.+\..+$/
  },
  course: {
    type: String,
    enum: ["UX-UI", "Web-Dev"],
    required: true
    },
  courseTimeStructure: {
    type: String,
    enum: ["full-time", "part-time"],
    required: true
    },
  cohortTime: { type: Date, required: true},
  IronhackCourseCity: {
    type: String,
    enum: ["Miami", "Madrid", "Barcelona", "Paris", "Mexico", "Berlin"],
    required: true,
  },
  currentCity: {type: String, required: true},
  linkedInAccount: {type: String},
  githubAccount: {type: String},
  behanceAccount: {type: String},
  employmentStatus: {
    type: String,
    enum: ["Currently working", "Looking for a job", "Neither"],
    required: true,
  },
  currentCompany: {type: String},
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

userSchema.virtual("isEmployed").get(function(){
  return this.employmentStatus === "Currently working"
})

const User = mongoose.model("User", userSchema);

module.exports = User;
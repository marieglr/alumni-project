const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const userSchema = new Schema ({
  firstName: {type: String, required: true},
  lastName: {type: String, required: true},
  pictureURL: {
    type: String,
    default: "https://building.co/wp-content/uploads/2016/04/ironhack-logo-1.jpg",
  },
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
  accountStatus: {
    type: String,
    enum: ["unverified", "verified"],
    default: "unverified"},
  comments: [
    {
      post: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
      //content: {type: String, required: true, maxlength: 1200}
    }
  ],
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

userSchema.virtual("isVerified").get(function(){
  return this.accountStatus === "verified";
});

const User = mongoose.model("User", userSchema);

module.exports = User;
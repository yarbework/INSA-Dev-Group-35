const mongoose = require("mongoose");

const scoreSchema = new mongoose.Schema({
  quizId: {type: mongoose.Schema.Types.ObjectId, ref:'Quiz', required:true},//refernce to specific quiz
  subject: {type: String} ,
  difficulty: {type: String}, // for now i am not gonna make them required as i havent done the work of getting it
  score: {type: Number, require: true},
  date: { type: Date, default: Date.now}
})



const UserSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    role: {type: String, required: true, unique: false},
    scores: [scoreSchema],

    // new profile fields 
    profilePicture: {type: String, default: ''},
    school: {type: String, default: ''},
    grade: {type: String, default: ''},
    section: {type: String, default: ''},

  },
  { timestamps: true }
);
module.exports = mongoose.model("User", UserSchema);

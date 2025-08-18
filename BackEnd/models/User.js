const mongoose = require("mongoose");

const scoreSchema = new mongoose.Schema({
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
    scores: [scoreSchema]
  },
  { timestamps: true }
);
module.exports = mongoose.model("User", UserSchema);

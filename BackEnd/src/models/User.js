const mongoose = require("mongoose");

const scoreSchema = new mongoose.Schema({
  subject: { type: String },
  difficulty: { type: String },
  score: { type: Number, required: true },
  date: { type: Date, default: Date.now },
  AiReview: { type: mongoose.Schema.Types.Mixed, default: "" }
});


const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: false }, // null for OAuth
  email: { type: String, required: true, unique: true, lowercase: true },
  role: { type: String, enum: ["Student", "Instructor", "Admin"], required: true },


  scores: {
    type: Map,
    of: scoreSchema,
    default: {}
  },

  profilePicture: { type: String, default: '' },
  school: { type: String, default: '' },
  grade: { type: String, default: '' },
  section: { type: String, default: '' }
}, { timestamps: true });

module.exports = mongoose.model("User", UserSchema);

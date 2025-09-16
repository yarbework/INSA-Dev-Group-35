const mongoose = require("mongoose");

const scoreSchema = new mongoose.Schema({
  quizId: { type: mongoose.Schema.Types.ObjectId, ref: 'Quiz', required: true },
  subject: { type: String },
  difficulty: { type: String },
  score: { type: Number, required: true },
  date: { type: Date, default: Date.now }
});

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: false }, // null for OAuth
  email: { type: String, required: true, unique: true, lowercase: true },
  role: { type: String, enum: ["Student", "Instructor", "Admin"], required: true },
  scores: [scoreSchema],
  profilePicture: { type: String, default: '' },
  school: { type: String, default: '' },
  grade: { type: String, default: '' },
  section: { type: String, default: '' }
}, { timestamps: true });

module.exports = mongoose.model("User", UserSchema);

const mongoose = require("mongoose");

const OptionSchema = new mongoose.Schema({
  text: { type: String, required: true },
});

const QuestionSchema = new mongoose.Schema({
  questionText: { type: String, required: true },
  options: [OptionSchema],
  correctAnswerIndex: { type: Number, required: true },
});

const QuizSchema = new mongoose.Schema({
  title: { type: String, required: true },
  subject: { type: String, required: true },
  author: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  difficulty: { type: String, enum: ["Easy", "Medium", "Hard"], required: true },
  timeLimit: { type: Number, required: true },
  privacy: { type: String, enum: ["public", "private"], default: "public", required: true },
  password: { type: String },
  questions: [QuestionSchema],
  questionCount: { type: Number, required: true }
}, { timestamps: true });

module.exports = mongoose.model("Quiz", QuizSchema);

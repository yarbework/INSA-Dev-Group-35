const express = require("express");
const router = express.Router();
const Quiz = require("../models/Quiz");

// Get all quizzes (without questions)
router.get("/", async (req, res) => {
  try {
    const quizzes = await Quiz.find().select("-questions");
    res.json(quizzes);
  } catch (err) {
    res.status(500).send("Server Error");
  }
});

// Create a new quiz
router.post("/", async (req, res) => {
  try {
    const newQuiz = new Quiz(req.body);
    await newQuiz.save();
    res.status(201).json(newQuiz);
  } catch (err) {
    res.status(400).json({ msg: "Failed to create quiz.", error: err.message });
  }
});

// Get quiz by ID (only questions with IDs, no correct answers)
router.get("/:id", async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id);
    if (!quiz) return res.status(404).json({ msg: "Quiz not found" });

    // Send questions with IDs only, no correctAnswerIndex
    const questionsToSend = quiz.questions.map((q) => ({
      id: q._id,
      questionText: q.questionText,
      options: q.options.map((opt) => ({ id: opt._id, text: opt.text })),
    }));

    res.json({
      id: quiz._id,
      title: quiz.title,
      subject: quiz.subject,
      difficulty: quiz.difficulty,
      timeLimit: quiz.timeLimit,
      questions: questionsToSend,
    });
  } catch (err) {
    res.status(500).send("Server Error");
  }
});

// Submit quiz answers
router.post("/:id/submit", async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id);
    if (!quiz) return res.status(404).json({ msg: "Quiz not found" });

    const submittedAnswers = req.body.answers; // array: { questionId, selectedOptionId }

    let score = 0;
    const results = submittedAnswers.map(({ questionId, selectedOptionId }) => {
      const question = quiz.questions.find((q) => q._id.toString() === questionId);
      if (!question) return { questionId, correct: false };

      const correctOption = question.options[question.correctAnswerIndex];
      const correct = correctOption._id.toString() === selectedOptionId;
      if (correct) score += 1;

      return { questionId, correct };
    });

    res.json({ score, total: quiz.questions.length, results });
  } catch (err) {
    res.status(500).send("Server Error");
  }
});

module.exports = router;

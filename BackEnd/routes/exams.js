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
    const quiz = await Quiz.findById(req.params.id).lean();//lean() makes it a plain js object
    if (!quiz) return res.status(404).json({ msg: "Quiz not found" });

    // Send questions with IDs only, no correctAnswerIndex(sanitization)
    const questionsForStudent = quiz.questions.map((q) => {
      const {correctAnswerIndex, ...questionWithoutAnswer} = q;
      return questionWithoutAnswer;
    });

    res.json({
      ...quiz, questions: questionsForStudent,
    });
  } catch (err) {
    res.status(500).send("Server Error");
  }
});

// Submit quiz answers
router.post("/:id/submit", async (req, res) => {
  try {

    //I getting full quiz with answers 
    const quiz = await Quiz.findById(req.params.id);
    if (!quiz) return res.status(404).json({ msg: "Quiz not found" });
    
    //II. Get user's answer
    const userAnswers = req.body.answers; // array: { questionId, selectedOptionId }

    let correctAnswersCount = 0;

    //III. Comparing answers and calculation
quiz.questions.forEach((question, index) => {
  if (question.correctAnswerIndex === userAnswers[index]){
    correctAnswersCount++;
  }
})
//send a complete result 
    res.json({ 
      quizTitle: quiz.title,
      totalQuestions: quiz.questions.length,
      correctAnswersCount,
      fullQuiz: quiz,
      userAnswers,
     });
  } catch (err) {
    console.error("Error submitting quiz:", err)
    res.status(500).send("Server Error");
  }
});

module.exports = router;

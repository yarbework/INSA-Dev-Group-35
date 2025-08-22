const express = require("express");
const router = express.Router();
const Quiz = require("../models/Quiz");

router.get("/", async (req, res) => {
  try {
    const quizzes = await Quiz.find().select("-questions");
    res.json(quizzes);
  } catch (err) {
    res.status(500).send("Server Error");
  }
});


router.post("/", async (req, res) => {
  try {
    const newQuiz = new Quiz(req.body);
    await newQuiz.save();
    res.status(201).json(newQuiz);
  } catch (err) {
    res.status(400).json({ msg: "Failed to create quiz.", error: err.message });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id).lean();
    if (!quiz) return res.status(404).json({ msg: "Quiz not found" });

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

router.post("/:id/submit", async (req, res) => {
  try {

    const quiz = await Quiz.findById(req.params.id);
    if (!quiz) return res.status(404).json({ msg: "Quiz not found" });
    
    const userAnswers = req.body.answers; 

    let correctAnswersCount = 0;


quiz.questions.forEach((question, index) => {
  if (question.correctAnswerIndex === userAnswers[index]){
    correctAnswersCount++;
  }
})

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
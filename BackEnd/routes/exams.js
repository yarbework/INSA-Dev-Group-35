const express = require("express");
const router = express.Router();
const Quiz = require("../models/Quiz");

// Get all quizzes
router.get("/", async (req, res) => {
  try {
    const quizzes = await Quiz.find().select("-questions");
    res.json(quizzes);
  } catch (err) {
    res.status(500).send("server Error");
  }
});

//Craete a new quiz

router.post("/", async (req, res) => {
  try {
    const newQuiz = new Quiz(req.body);
    await newQuiz.save();
    res.status(201).json(newQuiz);
  } catch (err) {
    res.status(400).json({ msg: "failed to create quiz.", error: err.message });
  }
});

// Get a quiz by ID
router.get("/:id", async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id);
    if (!quiz) {
      return res.status(404).json({ msg: "Quiz not found" });
    }
    res.json(quiz);
  } catch (err) {
    // Handle errors related to invalid ObjectId format
    res.status(500).send("Server Error");
  }
});
module.exports = router;

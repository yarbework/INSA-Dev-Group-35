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

module.exports = router;

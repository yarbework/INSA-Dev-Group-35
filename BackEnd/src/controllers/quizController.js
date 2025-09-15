const Quiz = require("../models/Quiz");

exports.getQuizzes = async (req, res) => {
  try {
    const quizzes = await Quiz.find().select("-questions");
    res.json(quizzes);
  } catch (err) {
    res.status(500).send("Server Error");
  }
};

exports.createQuiz = async (req, res) => {
  try {
    const newQuiz = new Quiz(req.body);
    await newQuiz.save();
    res.status(201).json(newQuiz);
  } catch (err) {
    res.status(400).json({ msg: "Failed to create quiz", error: err.message });
  }
};


exports.getQuizById = async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id);
    if (!quiz) return res.status(404).json({ msg: "Quiz not found" });
    res.json(quiz);
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
};



exports.submitQuiz = async (req, res) => {
  try {
    const { answers } = req.body; // array of chosen answer indexes
    const quiz = await Quiz.findById(req.params.id);

    if (!quiz) return res.status(404).json({ msg: "Quiz not found" });

    let score = 0;
    quiz.questions.forEach((q, index) => {
      if (answers[index] === q.correctAnswerIndex) {
        score++;
      }
    });

    res.json({ 
      msg: "Quiz submitted successfully", 
      score, 
      total: quiz.questions.length 
    });
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
};




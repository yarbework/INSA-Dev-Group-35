const Quiz = require("../models/Quiz");
const User = require("../models/User");
const jwt = require("jsonwebtoken");
const { askGemini } = require("../services/aiService");

// =========================
// CREATE - POST /api/quizzes
// =========================
exports.createQuiz = async (req, res) => {
  const token = req.cookies.token;
  try {
    if (!token) return res.status(401).json({ msg: "Unauthorized" });
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.body.author = decoded.user.id;

    const newQuiz = new Quiz(req.body);
    await newQuiz.save();
    res.status(201).json(newQuiz);
  } catch (err) {
    res.status(400).json({ msg: "Failed to create quiz", error: err.message });
  }
};

// =========================
// READ - GET /api/quizzes
// =========================
exports.getQuizzes = async (req, res) => {
  try {
    const quizzes = await Quiz.find().select("-questions"); // List view, exclude questions
    res.json(quizzes);
  } catch (err) {
    res.status(500).json({ msg: "Server error", error: err.message });
  }
};

//===========================
// READ - GET /api/myQuizzes
//==========================

exports.myQuizzes = async (req, res) => {
  const token = req.cookies.token
  
  try{
    if (!token) return res.status(401).json({ msg: "Unauthorized" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    const user = decoded.user

    const quizzes = await Quiz.find({author: user.id})

    if (!quizzes) return res.status(400).json({msg: "no quizzes found"})

    res.json(quizzes)
  }
  catch (err){
    res.status(500).json({ msg: "Server error", error: err.message });
  }
}

// =========================
// READ - GET /api/quizzes/:id
// =========================
exports.getQuizById = async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id);
    if (!quiz) return res.status(404).json({ msg: "Quiz not found" });
    res.json(quiz);
  } catch (err) {
    res.status(500).json({ msg: "Server error", error: err.message });
  }
};

// =========================
// UPDATE - PUT /api/quizzes/:id
// =========================
exports.editQuiz = async (req, res) => {
  token = req.cookies.token
  try {
    if (!token){
      return res.status(401).json({msg: "Unauthorized"})
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    const sentUser = decoded.user

    if (sentUser.role != "Instructor"){
      return res.status(401).json({msg: "Unauthorized"})
    }

    // Find the quiz by ID
    const quiz = await Quiz.findById(req.params.id);
    if (!quiz) return res.status(404).json({ msg: "Quiz not found" });

    if (quiz.author != sentUser.id){
      return res.status(401).json({msg: "Unauthorized"})
    }

    // Update only the fields provided in req.body
    Object.keys(req.body).forEach((key) => {
      quiz[key] = req.body[key];
    });

    // Save the updated quiz
    await quiz.save();

    res.json(quiz); // Return the updated quiz
  } catch (err) {
    res.status(400).json({ msg: "Failed to edit quiz", error: err.message });
  }
};

// =========================
// DELETE - DELETE /api/quizzes/:id
// =========================
exports.deleteQuiz = async (req, res) => {
  try {
    const quiz = await Quiz.findByIdAndDelete(req.params.id);
    if (!quiz) return res.status(404).json({ msg: "Quiz not found" });
    res.json({ msg: "Quiz deleted successfully" });
  } catch (err) {
    res.status(500).json({ msg: "Server error", error: err.message });
  }
};

// =========================
// CUSTOM - POST /api/quizzes/:id/submit
// Submit answers and calculate score
// =========================
exports.submitQuiz = async (req, res) => {
  try {
    const { answers } = req.body;
    const quiz = await Quiz.findById(req.params.id);
    if (!quiz) return res.status(404).json({ msg: "Quiz not found" });

    let score = 0;
    quiz.questions.forEach((q, index) => {
      if (answers[index] === q.correctAnswerIndex) score++;
    });

    res.json({ msg: "Quiz submitted successfully", score, total: quiz.questions.length });
  } catch (err) {
    res.status(500).json({ msg: "Server error", error: err.message });
  }
};

// =========================
// CUSTOM - POST /api/quizzes/:id/ai-assessment
// Optional AI assessment for user's answers
// =========================
exports.getAiAssessment = async (req, res) => {
  const token = req.cookies.token
  try {
    if (!token){
      return res.status(401).json({msg: "Unauthorized"})
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    const sentUser = decoded.user

    const user = await User.findById(sentUser.id);
    if (!user) return res.status(404).json({ msg: "User not found" });

    const quizId = req.body.quizId || req.params.id;
    if (!quizId) return res.status(400).json({ msg: "Quiz ID is required" });

    const quiz = await Quiz.findById(quizId);
    if (!quiz) return res.status(404).json({ msg: "Quiz not found" });

    // Return existing AI review if present
    if (user.score?.[quizId]?.AiReview) return res.json(user.score[quizId].AiReview);

    // Prepare AI request
    const questionPayload = {
      instruction: "Provide a detailed AI assessment for the user answers. Format the response as an object with keys 'question', 'correctAnswer', 'userAnswer', 'feedback', and 'score'. Do not add any extra text.",
      questions: quiz.questions,
      user_answers: req.body.answers,
    };

    const aiResponse = await askGemini(questionPayload);

    // Save AI review
    if (!user.score) user.score = {};
    user.score[quizId] = { ...user.score[quizId], AiReview: aiResponse };
    await user.save();

    res.json(user.score[quizId].AiReview);
  } catch (err) {
    console.error("AI assessment error:", err);
    res.status(500).json({ msg: "Server error", error: err.message });
  }
};

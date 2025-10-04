const express = require("express");
const router = express.Router();
const quizController = require("../controllers/quizController");
const { authorizeRoles, requireLogin } = require("../middlewares/authMiddleware");
const validateQuizData = require("../middlewares/validateQuizData");
const {aiLimiter} = require("../middlewares/rateLimiter");

// Public GET quizzes
router.get("/", quizController.getQuizzes);

// Create quiz - only Instructor
router.post("/", requireLogin, authorizeRoles("Instructor"), validateQuizData, quizController.createQuiz);

// Get quiz by ID - require login
router.get("/:id", requireLogin, quizController.getQuizById);

// Submit quiz
router.post("/:id/submit", requireLogin, quizController.submitQuiz);

// AI assessment
router.post("/:id/ai-assessment", requireLogin, aiLimiter, quizController.getAiAssessment);

// Edit quiz - only Instructor
router.put("/:id", requireLogin, authorizeRoles("Instructor"), validateQuizData, quizController.editQuiz);

// Delete quiz - only Instructor
router.delete("/:id", requireLogin, authorizeRoles("Instructor"), quizController.deleteQuiz);

// Get my quizzes
router.get("/myQuizzes", requireLogin, quizController.myQuizzes);

// Question management (Instructor only)
router.post("/:quizId/questions", requireLogin, authorizeRoles("Instructor"), quizController.addQuestion);
router.put("/:quizId/questions/:questionId", requireLogin, authorizeRoles("Instructor"), quizController.editQuestion);
router.delete("/:quizId/questions/:questionId", requireLogin, authorizeRoles("Instructor"), quizController.deleteQuestion);


module.exports = router;

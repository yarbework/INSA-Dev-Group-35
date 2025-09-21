const express = require("express");
const router = express.Router();
const quizController = require("../controllers/quizController");
const { authorizeRoles, requireLogin } = require("../middlewares/authMiddleware"); // use it when you wanna role based dessions
const validateQuizData = require("../middlewares/validateQuizData")
// const aiAssessment = require("../services/aiService")


router.get("/", quizController.getQuizzes);
router.post("/", quizController.createQuiz, authorizeRoles("Instructor"), requireLogin, validateQuizData);
router.get("/:id", quizController.getQuizById, requireLogin);
router.post("/:id/submit", quizController.submitQuiz, requireLogin);
router.post("/ai-assessment", quizController.getAiAssessment, requireLogin)
router.put("/:id", quizController.editQuiz, requireLogin, validateQuizData)


module.exports = router;

const express = require("express");
const router = express.Router();
const quizController = require("../controllers/quizController");
const { authorizeRoles, requireLogin } = require("../middlewares/authMiddleware"); // use it when you wanna role based dessions


router.get("/", quizController.getQuizzes);
router.post("/", quizController.createQuiz, authorizeRoles("Instructor"), requireLogin);
router.get("/:id", quizController.getQuizById, requireLogin);
router.post("/:id/submit", quizController.submitQuiz, requireLogin);

module.exports = router;

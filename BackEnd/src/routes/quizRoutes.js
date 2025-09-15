const express = require("express");
const router = express.Router();
const quizController = require("../controllers/quizController");

router.get("/", quizController.getQuizzes);
router.post("/", quizController.createQuiz);
router.get("/:id", quizController.getQuizById);
router.post("/:id/submit", quizController.submitQuiz);

module.exports = router;

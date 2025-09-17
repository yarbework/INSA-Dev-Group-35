const express = require("express");
const router = express.Router();

const geminiController = require("../controllers/geminiController")

router.post("/ask", geminiController.askGemini);

module.exports = router;

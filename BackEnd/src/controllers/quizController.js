const Quiz = require("../models/Quiz");
const User = require("../models/User");
const jwt = require("jsonwebtoken");
const {askGemini} = require("../services/aiService");
const redisClient = require("../config/redis"); // your redis.js file


// =========================
// CREATE - POST /api/quizzes
// =========================
exports.createQuiz = async (req, res) => {
    try {
        req.body.author = req.user.id;
        const newQuiz = new Quiz(req.body);
        await newQuiz.save();

        await redisClient.flushAll();
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
        let page = parseInt(req.query.page) || 1;
        const perPage = 20;

        // Filters from query
        const filter = {};
        if (req.query.subject) filter.subject = req.query.subject;
        if (req.query.difficulty) filter.difficulty = req.query.difficulty;

        const cacheKey = `quizzes:page:${page}:subject:${req.query.subject || "all"}:difficulty:${req.query.difficulty || "all"}`;

        // Look in cache
        const cached = await redisClient.get(cacheKey);
        if (cached) {
            return res.json(JSON.parse(cached));
        }

        const total = await Quiz.countDocuments(filter);
        const quizzes = await Quiz.find(filter)
            .skip((page - 1) * perPage)
            .limit(perPage)
            .select("-questions");

        const result = {
            quizzes,
            totalItems: total,
            currentPage: page,
            totalPages: Math.ceil(total / perPage),
        };

        // Save in cache
        await redisClient.setEx(cacheKey, 3600, JSON.stringify(result));

        res.json(result);
    } catch (err) {
        res.status(500).json({ msg: "Server error", error: err.message });
    }
};


//===========================
// READ - GET /api/myQuizzes
//==========================
exports.myQuizzes = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const perPage = 20;
        const userId = req.user.id;

        const cacheKey = `myQuizzes:${userId}:page:${page}`;
        const cached = await redisClient.get(cacheKey);
        if (cached) return res.json(JSON.parse(cached));

        const total = await Quiz.countDocuments({ author: userId });
        const quizzes = await Quiz.find({ author: userId })
            .skip((page - 1) * perPage)
            .limit(perPage);

        if (quizzes.length === 0) return res.status(404).json({ msg: "No quizzes found" });

        const result = {
            quizzes,
            totalItems: total,
            currentPage: page,
            totalPages: Math.ceil(total / perPage),
        };

        await redisClient.setEx(cacheKey, 3600, JSON.stringify(result));
        res.json(result);
    } catch (err) {
        res.status(500).json({ msg: "Server error", error: err.message });
    }
};

// =========================
// READ - GET /api/quizzes/:id
// =========================
exports.getQuizById = async (req, res) => {
    try {
        const cacheKey = `quiz:${req.params.id}`;
        const cached = await redisClient.get(cacheKey);
        if (cached) {
            return res.json(JSON.parse(cached));
        }

        const quiz = await Quiz.findById(req.params.id);
        if (!quiz) return res.status(404).json({ msg: "Quiz not found" });

        await redisClient.setEx(cacheKey, 3600, JSON.stringify(quiz));

        res.json(quiz);
    } catch (err) {
        res.status(500).json({ msg: "Server error", error: err.message });
    }
};


// =========================
// UPDATE - PUT /api/quizzes/:id
// =========================
exports.editQuiz = async (req, res) => {
    try {
        const sentUser = req.user;

        if (sentUser.role !== "Instructor") {
            return res.status(403).json({ msg: "Unauthorized" });
        }

        const quiz = await Quiz.findById(req.params.id);
        if (!quiz) return res.status(404).json({ msg: "Quiz not found" });

        if (quiz.author.toString() !== sentUser.id) {
            return res.status(403).json({ msg: "Unauthorized" });
        }

        Object.keys(req.body).forEach((key) => {
            quiz[key] = req.body[key];
        });

        await quiz.save();
        await redisClient.flushAll();

        res.json(quiz);
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
        //delet the invalid catch, there is a better way doing this but this is the easiet approach
        await redisClient.flushAll();
        if (!quiz) return res.status(404).json({msg: "Quiz not found"});
        res.json({msg: "Quiz deleted successfully"});
    } catch (err) {
        res.status(500).json({msg: "Server error", error: err.message});
    }
};

// =========================
// CUSTOM - POST /api/quizzes/:id/submit
// Submit answers and calculate score
// =========================
exports.submitQuiz = async (req, res) => {
    try {
        const { answers } = req.body;

        // Validate answers
        if (!answers || !Array.isArray(answers)) {
            return res.status(400).json({ msg: "Answers must be provided as an array" });
        }

        // Find quiz
        const quiz = await Quiz.findById(req.params.id);
        if (!quiz) {
            return res.status(404).json({ msg: "Quiz not found" });
        }

        // Calculate score
        let score = 0;
        quiz.questions.forEach((q, index) => {
            if (answers[index] !== undefined && answers[index] === q.correctAnswerIndex) {
                score++;
            }
        });


        //delet the invalid catch, there is a better way doing this but this is the easiet approach
        await redisClient.flushAll();
        res.json({
            msg: "Quiz submitted successfully",
            score,
            total: quiz.questions.length,
        });
    } catch (err) {
        res.status(500).json({ msg: "Server error", error: err.message });
    }
};


// =========================
// CUSTOM - POST /api/quizzes/:id/ai-assessment
// Optional AI assessment for user's answers
// =========================
exports.getAiAssessment = async (req, res) => {
    try {
        const sentUser = req.user;
        const user = await User.findById(sentUser.id);
        if (!user) return res.status(404).json({ msg: "User not found" });

        const quizId = req.body.quizId || req.params.id;
        if (!quizId) return res.status(400).json({ msg: "Quiz ID is required" });

        const quiz = await Quiz.findById(quizId);
        if (!quiz) return res.status(404).json({ msg: "Quiz not found" });

        if (user.scores?.[quizId]?.AiReview) {
            return res.json(user.scores[quizId].AiReview);
        }

        const questionPayload = {
            instruction: "Provide a detailed AI assessment...",
            questions: quiz.questions,
            user_answers: req.body.answers,
        };

        const aiResponse = await askGemini(questionPayload);

        if (!user.scores) user.scores = {};
        user.scores[quizId] = { ...user.scores[quizId], AiReview: aiResponse };
        await user.save();

        res.json(user.scores[quizId].AiReview);
    } catch (err) {
        console.error("AI assessment error:", err);
        res.status(500).json({ msg: "Server error", error: err.message });
    }
};

// =========================
// ADD QUESTION - POST /api/quizzes/:quizId/questions
// =========================
exports.addQuestion = async (req, res) => {
    try {
        const { text, options, correctAnswerIndex } = req.body;
        if (!text || !options || correctAnswerIndex === undefined) {
            return res.status(400).json({ msg: "All question fields are required" });
        }

        const quiz = await Quiz.findById(req.params.quizId);
        if (!quiz) return res.status(404).json({ msg: "Quiz not found" });

        quiz.questions.push({ text, options, correctAnswerIndex });
        await quiz.save();
        await redisClient.flushAll();

        res.status(201).json({ msg: "Question added", quiz });
    } catch (err) {
        res.status(500).json({ msg: "Server error", error: err.message });
    }
};

// =========================
// EDIT QUESTION - PUT /api/quizzes/:quizId/questions/:questionId
// =========================
exports.editQuestion = async (req, res) => {
    try {
        const quiz = await Quiz.findById(req.params.quizId);
        if (!quiz) return res.status(404).json({ msg: "Quiz not found" });

        const question = quiz.questions.id(req.params.questionId);
        if (!question) return res.status(404).json({ msg: "Question not found" });

        Object.keys(req.body).forEach((key) => {
            question[key] = req.body[key];
        });

        await quiz.save();
        await redisClient.flushAll();

        res.json({ msg: "Question updated", quiz });
    } catch (err) {
        res.status(500).json({ msg: "Server error", error: err.message });
    }
};

// =========================
// DELETE QUESTION - DELETE /api/quizzes/:quizId/questions/:questionId
// =========================
exports.deleteQuestion = async (req, res) => {
    try {
        const quiz = await Quiz.findById(req.params.quizId);
        if (!quiz) return res.status(404).json({ msg: "Quiz not found" });

        const question = quiz.questions.id(req.params.questionId);
        if (!question) return res.status(404).json({ msg: "Question not found" });

        question.remove();
        await quiz.save();
        await redisClient.flushAll();

        res.json({ msg: "Question deleted", quiz });
    } catch (err) {
        res.status(500).json({ msg: "Server error", error: err.message });
    }
};

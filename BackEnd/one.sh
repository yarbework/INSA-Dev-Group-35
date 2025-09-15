#!/bin/bash
# Remove old src folder if exists
rm -rf src

# Create folder structure
mkdir -p src/models src/middlewares src/controllers src/routes src/utils

# -----------------------------
# Models
# -----------------------------
cat > src/models/User.js <<'EOF'
const mongoose = require("mongoose");

const scoreSchema = new mongoose.Schema({
  quizId: { type: mongoose.Schema.Types.ObjectId, ref: 'Quiz', required: true },
  subject: { type: String },
  difficulty: { type: String },
  score: { type: Number, required: true },
  date: { type: Date, default: Date.now }
});

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: false }, // null for OAuth
  email: { type: String, required: true, unique: true, lowercase: true },
  role: { type: String, enum: ["Student", "Instructor", "Admin"], required: true },
  scores: [scoreSchema],
  profilePicture: { type: String, default: '' },
  school: { type: String, default: '' },
  grade: { type: String, default: '' },
  section: { type: String, default: '' }
}, { timestamps: true });

module.exports = mongoose.model("User", UserSchema);
EOF

cat > src/models/Quiz.js <<'EOF'
const mongoose = require("mongoose");

const OptionSchema = new mongoose.Schema({
  text: { type: String, required: true },
});

const QuestionSchema = new mongoose.Schema({
  questionText: { type: String, required: true },
  options: [OptionSchema],
  correctAnswerIndex: { type: Number, required: true },
});

const QuizSchema = new mongoose.Schema({
  title: { type: String, required: true },
  subject: { type: String, required: true },
  author: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  difficulty: { type: String, enum: ["Easy", "Medium", "Hard"], required: true },
  timeLimit: { type: Number, required: true },
  privacy: { type: String, enum: ["public", "private"], default: "public", required: true },
  password: { type: String },
  questions: [QuestionSchema],
  questionCount: { type: Number, required: true }
}, { timestamps: true });

module.exports = mongoose.model("Quiz", QuizSchema);
EOF

# -----------------------------
# Middlewares
# -----------------------------
cat > src/middlewares/rateLimiter.js <<'EOF'
const rateLimit = require("express-rate-limit");

exports.loginLimiter = rateLimit({
  windowMs: 5*60*1000,
  limit: 5,
  statusCode: 429,
  message: { message: "Too many login attempts, please try again later" }
});

exports.signUpLimiter = rateLimit({
  windowMs: 5*60*1000,
  limit: 10,
  statusCode: 429,
  message: { message: "Too many sign-up attempts, please try again later" }
});
EOF

# -----------------------------
# Controllers
# -----------------------------
cat > src/controllers/authController.js <<'EOF'
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

exports.signup = async (req, res) => {
  try {
    const { username, email, password, role } = req.body;
    if (!username || !email || !password || !role)
      return res.status(400).json({ msg: "All fields are required" });

    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ msg: "User already exists with this email" });

    const hashedPassword = await bcrypt.hash(password, 10);

    user = new User({ username, email, password: hashedPassword, role });
    await user.save();

    res.status(201).json({ msg: "User registered successfully", success: true });
  } catch (err) {
    res.status(500).send("Server Error");
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || !password) return res.status(400).json({ msg: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password || "");
    if (!isMatch) return res.status(400).json({ msg: "Invalid credentials" });

    const payload = { user: { id: user.id } };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "1h" });

    res.cookie("token", token, { httpOnly: true, secure: false, sameSite: "lax", maxAge: 60*60*1000 });
    res.json({ msg: "Login successful", success: true });
  } catch (err) {
    res.status(500).send("Server Error");
  }
};

exports.logout = (req, res) => {
  res.clearCookie("token");
  res.json({ msg: "Logged out successfully" });
};
EOF

cat > src/controllers/quizController.js <<'EOF'
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
EOF

# -----------------------------
# Routes
# -----------------------------
cat > src/routes/authRoutes.js <<'EOF'
const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const { loginLimiter, signUpLimiter } = require("../middlewares/rateLimiter");

router.post("/signup", signUpLimiter, authController.signup);
router.post("/login", loginLimiter, authController.login);
router.post("/logout", authController.logout);

module.exports = router;
EOF

cat > src/routes/quizRoutes.js <<'EOF'
const express = require("express");
const router = express.Router();
const quizController = require("../controllers/quizController");

router.get("/", quizController.getQuizzes);
router.post("/", quizController.createQuiz);

module.exports = router;
EOF

# -----------------------------
# App & Server
# -----------------------------
cat > src/app.js <<'EOF'
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const authRoutes = require("./routes/authRoutes");
const quizRoutes = require("./routes/quizRoutes");

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(cors({ origin: "http://localhost:5173", credentials: true }));

app.use("/api/auth", authRoutes);
app.use("/api/quizzes", quizRoutes);

module.exports = app;
EOF

cat > src/server.js <<'EOF'
const mongoose = require("mongoose");
const app = require("./app");

const PORT = process.env.PORT || 4000;

mongoose.connect(process.env.MONGO_URI, {})
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("MongoDB error:", err));

app.listen(PORT, () => console.log(`🚀 Server running at http://localhost:${PORT}`));
EOF

# -----------------------------
# Env & Gitignore
# -----------------------------
cat > .env <<'EOF'
MONGO_URI=mongodb://localhost:27017/onlineQuizApp
JWT_SECRET=supersecretjwtkey
EOF

cat > .gitignore <<'EOF'
node_modules/
.env
EOF

echo "✅ Backend structure created successfully with proper endpoints!"

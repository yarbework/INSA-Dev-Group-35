require('dotenv').config();
const express = require("express");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const cors = require("cors");
const cookieParser = require("cookie-parser");

// OAuth2
const session = require("express-session");
const passport = require("passport");
require("./OAuth");

const app = express();
const PORT = process.env.PORT || 4000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}));

// Session for passport
app.use(session({
  secret: "cats",
  resave: false,
  saveUninitialized: true,
  cookie: {
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000
  }
}));

app.use(passport.initialize());
app.use(passport.session());

// OAuth routes
app.get("/", (req, res) => {
  res.send('<a href="/auth/google">Sign up with Google</a>');
});

app.get("/auth/google",
  passport.authenticate("google", { scope: ["email", "profile"] })
);

app.get("/auth/google/callback",
  passport.authenticate("google", { failureRedirect: "/auth/google/failure", session: false }),
  (req, res) => {
    // Set JWT cookie
    res.cookie("token", req.user.token, {
      httpOnly: true,
      secure: false, // true if using https
      sameSite: "lax",
      maxAge: 60 * 60 * 1000, // 1 hour
    });

    // Redirect to frontend
    res.redirect("http://localhost:5173");
  }
);

app.get("/auth/google/failure", (req, res) => {
  res.send("Failed to authenticate with Google.");
});

// MongoDB connection
mongoose.connect(process.env.MONGO_URI, {})
  .then(() => console.log("MongoDB connected successfully"))
  .catch((err) => console.error(err));

// API routes
app.use("/api/endPoints", require("./routes/endPoints"));
app.use("/api/exams", require("./routes/exams"));

app.listen(PORT, () =>
  console.log(`Backend server running on http://localhost:${PORT}`)
);

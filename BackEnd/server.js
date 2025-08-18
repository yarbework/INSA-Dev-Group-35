require('dotenv').config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const cookieParser = require("cookie-parser")

// OAUth2
const session = require("express-session");
const passport = require("passport");
require("./OAuth");


const app = express();
const PORT = process.env.PORT || 4000;

// OAUTH authentication
function isLoggedIn(req, res, next) {
  req.user ? next() : res.sendStatus(401);
}

app.use(session({ secret: "cats", resave: false, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());

app.get("/", (req, res) => {
  res.send('<a href="/auth/google">Sign up with Google</a>');
});

app.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["email", "profile"] })
);

app.get(
  "/auth/google/callback",
  passport.authenticate("google", {

    failureRedirect: "/auth/google/failure",
  }),
  (req, res) => {

    // After successful authentication, redirect to /api/exams
    res.redirect("/api/exams");
  }
);


app.get("/auth/google/failure", (req, res) => {
  res.send("Failed to authenticate..");
});



// Middleware
app.use(express.json())
app.use(cors({
    origin: "http://localhost:5173", // the front ends port name, where the front end is running
    credentials: true
}));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser())

// Database (MongoDB)connection

const MONGO_URI = process.env.MONGO_URI;
mongoose.connect(MONGO_URI, {})
  .then(() => console.log("MongoDB connected successfully"))
  .catch((err) => console.error(err));

//API Routes
app.use("/api/endPoints", require("./routes/endPoints"));
app.use("/api/exams", require("./routes/exams"));

app.listen(PORT, () =>
  console.log(`Backend server running on http://localhost:${PORT}`)
);

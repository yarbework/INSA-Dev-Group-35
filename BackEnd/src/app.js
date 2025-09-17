require("dotenv").config();
require("./OAuth");
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const authRoutes = require("./routes/authRoutes");
const quizRoutes = require("./routes/quizRoutes");
const geminiRoutes = require("./routes/geminiRoutes");






const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors({ origin: "http://localhost:5173", credentials: true }));


app.use("/api/auth", authRoutes);
app.use("/api/quizzes", quizRoutes);
app.use("/auth", authRoutes);
app.use("/api/gemini", geminiRoutes);


module.exports = app;

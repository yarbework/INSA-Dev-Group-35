require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 4000;

// Middleware
app.use(cors());
app.use(express.json());

// Database (MongoDB)connection

const MONGO_URI = process.env.MONGO_URI;
mongoose.connect(MONGO_URI, {})
  .then(() => console.log("MongoDB connected successfully"))
  .catch((err) => console.error(err));

//API Routes
app.use("/api/auth", require("./routes/auth"));
app.use("/api/exams", require("./routes/exams"));

app.listen(PORT, () =>
  console.log(`Backend server running on http://localhost:${PORT}`)
);

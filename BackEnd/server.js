require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const cookieParser = require("cookie-parser")
const {sanitizeMiddleware} = require("./middlewares/sanitize_form_input")


const app = express();
const PORT = process.env.PORT || 4000;

// Middleware
app.use(cors({
    origin: "http://localhost:5173", // the fron ends port name, where the front end is running
    credentials: true
}));
app.use(express.json());
app.use(cookieParser())
app.use(sanitizeMiddleware)

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

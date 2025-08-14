const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const router = express.Router();
const {loginLimiter, signUpLimiter} = require("../middlewares/rate_limiter")

// Register route
router.post("/signup", signUpLimiter ,async (req, res) => {
  try {
    const { username, email, password } = req.body;
    // Check if user already exists
    if (!username || !email || !password)
      return res
        .status(400)
        .json({ msg: "All fields are required: Please fill all fields" });

    let user = await User.findOne({ email });
    if (user)
      return res
        .status(400)
        .json({ msg: "User already exists with this email" });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    user = new User({
      username,
      email,
      password: hashedPassword,
    });
    await user.save();
    res.status(201).json({ msg: "User registered successfully" });
  } catch (err) {
    res.status(500).send("Server Error");
  }
});

// Login route

router.post("/login", loginLimiter ,async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res
        .status(400)
        .json({ msg: "All fields are required: Please fill all fields" });
    const user = await User.findOne({ email });
    if (!user)
      return res
        .status(400)
        .json({ msg: "Invalid credentials: User not found" });
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res
        .status(400)
        .json({ msg: "Invalid credentials: Incorrect password" });
    const payload = { user: { id: user.id } };
    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: "1h" },
      (err, token) => {
        if (err) throw err;
        res.json({ token });
      }
    );
  } catch (err) {
    res.status(500).send("Server Error");
  }
});

module.exports = router;

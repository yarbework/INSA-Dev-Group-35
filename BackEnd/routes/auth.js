const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const router = express.Router();

const {loginLimiter, signUpLimiter} = require("../middlewares/rate_limiter")

// Register route
router.post("/signup", signUpLimiter ,async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    // Check if user already exists
    if (!name || !email || !password || !role)
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
      username: name,
      email,
      password: hashedPassword,
      role
    });
    await user.save();
    res.status(201).json({ 
      msg: "User registered successfully",
      success: true
    });
  } catch (err) {
     console.log(err)
    res.status(500).send("Server Error");
  }

});

// Login route

router.post("/login", loginLimiter, async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ msg: "All fields are required" });

    const user = await User.findOne({ email });
    if (!user)
      return res.status(400).json({ msg: "Invalid credentials: User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ msg: "Invalid credentials: Incorrect password" });

    const payload = { user: { id: user.id } };

    // generate JWT
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "1h" });

    // send token in HTTP-only cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: false, // set to true if using HTTPS
      sameSite: "lax",
      maxAge: 60 * 60 * 1000, // 1 hour
    });

    res.json({ msg: "Login successful", success: true });
  } catch (err) {
    console.error("Login error:", err.message);
    res.status(500).send("Server Error");
  }
});


router.post("/logout", (req, res) => {
  res.clearCookie("token");
  res.json({ msg: "Logged out successfully" });
});

module.exports = router;

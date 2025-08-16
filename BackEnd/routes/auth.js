const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const router = express.Router();
const { sanitizeBody } = require("../middlewares/sanitize_form_input")

const {loginLimiter, signUpLimiter} = require("../middlewares/rate_limiter")

// Register route
router.post("/signup", signUpLimiter, sanitizeBody ,async (req, res, next) => {
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
    res.status(201).json({ msg: "User registered successfully" });
  } catch (err) {
     next(err)
    // res.status(500).send("Server Error");
  }

});

// Login route

router.post("/login", loginLimiter, sanitizeBody ,async (req, res, next) => {
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
      { expiresIn: "1h",
        httpOnly:true, //js can not access it
        sameSite: "lax" // for csrf protection
       },
      (err, token) => {
        if (err) throw err;
        res.json({ token });
      }
    );
  } catch (err) {
    next(err)
    // res.status(500).send("Server Error");
  }
});

module.exports = router;

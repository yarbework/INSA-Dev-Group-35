const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const router = express.Router();

const {loginLimiter, signUpLimiter} = require("../middlewares/rate_limiter")

// ==================
// REGISTRTION ROUTE
//===================

router.post("/signup", signUpLimiter ,async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

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

//======================
// LOGIN ROUTE
//======================

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


    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "1h" });


    res.cookie("token", token, {
      httpOnly: true,
      secure: false, 
      sameSite: "lax",
      maxAge: 60 * 60 * 1000, 
    });

    res.json({ msg: "Login successful", success: true });
  } catch (err) {
    console.error("Login error:", err.message);
    res.status(500).send("Server Error");
  }
});

//================================
//LOGOUTE ROUTE
//================================


router.post("/logout", (req, res) => {
  res.clearCookie("token");
  res.json({ msg: "Logged out successfully" });
});


//===========================
// LOGIN ATHENTICATION ROUTE
//===========================

router.get("/me", async (req, res) => {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({ loggedIn: false });
  }

  try {

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.user.id).select("username role");
    // console.log(user)

    if (!user) {
      return res.status(404).json({ loggedIn: false });
    }

    return res.json({ loggedIn: true, user });
  } catch (err) {
    console.error("Error in /me:", err.message);
    return res.status(401).json({ loggedIn: false });
  }
});



//==========================
// save score in the data
//==========================


router.put("/score", async (req, res) =>{

  const token = req.cookies.token;

  if (!token){
    return res.status(401).json({msg: "not loged in or user does not exist"})
  }

  try {

    const decoded = jwt.verify(token, process.env.JWT_SECRET)

    const {subject, difficulty, score} = req.body
    const user = await user.findById(decoded.user.id)

    if(!user){
      res.status(404).json({msg: "user not found"})
    }

    user.score.push({subject, difficulty, score})

    await user.save()

    res.json({msg: "Score added successfully", scores: user.scores })
    
  } catch (error) {
    console.error(error)
    res.status(500).json({msg: "unknow error"})
  }

} )


module.exports = router;

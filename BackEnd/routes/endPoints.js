const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const router = express.Router();

const { loginLimiter, signUpLimiter } = require("../middlewares/rate_limiter");

// ==================
// REGISTRATION ROUTE
//===================
router.post("/signup", signUpLimiter, async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password || !role)
      return res.status(400).json({ msg: "All fields are required" });

    let user = await User.findOne({ email });
    if (user)
      return res.status(400).json({ msg: "User already exists with this email" });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    user = new User({
      username: name,
      email,
      password: hashedPassword,
      role
    });

    await user.save();
    res.status(201).json({ msg: "User registered successfully", success: true });
  } catch (err) {
    console.log(err);
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

//======================
// LOGOUT ROUTE
//======================
router.post("/logout", (req, res) => {
  res.clearCookie("token");
  res.json({ msg: "Logged out successfully" });
});


//===========================
// GET USER PROFILE
//===========================
router.get('/profile', async(req, res)=>{
  const token = req.cookies.token;
  if (!token) return res.status(401).json({
    msg: "Authentication token not found."
  })
  try{
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // without password finding the user
    const user = await User.findById(decoded.user.id).select("-password");

    if (!user) return res.status(404).json({msg: "User not found."});
    res.json(user)
  }catch (err){
    res.status(401).json({msg: "Invalid token."})
  }
})


//===========================
// UPDATE USER PROFILE
//===========================
router.put('/profile', async(req, res)=> {
  const token = req.cookies.token;
  if (!token) return res.status(401).json({msg: "Authentication token not found."});
  try{
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    //fields to be destructured
    const {username, school, grade, section} = req.body;

    const user = await User.findById(decoded.user.id);
    if (!user) return res.status(404).json({msg: "User not Found."});

    //to update if they are requested
    if(username) user.username = username;
    if(school) user.school = school;
    if(grade) user.grade = grade;
    if(section) user.section = section;

    const updatedUser = await user.save();

    //creating user object to respond
    const userToReturn = updatedUser.toObject();
    delete userToReturn.password;

    res.json(userToReturn);
      }catch (err){
        res.status(500).json({msg: "Server error during profile update."})
      }

})


//===========================
// GET CURRENT USER
//===========================
router.get("/me", async (req, res) => {
  const token = req.cookies.token;
  if (!token) return res.status(401).json({ loggedIn: false });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.user.id).select("username role");
    if (!user) return res.status(404).json({ loggedIn: false });

    return res.json({ loggedIn: true, user });
  } catch (err) {
    console.error("Error in /me:", err.message);
    return res.status(401).json({ loggedIn: false });
  }
});

//==========================
// SAVE SCORE
//==========================

router.put("/score", async (req, res) => {
  const token = req.cookies.token;
  if (!token) return res.status(401).json({ msg: "Not logged in" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    //quizId to be sent from frontend
    const { quizId, subject, difficulty, score } = req.body;
    if(!quizId || !subject || score === undefined){
      return res.status(400).json({msg: "Incomplete score data provided"})
    }

    const user = await User.findById(decoded.user.id);

    if (!user) return res.status(404).json({ msg: "User not found" });

    //cheching if score is aready exists
    const existingScore = user.scores && user.scores.find((scoreEntry)=> scoreEntry.quizId.toString() === quizId)
      
    //if score doesn't exist. new score added
    if(!existingScore){
      user.scores.push({quizId, subject, difficulty, score})
      await user.save();
      res.json({msg: "Score for your fist attempt has been saved!", scores: user.scores})
    }else{
      //if score exist, inform the user
      res.status(200).json({msg: "You have already completed this quiz. Only your first score is saved.", scores: user.scores})
    }
  }catch(error){
      console.error("Error saving score:", error)
      res.status(500).json({msg: "Server error while saving score."})
    }
    
});

module.exports = router;

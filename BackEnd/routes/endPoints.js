const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const router = express.Router();

const UserOTPVerification = require("../models/UserOTPVerification");
const nodemailer = require("nodemailer");

const { loginLimiter, signUpLimiter } = require("../middlewares/rate_limiter");

// Nodemailer setup => to enable us to send emails

let transporter = nodemailer.createTransport({
  host: "alemayehubethelhem12@gmail.com",
  auth: {
    user: process.env.AUTH_EMAIL, //=
    pass: process.env.AUTH_PASS, //=
  },
});

// ==================
// REGISTRTION ROUTE
//===================

router.post("/signup", signUpLimiter, async (req, res) => {
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
      role,
      verified: false,
    });

    // ✅ Save and get the saved user
    const savedUser = await user.save();

    // ✅ Send OTP after saving
    sendOTPVerificationEmail(savedUser, res);

    res.status(201).json({
      msg: "User registered successfully",
      success: true,
    });
  } catch (err) {
    console.log(err);
    res.status(500).send("Server Error");
  }
});

//======================
// OTP VERIFICATION
//======================

// Requesting for an OTP Verification email

const sendOTPVerificationEmail = async ({ _id, email }, res) => {
  try {
    const otp = `${Math.floor(1000 + Math.random() * 9000)}`;

    // mail options
    const mailOptions = {
      from: process.env.AUTH_EMAIL,
      to: email,
      subject: "Verify your Email",
      html: `<p>Enter <b>${otp}</b> in the app to verify your email address and complete the sign up p><p>This code <b>expires in 1 hour</b>.</p>`,
    };

    // hash the otp
    const saltRounds = 10;
    const hashedOtp = await bcrypt.hash(otp, saltRounds);

    // await and store to newOTPVerification variable
    const newOTPVerification = await new UserOTPVerification({
      userId: _id,
      otp: hashedOtp,
      createdAt: Date.now(),
      expiresAt: Date.now() + 3600000, // 1 hour
    });

    // save otp record to the database
    await newOTPVerification.save();

    // send email
    await transporter.sendMail(mailOptions);

    res.json({
      status: "PENDING",
      message: "Verification otp email sent",
      data: {
        userId: _id,
        email,
      },
    });
  } catch (error) {
    res.json({
      status: "FAILED",
      message: error.message,
    });
  }
};

//verify otp email//
router.post("/verifyOTP", async (req, res) => {
  try {
    let { userId, otp } = req.body;
    if (!userId || !otp) {
      throw Error("Empty otp details are not allowed");
    } else {
      const UserOTPVerificationRecords = await UserOTPVerification.find({
        userId,
      });
      if (UserOTPVerificationRecords.length <= 0) {
        throw new Error(
          "Account record doesn't exist or has been verified already. Please sign up or login."
        );
      } else {
        const { expiresAt } = UserOTPVerificationRecords[0];
        const hashedOTP = UserOTPVerificationRecords[0].otp;

        if (expiresAt < Date.now()) {
          await UserOTPVerification.deleteMany({ userId });
          throw new Error("Code has expired. Please request again.");
        } else {
          const validOTP = await bcrypt.compare(otp, hashedOTP);

          if (!validOTP) {
            throw new Error("Invalid code passed. Check your inbox.");
          } else {
            await UserOTPVerification.updateOne(
              { _id: userId },
              { verified: true }
            );
            await UserOTPVerification.deleteMany({ userId });
            res.json({
              status: "VERIFIED",
              message: "User email verified successfully",
            });
          }
        }
      }
    }
  } catch (error) {
    res.json({
      status: "FAILED",
      message: error.message,
    });
  }
});

// resend verification => if the the code expires and wanna request another one.
router.post("/resendVerification", async (req, res) => {
  try {
    let { userId, email } = req.body;

    if (!userId || !email) {
      throw new Error("Empty user details are not allowed");
    } else {
      await UserOTPVerification.deleteMany({ userId });
      sendOTPVerificationEmail({ _id: userId, email }, res);
    }
  } catch (error) {
    res.json({
      status: "FAILED",
      message: error.message,
    });
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
      return res
        .status(400)
        .json({ msg: "Invalid credentials: User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res
        .status(400)
        .json({ msg: "Invalid credentials: Incorrect password" });

    const payload = { user: { id: user.id } };

    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

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
    console.log(user);

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

router.put("/score", async (req, res) => {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({ msg: "not loged in or user does not exist" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const { subject, difficulty, score } = req.body;
    const user = user.findById(decoded.user.id);

    if (!user) {
      res.status(404).json({ msg: "user not found" });
    }

    user.score.push({ subject, difficulty, score });

    await user.save();

    res.json({ msg: "Score added successfully", scores: user.scores });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "unknow error" });
  }
});

module.exports = router;

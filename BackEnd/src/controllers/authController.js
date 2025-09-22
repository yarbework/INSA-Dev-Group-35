const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

exports.signup = async (req, res) => {
  try {
    const { username, email, password, role } = req.body;
    if (!username || !email || !password || !role)
      return res.status(400).json({ msg: "All fields are required" });

    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ msg: "User already exists with this email" });

    const hashedPassword = await bcrypt.hash(password, 10);

    user = new User({ username, email, password: hashedPassword, role });
    await user.save();

    res.status(201).json({ msg: "User registered successfully", success: true });
  } catch (err) {
    res.status(500).send("Server Error");
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || !password) return res.status(400).json({ msg: "Invalid credentials" });


    if (!user.password) return res.status(400).json({ msg: "Login not allowed via password for OAuth accounts" });

    const isMatch = await bcrypt.compare(password, user.password || "");
    if (!isMatch) return res.status(400).json({ msg: "Invalid credentials" });

    const payload = { user: { id: user.id, role: user.role } };

    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "1h" });

    res.cookie("token", token, { httpOnly: true, secure: false, sameSite: "lax", maxAge: 60*60*1000 }); //remind me to set secure to true in production
    res.json({ msg: "Login successful", success: true });
  } catch (err) {
    res.status(500).send("Server Error");
  }
};


exports.googleCallback = async (req, res) => {
  res.cookie("token", req.user.token, {
    httpOnly: true,
    secure: false,
    sameSite: "lax",
    maxAge: 60 * 60 * 1000,
  });
  res.redirect("http://localhost:5173"); // redirect to the front end
}

exports.googleFailure = async (req, res) => {
  res.send("Failed to authenticate with Google.");
}


exports.logout = (req, res) => {
  res.clearCookie("token");
  res.json({ msg: "Logged out successfully" });
};




exports.getProfile = async (req, res) => {
  try {
    const token = req.cookies.token;
    if (!token) return res.status(401).json({ msg: "No token, unauthorized" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.user.id).select("-password");

    if (!user) return res.status(404).json({ msg: "User not found" });
    res.json(user);
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
};



exports.updateProfile = async (req, res) => {
  try {
    const token = req.cookies.token;
    if (!token) return res.status(401).json({ msg: "No token, unauthorized" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.user.id);

    if (!user) return res.status(404).json({ msg: "User not found" });

    const { username, school, grade, section, profilePicture } = req.body;

    if (username) user.username = username;
    if (school) user.school = school;
    if (grade) user.grade = grade;
    if (section) user.section = section;
    if (profilePicture) user.profilePicture = profilePicture;

    await user.save();
    res.json({ msg: "Profile updated successfully", user });
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
};


const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const User = require("../models/User");
const redisClient = require("../config/redis");

// Signup
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

        // 🔹 Invalidate cache after signup
        await redisClient.flushAll();

        res.status(201).json({ msg: "User registered successfully", success: true });
    } catch (err) {
        console.error("Signup error:", err);
        res.status(500).json({ msg: "Server Error", error: err.message });
    }
};

// Login
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) return res.status(400).json({ msg: "Email and password required" });

        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ msg: "Invalid credentials" });
        if (!user.password) return res.status(400).json({ msg: "Login not allowed via password for OAuth accounts" });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ msg: "Invalid credentials" });

        // Short-lived access token
        const payload = { user: { id: user.id, role: user.role } };
        const accessToken = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "15m" });

        // Long-lived refresh token
        const refreshToken = crypto.randomBytes(40).toString("hex");
        user.refreshToken = refreshToken;
        await user.save();

        // Send cookies
        res.cookie("accessToken", accessToken, {
            httpOnly: true,
            secure: false,
            sameSite: "lax",
            maxAge: 15 * 60 * 1000
        });

        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: false,
            sameSite: "lax",
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
        });

        res.json({ msg: "Login successful", success: true });
    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: "Server Error" });
    }
};


// Google OAuth
exports.googleCallback = async (req, res) => {
    res.cookie("token", req.user.token, {
        httpOnly: true,
        secure: false,
        sameSite: "lax",
        maxAge: 60 * 60 * 1000,
    });
    res.redirect("http://localhost:5173");
};

exports.googleFailure = async (req, res) => {
    res.send("Failed to authenticate with Google.");
};

// Logout
exports.logout = async (req, res) => {
    try {
        const refreshToken = req.cookies.refreshToken;
        if (refreshToken) {
            const user = await User.findOne({ refreshToken });
            if (user) {
                user.refreshToken = null;
                await user.save();
            }
        }

        res.clearCookie("accessToken");
        res.clearCookie("refreshToken");

        res.json({ msg: "Logged out successfully" });
    } catch (err) {
        res.status(500).json({ msg: "Server error", error: err.message });
    }
};


// Get profile
exports.getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select("-password");
        if (!user) return res.status(404).json({ msg: "User not found" });
        res.json(user);
    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: "Server error" });
    }
};

// Update profile
exports.updateProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user) return res.status(404).json({ msg: "User not found" });

        const { username, school, grade, section, profilePicture } = req.body;
        if (username) user.username = username;
        if (school) user.school = school;
        if (grade) user.grade = grade;
        if (section) user.section = section;
        if (profilePicture) user.profilePicture = profilePicture;

        await user.save();

        // 🔹 Invalidate cache after profile update
        await redisClient.flushAll();

        res.json({ msg: "Profile updated successfully", user });
    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: "Server error" });
    }
};


// =========================
// CHANGE PASSWORD - POST /api/auth/change-password
// =========================
exports.changePassword = async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;
        const user = await User.findById(req.user.id);
        if (!user) return res.status(404).json({ msg: "User not found" });

        const isMatch = await bcrypt.compare(currentPassword, user.password);
        if (!isMatch) return res.status(400).json({ msg: "Current password incorrect" });

        user.password = await bcrypt.hash(newPassword, 10);
        await user.save();
        await redisClient.flushAll();

        res.json({ msg: "Password changed successfully" });
    } catch (err) {
        res.status(500).json({ msg: "Server error", error: err.message });
    }
};

// =========================
// FORGOT PASSWORD - POST /api/auth/forgot-password
// =========================
exports.forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ msg: "User not found" });

        const resetToken = crypto.randomBytes(20).toString("hex");
        user.resetPasswordToken = resetToken;
        user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
        await user.save();

        // TODO: send resetToken via email
        res.json({ msg: "Password reset token generated", resetToken });
    } catch (err) {
        res.status(500).json({ msg: "Server error", error: err.message });
    }
};

// =========================
// RESET PASSWORD - POST /api/auth/reset-password/:token
// =========================
exports.resetPassword = async (req, res) => {
    try {
        const user = await User.findOne({
            resetPasswordToken: req.params.token,
            resetPasswordExpires: { $gt: Date.now() },
        });
        if (!user) return res.status(400).json({ msg: "Invalid or expired token" });

        user.password = await bcrypt.hash(req.body.newPassword, 10);
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;
        await user.save();

        res.json({ msg: "Password reset successful" });
    } catch (err) {
        res.status(500).json({ msg: "Server error", error: err.message });
    }
};

// =========================
// REFRESH TOKEN - POST /api/auth/refresh
// =========================
exports.refreshToken = async (req, res) => {
    try {
        const refreshToken = req.cookies.refreshToken;
        if (!refreshToken) return res.status(401).json({ msg: "No refresh token provided" });

        const user = await User.findOne({ refreshToken });
        if (!user) return res.status(403).json({ msg: "Invalid refresh token" });

        // Create new access token
        const payload = { user: { id: user.id, role: user.role } };
        const newAccessToken = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "15m" });

        res.cookie("accessToken", newAccessToken, {
            httpOnly: true,
            secure: false,
            sameSite: "lax",
            maxAge: 15 * 60 * 1000
        });

        res.json({ msg: "Access token refreshed", success: true });
    } catch (err) {
        res.status(500).json({ msg: "Server error", error: err.message });
    }
};


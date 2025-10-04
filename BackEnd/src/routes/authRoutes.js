const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const { loginLimiter, signUpLimiter } = require("../middlewares/rateLimiter");
const passport = require("passport");
const {requireLogin } = require("../middlewares/authMiddleware");

// Auth routes
router.post("/signup", signUpLimiter, authController.signup);
router.post("/login", loginLimiter, authController.login);
router.post("/logout", requireLogin, authController.logout);

// Profile
router.get("/profile", requireLogin, authController.getProfile);
router.put("/profile", requireLogin, authController.updateProfile);

// Google OAuth
router.get("/google", passport.authenticate("google", { scope: ["email", "profile"] }));
router.get(
    "/google/callback",
    passport.authenticate("google", { failureRedirect: "/auth/google/failure", session: false }),
    authController.googleCallback
);
router.get("/google/failure", authController.googleFailure);

// Password management
router.post("/change-password", requireLogin, authController.changePassword);
router.post("/forgot-password", authController.forgotPassword);
router.post("/reset-password/:token", authController.resetPassword);

// Refresh token
router.post("/refresh", authController.refreshToken);


module.exports = router;

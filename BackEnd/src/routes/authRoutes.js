const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const { loginLimiter, signUpLimiter } = require("../middlewares/rateLimiter");
const passport = require("passport");

router.post("/signup", signUpLimiter, authController.signup);
router.post("/login", loginLimiter, authController.login);
router.post("/logout", authController.logout);
router.get("/profile", authController.getProfile);
router.put("/profile", authController.updateProfile);
router.get("/google", passport.authenticate("google", { scope: ["email", "profile"] }));
router.get("/google/callback", passport.authenticate("google", { failureRedirect: "/auth/google/failure", session: false }), authController.googleCallback)
router.get("/google/failure", authController.googleFailure)



module.exports = router;

const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const { loginLimiter, signUpLimiter } = require("../middlewares/rateLimiter");

router.post("/signup", signUpLimiter, authController.signup);
router.post("/login", loginLimiter, authController.login);
router.post("/logout", authController.logout);
router.get("/profile", authController.getProfile);
router.put("/profile", authController.updateProfile);



module.exports = router;

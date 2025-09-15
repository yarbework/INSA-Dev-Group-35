const rateLimit = require("express-rate-limit");

exports.loginLimiter = rateLimit({
  windowMs: 5*60*1000,
  limit: 5,
  statusCode: 429,
  message: { message: "Too many login attempts, please try again later" }
});

exports.signUpLimiter = rateLimit({
  windowMs: 5*60*1000,
  limit: 10,
  statusCode: 429,
  message: { message: "Too many sign-up attempts, please try again later" }
});

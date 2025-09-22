require("dotenv").config();
const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth2").Strategy;
const User = require("./models/User");
const jwt = require("jsonwebtoken");

passport.use(
  new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "http://localhost:4000/auth/google/callback",
    passReqToCallback: true
  },
  async function (request, accessToken, refreshToken, profile, done) {
    try {
      let user = await User.findOne({ email: profile.email });

      // If user doesn't exist, create it
      if (!user) {
        user = new User({
          username: profile.displayName,
          email: profile.email,
          password: null, // OAuth users don't need password
          role: "Student"
        });
        await user.save();
      }

      // Create JWT token
        user.token = jwt.sign({user: {id: user._id}}, process.env.JWT_SECRET, {expiresIn: "1h"});

      return done(null, user);
    } catch (err) {
      return done(err, null);
    }
  })
);

passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((user, done) => done(null, user));

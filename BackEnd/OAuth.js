require("dotenv").config();
const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth2").Strategy;
const User = require("./models/User"); // adjust path
const jwt = require("jsonwebtoken");

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "http://localhost:4000/auth/google/callback",
      passReqToCallback: true,
    },
    async function (request, accessToken, refreshToken, profile, done) {
      try {
        // 1. Find user by Google email
        let user = await User.findOne({ email: profile.email });

        // 2. If user doesn't exist, create new user
        if (!user) {
          user = new User({
            username: profile.displayName,
            email: profile.email,
            password: null, // no password for Google login
            role: "Student",
          });
          await user.save();
        }

        // 3. Generate JWT token
        const token = jwt.sign(
          { user: { id: user._id } },
          process.env.JWT_SECRET,
          { expiresIn: "1h" }
        );

        // 4. Attach token to user object
        user.token = token;

        return done(null, user);
      } catch (err) {
        return done(err, null);
      }
    }
  )
);

passport.serializeUser(function (user, done) {
  done(null, user); // store in session
});

passport.deserializeUser(function (user, done) {
  done(null, user); // retrieve from session
});

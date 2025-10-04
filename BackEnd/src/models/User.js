const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: String,
  role: { 
    type: String, 
    enum: ["Student", "Instructor"], 
    default: "Student",
    required: true 
  },
  
  // Student specific fields
  school: String,
  grade: String,
  section: String,
  profilePicture: String,
  
  // OAuth fields
  googleId: String,
  refreshToken: String,
  
  // Password reset
  resetPasswordToken: String,
  resetPasswordExpires: Date,
  
  // Quiz scores and performance tracking
  scores: {
    type: Map,
    of: {
      score: Number,
      total: Number,
      timestamp: Date,
      AiReview: String
    }
  }
}, { timestamps: true });

module.exports = mongoose.model("User", UserSchema);
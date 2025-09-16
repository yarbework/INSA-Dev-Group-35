const jwt = require("jsonwebtoken");

function authorizeRoles(...allowedRoles) {
  return (req, res, next) => {
    const token = req.cookies.token;
    if (!token) {
      return res.status(401).json({ msg: "No token, authorization denied" });
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const userRole = decoded.user.role;

      if (!allowedRoles.includes(userRole)) {
        return res.status(403).json({ msg: "Access denied: insufficient permissions" });
      }

      req.user = decoded.user;
      next();
    } catch (err) {
      console.error("JWT error:", err.message);
      res.status(401).json({ msg: "Invalid token" });
    }
  };
}

function requireLogin(req, res){
    const token = req.cookies.token;

    if (!token){
        return res.status(401).json({msg: "Not authenticated. Please log in."})
    }

}

module.exports = { authorizeRoles, requireLogin };

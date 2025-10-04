const jwt = require("jsonwebtoken");
const User = require("../models/User");

function authorizeRoles(...allowedRoles) {
    return (req, res, next) => {
        const token = req.cookies.accessToken;
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
            return res.status(401).json({ msg: "Invalid or expired token" });
        }
    };
}

function requireLogin(req, res, next) {
    const token = req.cookies.accessToken;

    if (!token) {
        return res.status(401).json({ msg: "Not authenticated. Please log in." });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        req.user = { id: decoded.user.id, role: decoded.user.role };
        next();
    } catch (err) {
        console.error("JWT error:", err.message);
        return res.status(401).json({ msg: "Invalid or expired token" });
    }
}

module.exports = { authorizeRoles, requireLogin };

const jwt = require("jsonwebtoken");
const authMiddleware = (req, res, next) => {
    try {
        const token = req.cookies.authToken;
        if (!token) {
            return res.status(401).json({
                success: false,
                message: "Not authenticated. Please login.",
            });
        }
        // 3. Verify JWT
        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET
        );
        req.user = decoded;
        next();
    } catch (error) {
        console.log("Auth middleware error:", error.message);
        return res.status(401).json({
            success: false,
            message: "Invalid or expired authentication token.",
        });
    }
};
module.exports = authMiddleware;
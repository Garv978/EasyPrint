const ownerMiddleware = (req, res, next) => {
    if (req.user.role !== "owner") {
        return res.status(403).json({
            success: false,
            message: "Access denied",
        });
    }

    next();
};

module.exports = ownerMiddleware;
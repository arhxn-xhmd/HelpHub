const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
    const authHeaders = req.headers.authorization;
    const data = req.body;
    const file = req.file;

    if (!authHeaders) {
        return res.status(401).json({ message: "No token" });
    }

    if (!authHeaders.startsWith("Bearer ")) {
        return res.status(401).json({ message: "Invalid token format" });
    }

    const token = authHeaders.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.userId;

    req.id = userId;
    next();
};

module.exports = authMiddleware;

const jwt = require('jsonwebtoken');

const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: "No token provided" });
    }
    jwt.verify(token, process.env.TOKEN_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({ message: "Invalid token" });
        }
        req.user = user;
        next();
    });
};
const authenticateAPI = (req, res, next) => {
    const apiKey = req.header('X-API-Key');
    if (apiKey === '123456789') {
        next();
    } else {
        res.status(401).json({ message: "Unauthorized" });
    }
};

module.exports = { authenticateAPI,authenticateToken };


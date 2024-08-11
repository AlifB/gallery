require('dotenv').config();
const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
    if (req.cookies.token) {
        try {
            const decoded = jwt.verify(req.cookies.token, process.env.JWT_SECRET);
            if (decoded.username === process.env.ADMIN_USERNAME) {
                return next();
            }
        } catch (error) {
            console.error("Error verifying JWT:", error);
        }
    }
    return res.redirect('/login');
};

module.exports = authMiddleware;
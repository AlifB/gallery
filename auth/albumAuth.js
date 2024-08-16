const jwt = require('jsonwebtoken');

const albumAuth = async (req, res, next) => {
    const albumId = req.params.albumId;

    if (req.cookies[albumId]) {
        const decoded = jwt.verify(req.cookies[albumId], process.env.JWT_SECRET);
        if (decoded.albumId === albumId) {
            res.locals.albumAuth = true;
        }
    }

    return next();
}

module.exports = albumAuth;
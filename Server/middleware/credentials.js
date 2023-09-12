const safeOrigins = require('../config/safeOrigins');

const credentials = (req, res, next) => {
    const origin = req.headers.origin;
    if (safeOrigins.includes(origin)) {
        res.header('Access-Control-Allow-Credentials', true);
    }
    next();
}

module.exports = credentials
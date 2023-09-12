// Handles verification of JWT Tokens

const jwt = require('jsonwebtoken');
require('dotenv').config();

const verifyJWT = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    if (!authHeader) return res.sendStatus(401);
    const token = authHeader.split(' ')[1]; // Split auth header and get the token
    jwt.verify(
        token,
        process.env.ACCESS_TOKEN_SECRET,
        (err, decoded) => {
            if (err) return res.sendStatus(403); // At this point we know we recieved a token, but something may have been tampered with --> Forbidden access response
            req.user = decoded.username;
            next();
        }
    );
}

module.exports = verifyJWT
var ProductController = require('../controllers/product');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const handleRefreshToken = async (req, res) => {
    const controller = new ProductController(res.locals.dburi,'users');
    const cookies = req.cookies;
    if (!cookies?.jwt) return res.status(401).json({ message: 'Unauthorized' }); 
    const refreshToken = cookies.jwt;
    const foundUser = await controller.getDataToken(refreshToken);
    console.log(foundUser)
    if (!foundUser) return res.status(401).json({ message: 'Unauthorized' }); 
    
    // evaluate jwt 
    jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET,
        (err, decoded) => {
            console.log(decoded)
            if (err || foundUser.username !== decoded.username) return res.status(401).json({ message: 'Forbidden' }); 
            const roles = Object.values(foundUser.roles);
            const accessToken = jwt.sign(
                { "UserInfo": {
                    "username": decoded.username,
                    "roles": roles
                    }
                },
                process.env.ACCESS_TOKEN_SECRET,
                { expiresIn: '30s' }
            );
            res.json({ accessToken })
        }
    );
}

module.exports = { handleRefreshToken }

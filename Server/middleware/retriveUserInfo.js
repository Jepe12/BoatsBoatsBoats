var ProductController = require('../controllers/product');

const retriveUserInfo = async (req, res, next) => {
    
    const controller = new ProductController(res.locals.dburi,'users');

    const cookies = req.cookies;

    // If we dont have a cookie & a refreshToken --> Do nothing
    if (!cookies?.jwt) {
        return next();
    }
    const refreshToken = cookies.jwt;

    // If we do have a refresh token passed --> Check if token in DB
    const foundUser = await controller.getDataToken(refreshToken);

    // If we cant find user --> Also Do nothing (its fine for unlogged user to access this page)
    if (!foundUser) {
        return next();
    }

    // If we do have a user with valid Refresh token in DB (They are logged in) --> Add userInfo to res
    res.locals.userData = {
        username: foundUser.username,
        roles: foundUser.roles
    };

    next();
}

module.exports = retriveUserInfo 
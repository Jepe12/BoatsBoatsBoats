var ProductController = require('../controllers/product');


const handleLogout = async (req, res) => {
    // When Logout button clocked on client also delete the AccessToken in memory of client application (Unsure how to do this just yet)
    
    const cookies = req.cookies;
    const controller = new ProductController(res.locals.dburi,'users');
    // If we dont have a cookie or a jwt --> Send req anyway as we want to logout
    if (!cookies?.jwt) return res.sendStatus(204); // Successful request & not sending any content
    const refreshToken = cookies.jwt;

    // Is request token in DB
    const foundUser = await controller.getDataToken(refreshToken);
    
    // If we cant find user 
    if (!foundUser) {
        res.clearCookie( 'jwt', { httpOnly: true, sameSite: 'None', /*secure: true*/ })// Setting "secure: true" in cookie will mean it only can be sent via https! Mess up testing etc
        return res.sendStatus(204); 
    }
    
    // Delete the refreshToken in the DB 
    await controller.deleteToken(foundUser.username);
    
    res.clearCookie('jwt', { httpOnly: true, sameSite: 'None', /*secure: true*/ }) // To make sure this only occurs via https: Set secure: true - Only serves on https
    res.sendStatus(204);// Setting "secure: true" in cookie will mean it only can be sent via https! Mess up testing etc
}

module.exports = { handleLogout }

const ProductController = require('../controllers/product');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();

let controller = null; // Declare controller variable at a higher scope

const handleGoogleRegister = async (req, res) => {
    controller = new ProductController(res.locals.dburi, 'users');
    const email = req.user.email;
    const hashedPwd = await bcrypt.hash("GOOGLE", 10);

    // If !Email --> Throw error
    if (!email) {
        return res.status(500).json({ 'message': 'Something went very wrong. Please contact the website admin.' });
    }

    // If Email --> Check if the user has an account in the DB already
    const foundUser = await controller.getDataUser(email);

    // If User already in DB --> Authenticate GoogleUser
    if (foundUser) {
        // Authenticate
        console.log("USER EXISTS");

        const loginData = {
            user: email,
            pwd: "GOOGLE"
        };

        // Call handleLogin and let it perform the redirection
        await handleLogin({ body: loginData }, res);
    }

    // If user not in DB --> Register & Authenticate GoogleUser
    if (!foundUser) {
        // Register
        try {
            const newUser = {
                'username': email,
                'roles': { "User": 7777 },
                'password': hashedPwd,
                'refreshToken': ""
            };

            await controller.insertData(newUser);

            console.log("Success, registered to DB");
        } catch (err) {
            res.status(500).json({ 'message': err.message });
        }

        // Authenticate
        const loginData = {
            user: email,
            pwd: "GOOGLE"
        };

        // Call handleLogin and let it perform the redirection
        await handleLogin({ body: loginData }, res);
    }
}


const handleLogin = async (req, res) => {
    const { user, pwd } = req.body;

    // If we don't get both a username & password --> Send a bad request response with a message
    if (!user || !pwd) return res.status(400).json({ 'message': 'Valid email and password required.' });

    // Try to find the username in DB
    const foundUser = await controller.getDataUser(user); // Use the 'controller' variable

    // If we can't find it --> Unauthorized
    if (!foundUser) return res.status(401).json({ 'message': 'Authentication failed. Please provide valid credentials to access this webpage.' });

    // Evaluate Password
    const match = await bcrypt.compare(pwd, foundUser.password);
    if (match) {
        const roles = Object.values(foundUser.roles);
        // Create JWT Normal & Refresh
        const accessToken = jwt.sign(
            { "UserInfo": { "username": foundUser.username, "roles": roles } },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: '59s' }
        );
        const refreshToken = jwt.sign(
            { "username": foundUser.username },
            process.env.REFRESH_TOKEN_SECRET,
            { expiresIn: '1d' }
        );

        // Update the user's refreshToken in the database
        await controller.updateRefreshToken(foundUser.username, refreshToken);

        // Redirect with the access token as a query 
        res.cookie('jwt', refreshToken, { httpOnly: true, sameSite: 'None', secure: true, maxAge: 24 * 60 * 60 * 1000}); 
        
        res.redirect(`/?accessToken=${accessToken}`);
    } else {
        res.status(401).json({ 'message': 'Authentication failed. Invalid password.' });
    }
};


module.exports = { handleGoogleRegister };


const usersDB = {
    users: require('../models/users.json'), //This should be retriving users from mongo (Currently using usersTESTjson to mock)
    setUsers: function (data) {this.users = data}
}


const jwt = require('jsonwebtoken');
require('dotenv').config();



const handleRefreshToken = (req, res) => {
    const cookies = req.cookies
    // If we have cookies --> Then check if we have jwt
    if (!cookies?.jwt) return res.sendStatus(401);
    console.log(cookies.jwt);
    const refreshToken = cookies.jwt;



    // Try to find username in DB who has the same refreshToken as the one passed
    const foundUser = usersDB.users.find(person => person.refreshToken === refreshToken);
    
    // If we cant find it --> Unauthorised
    if (!foundUser) return res.sendStatus(403); // No user with appropriate referesh token --> Send Forbidden status 

    // Evaluate JWT
    jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET,
        (err, decoded) => {
            if (err || foundUser.username !== decoded.username) return res.sendStatus(403);// Handle potential tampering of username --> Double check its the same user, as token should have username
            const accessToken = jwt.sign(
                { "username": decoded.username },
                process.env.ACCESS_TOKEN_SECRET,
                { expiresIn: '30s'}
            );
            res.json({ accessToken })
        }
    );
}

module.exports = { handleRefreshToken }

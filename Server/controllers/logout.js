const usersDB = {
    users: require('../models/users.json'), //This should be retriving users from mongo (Currently using usersTESTjson to mock)
    setUsers: function (data) {this.users = data}
}

const fsPromises = require('fs').promises;
const path = require('path');


const handleLogout = async (req, res) => {
    // When Logout button clocked on client also delete the AccessToken in memory of client application (Unsure how to do this just yet)
    
    const cookies = req.cookies;

    // If we dont have a cookie or a jwt --> Send req anyway as we want to logout
    if (!cookies?.jwt) return res.sendStatus(204); // Successful request & not sending any content
    const refreshToken = cookies.jwt;

    // Is request token in DB
    const foundUser = usersDB.users.find(person => person.refreshToken === refreshToken);
    
    // If we cant find user 
    if (!foundUser) {
        res.clearCookie( 'jwt', { httpOnly: true, sameSite: 'None', secure: true })// Setting "secure: true" in cookie will mean it only can be sent via https! Mess up testing etc
        return res.sendStatus(204); 
    }
    
    // Delete the refreshToken in the DB 
    const otherUsers = usersDB.users.filter(person => person.refreshToken !== foundUser.refreshToken);
    const currentUser = {...foundUser, refreshToken: ''}; // Blank the token
    usersDB.setUsers([...otherUsers, currentUser]); 
    await fsPromises.writeFile(
        path.join(__dirname, '..', 'models', 'users.json'),
        JSON.stringify(usersDB.users)
    );

    res.clearCookie('jwt', { httpOnly: true, sameSite: 'None', secure: true  }) // To make sure this only occurs via https: Set secure: true - Only serves on https
    res.sendStatus(204);// Setting "secure: true" in cookie will mean it only can be sent via https! Mess up testing etc
}

module.exports = { handleLogout }

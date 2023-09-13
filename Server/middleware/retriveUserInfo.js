const usersDB = {
    users: require('../models/users.json'), //This should be retriving users from mongo (Currently using usersTESTjson to mock)
    setUsers: function (data) {this.users = data}
}

const fsPromises = require('fs').promises;
const path = require('path');


const retriveUserInfo = async (req, res) => {
    
    const cookies = req.cookies;

    // If we dont have a cookie and a refreshToken --> Send 204 with no info --> Not Logged in
    if (!cookies?.jwt) return res.sendStatus(204); // Successful request & not sending any content
    const refreshToken = cookies.jwt;

    // If we do have a refresh token passed --> Check if token in DB
    const foundUser = usersDB.users.find(person => person.refreshToken === refreshToken);
    
    // If we cant find user --> Also send a blank response with no info --> Fine for unlogged user to access this page
    if (!foundUser) {
        return res.sendStatus(204); 
    }
    
    // If we do have a user with valid Refresh token in DB (They are logged in) --> Return their username 
    return res.status(200).json({ username: foundUser.username});
    
}

module.exports = retriveUserInfo 
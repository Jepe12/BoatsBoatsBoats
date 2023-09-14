const usersDB = {
    users: require('../models/users.json'), //This should be retriving users from mongo (Currently using usersTESTjson to mock)
    setUsers: function (data) { this.users = data }
}

const fsPromises = require('fs').promises;
const path = require('path');


const retriveUserInfo = async (req, res, next) => {

    const cookies = req.cookies;

    // If we dont have a cookie & a refreshToken --> Do nothing
    if (!cookies?.jwt) {
        return next();
    }
    const refreshToken = cookies.jwt;

    // If we do have a refresh token passed --> Check if token in DB
    const foundUser = usersDB.users.find(person => person.refreshToken === refreshToken);

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
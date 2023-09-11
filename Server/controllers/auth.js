const usersDB = {
    users: require('../models/users.json'), //This should be retriving users from mongo (Currently using usersTESTjson to mock)
    setUsers: function (data) {this.users = data}
}

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const fsPromises = require('fs').promises;
const path = require('path');


const handleLogin = async(req, res) => {
    const { user, pwd } = req.body;
    // If we dont get both a username & password --> Send badrequest resp with msg
    if (!user || !pwd) return res.status(400).json({ 'message':'Valid email and password required.'}); 

    // Try to find username in DB
    const foundUser = usersDB.users.find(person => person.username === user);
    
    // If we cant find it --> Unauthorised
    if (!foundUser) return res.status(401).json({ 'message':'Authentication failed. Please provide valid credentials to access this webpage.'})

    // Evaluate Password
    const match = await bcrypt.compare(pwd,foundUser.password);
    if (match){
        // Create JWT Normal & Refresh
        const accessToken = jwt.sign(
            { "username": foundUser.username},
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: '30s'} // Setting access token expiry here, set short for testing, needs to be updated to something reasonable later
        );
        const refreshToken = jwt.sign(
            { "username": foundUser.username},
            process.env.REFRESH_TOKEN_SECRET,
            { expiresIn: '1d'} // Setting refesh token expiry here
        );
        
        // Saving refreshToken with the current user 
        const otherUsers = usersDB.users.filter(person => person.username !== foundUser.username);
        const currentUser = { ...foundUser,refreshToken };
        usersDB.setUsers([...otherUsers, currentUser]);
        await fsPromises.writeFile(
            path.join(__dirname, '..', 'model', 'users.json'),
            JSON.stringify(usersDB.users)
        );
        refreshToken.cookie('jwt', refreshToken, { httpOnly: true, maxAge: 24 * 60 * 60 * 1000}); // Setting the refresh token as http only prevents it from being accessed by JavaScript, lil bit heaps better security. Much more secure than storing it in local storage or anything like that. 
        res.json({ accessToken })
    } else {
        res.status(401).json({ 'message':'Authentication failed. Invalid password.'})
    }
}  

module.exports = { handleLogin }
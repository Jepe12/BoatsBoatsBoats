const usersDB = {
    users: require('../models/users.json'), //This should be retriving users from mongo (Currently using usersTESTjson to mock)
    setUsers: function (data) {this.users = data}
}
const bcrypt = require('bcrypt');

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
        // This where we would create JWT Normal & Refresh
        res.status(200).json({ 'message':`User ${user} logged in!`})
    } else {
        res.status(401).json({ 'message':'Authentication failed. Invalid password.'})
    }
}   

module.exports = { handleLogin }
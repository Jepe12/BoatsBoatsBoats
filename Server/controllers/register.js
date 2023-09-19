var ProductController = require('../controllers/product');
const bcrypt = require('bcrypt');

const handleNewUser = async (req, res) => {
    const { user, pwd } = req.body;
    const controller = new ProductController(res.locals.dburi, 'users');

    // If we dont get both a username & password --> Send badrequest resp with msg
    if (!user || !pwd) return res.status(400).json({ 'message': 'Valid email and password required.' });

    // Ensure user has entered valid email
    if (!isValidEmail(user)) {
        return res.status(409).json({ 'message': 'Invalid Email Format' })
    }

    // Check for duplicate usernames in DB
    const duplicate = await controller.getDataUser(user);
    //if(dup)
    //const duplicate = usersDB.users.find(person => person.username === user)
    if (duplicate) return res.status(409).json({ 'message': 'Email already taken.' });

    // We have a seeminly valid username & pass --> Encrypt & salt password
    try {
        const hashedPwd = await bcrypt.hash(pwd, 10);
        // Create new user & store in DB
        const newUser = {
            'username': user,
            'roles': { "User": 7777 },
            'password': hashedPwd,
            'refreshToken': ""
        };

        await controller.insertData(newUser);

        // Announce Success
        res.status(201).json({ 'Success': `New user ${user} created!` });
    } catch (err) {
        res.status(500).json({ 'message': err.message });
    }
}


function isValidEmail(email) {
    const emailRegex = /^[a-z0-9]+@[a-z]+\.[a-z]{2,3}$/;;
    return emailRegex.test(email);
}


module.exports = { handleNewUser }
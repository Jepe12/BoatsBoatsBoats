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

    // Check password strengh sufficient
    if (evaluatePasswordStrength(pwd) !== 'Password meets all criteria.'){
        return res.status(400).json({ 'message': evaluatePasswordStrength(pwd) });
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


// Func to check email validity
function isValidEmail(email) {
    const emailRegex = /^[a-z0-9]+@[a-z]+\.[a-z]{2,3}$/;;
    return emailRegex.test(email);
}


// Func to check password strength, if password too weak returns status code 
function evaluatePasswordStrength(password) {
    
    const lengthRegex = /^.{8,}$/; // At least 8 characters
    const lowercaseRegex = /[a-z]/; // At least one lowercase letter
    const uppercaseRegex = /[A-Z]/; // At least one uppercase letter
    const digitRegex = /\d/; // At least one digit
    const specialCharRegex = /[!@#\$%\^&\*\(\)_+\{\}\[\]:;<>,\.\?~\\\-=/|"'`]/;
  
    const isLengthValid = lengthRegex.test(password);
    const hasLowercase = lowercaseRegex.test(password);
    const hasUppercase = uppercaseRegex.test(password);
    const hasDigit = digitRegex.test(password);
    const hasSpecialChar = specialCharRegex.test(password);
  
    const missingCriteria = [];
  
    if (!isLengthValid) missingCriteria.push("at least 8 characters");
    if (!hasLowercase) missingCriteria.push("at least one lowercase letter");
    if (!hasUppercase) missingCriteria.push("at least one uppercase letter");
    if (!hasDigit) missingCriteria.push("at least one digit");
    if (!hasSpecialChar) missingCriteria.push("at least one special character");
  
    if (missingCriteria.length === 0) {
      return "Password meets all criteria.";
    } else {
      return `Password is missing the following criteria: ${missingCriteria.join(", ")}.`;
    }
  }
  
  
module.exports = { handleNewUser }
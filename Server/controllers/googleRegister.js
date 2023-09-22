var ProductController = require('../controllers/product');
const bcrypt = require('bcrypt');
const axios = require('axios');

const handleGoogleRegister = async (req, res) => {
    
    const controller = new ProductController(res.locals.dburi,'users');
    const email = req.user.email
    const hashedPwd = await bcrypt.hash("GOOGLE", 10);

    
    // If !Email --> Throw error 
    if (!email){
        return res.status(500).json( { 'message': 'Something went very wrong. Please contact the website admin.' } )
    }

    // If Email --> Check if user has account in DB already
    const foundUser = await controller.getDataUser(email);
    
    // If User already in DB --> Authenticate GoogleUser
    if (foundUser){
        // Authenticate
        console.log("User exists: " + foundUser)
        
    }

    // If user not in DB --> Register & Authenticate GoogleUser
    if (!foundUser){
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
        // Authenticate using axios? 
     

    }
}

module.exports = { handleGoogleRegister }

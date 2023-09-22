var ProductController = require('../controllers/product');


const handleGoogleRegister = async (req, res) => {
    
    console.log(res)
    console.log(req)

    const controller = new ProductController(res.locals.dburi,'users');
    
    
    // If !Email --> Throw error 

    // If Email --> Check if user has account in DB already

    // If !User --> Register the Google account & auth to give refresh token (Hashed & salted pass GOOGLE)

    // If User --> Auth
    

}

module.exports = { handleGoogleRegister }

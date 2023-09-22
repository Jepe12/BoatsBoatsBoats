var ProductController = require('./product');
var nodemailer = require('nodemailer');
const nodemailerSendgrid = require('nodemailer-sendgrid');
const crypto = require("crypto");
const bcrypt = require('bcrypt');

const sendResetPassword = async (req, res) => {

    if (!req.body.username) {
        req.status(400).json({ message: 'No username specified' })
        return;
    }

    // Check if email exists
    const controller = new ProductController(res.locals.dburi,'users');

    if (await controller.getDataUser(req.body.username) == null) {
        // No user by this username, however for privacy reasons we will not disclose this email has an account and will just act like it goes through
        res.status(200).json({ message: 'Success' });
        return;
    }
    var token = crypto.randomBytes(64).toString('hex');
    const time = new Date();

    const controller2 = new ProductController(res.locals.dburi,'resets');  
    
    const newReset = {
        'username': req.body.username,
        'code': token,
        'createdAt': time
    };

    await controller2.insertData(newReset);


    // Need to store final url in a config variable, then construct url
    let link = 'http://localhost:3000/reset/' + token;

    var transporter = nodemailer.createTransport(
        nodemailerSendgrid({
            apiKey: process.env.SENDGRID_API_KEY
         })
    );

    console.log("Started sending");

    transporter.sendMail({
        from: 'fyoolawfbewjtfeejn@cwmxc.com',
        to: req.body.username,
        subject: 'Password reset link',
        text: 'Link: ' + link
    }, function(error, info) {
        console.log("Done sending");
        if (error) {
            console.error("Error sending email to " + req.body.username + ". Error: " + error);
        }

        // For privacy reasons we will not disclose any errors or the existance of this account can be inferred
        res.status(200).json({ message: 'Success' });
    });
}

const setResetPassword = async (req, res) => {
    const controller = new ProductController(res.locals.dburi,'resets');
    const foundUser = await controller.getDataCode(req.params.code);
    if (!foundUser) return res.status(401).json({ message: 'Unauthorized' });  
    const controller2 = new ProductController(res.locals.dburi,'users');
    const hashedPwd = await bcrypt.hash(req.body.password, 10);
    console.log(foundUser.username);
    console.log(hashedPwd);
    const updatedUser = {
        'username': foundUser.username,
        'password': hashedPwd,
    }
    const success = await controller2.replaceData(res.locals.userData.id,updatedUser);
    if (success) {
      res.json({ message: 'success' }).status(200);
      const deleted = await controller.deleteData(foundUser._id);

    } else {
      res.json({ message: 'no record found' }).status(404);
    }

}

module.exports = { sendResetPassword,setResetPassword }

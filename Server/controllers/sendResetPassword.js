var ProductController = require('./product');
var nodemailer = require('nodemailer');
var directTransport = require('nodemailer-direct-transport');

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

    // Need to store final url in a config variable, then construct url
    let link = 'https://localhost/reset/' + 1234;

    var transporter = nodemailer.createTransport(directTransport({}));

    console.log("Started sending");

    transporter.sendMail({
        from: 'noreply@boatsboatsboats.com',
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

module.exports = { sendResetPassword }

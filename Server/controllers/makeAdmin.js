var ProductController = require('../controllers/product');

const makeAdmin = async (req, res) => {
    try {
        const currentUsername = req.body.user;
        const targetUsername = req.body.target;
        const controller = new ProductController(res.locals.dburi, 'users');

        // Double check the current user is an admin
        const currentUser = await controller.getDataUser(currentUsername);
        if (!currentUser || !currentUser.roles.Admin) { 
          return res.status(403).json({ message: 'Access denied. You need admin rights to perform this action.' });
        }
        
        // Retrieve the target user by username
        const targetUser = await controller.getDataUser(targetUsername);
        if (!targetUser) {
            return res.status(404).json({ message: 'Target user not found' });
        }
            
        // Check if the target user already has the 'admin' role
        if (targetUser.roles.Admin === 9999) {
            return res.status(400).json({ message: 'Target user is already an admin' });
        }
        
        // Update the target user's roles in the database
        const newRole = { Admin: 9999 };

        await controller.collection.updateOne(
            { username: targetUser.username },
            { $set: { 'roles.Admin': newRole.Admin } }
        );

        res.status(200).json({ message: 'Target user is now an admin' });
            
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' }); // possibly not correct error handling? 
    }
};

module.exports = { makeAdmin };


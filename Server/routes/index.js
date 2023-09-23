var express = require('express');
var router = express.Router();

// Middleware 

var ProductController = require('../controllers/product');
const verifyJWT = require('../../Server/middleware/verifyJWT');
const ROLES_LIST = require('../config/rolesList');
const verifyRoles = require('../middleware/verifyRoles');
const retrieveUserInfo = require('../middleware/retrieveUserInfo');

router.post('/product/insert', async function (req, res, next) {
  const controller = new ProductController(res.locals.dburi, 'products');
  const id = await controller.insertData(req.body)
  res.json(id).status(200);
});

router.put('/product/:id', verifyJWT, verifyRoles(ROLES_LIST.Admin), async function (req, res, next) { // Admin access required verifyRoles arg specifies which roles can access it, user will only need one to match.
  const controller = new ProductController(res.locals.dburi, 'products');
  await controller.replaceData(req.params.id, req.body)
  res.json({ message: 'success' }).status(200);
});

router.get('/product/:id', verifyJWT, verifyRoles(ROLES_LIST.Admin, ROLES_LIST.User), async function (req, res, next) { // User access only    // verifyJWT added for testing, requires auth token to access end point. verifyRole() passing in whichever role we want to be able to access this end point, method checks that client has permissions
  const controller = new ProductController(res.locals.dburi, 'products');

  const data = await controller.getData(req.params.id);
  if (data != null) {
    res.json(data).status(200);
  } else {
    res.json({ message: 'no record found' }).status(404);
  }

});

router.delete('/product/:id', async function (req, res, next) {
  const controller = new ProductController(res.locals.dburi, 'products');
  const success = await controller.deleteData(req.params.id);
  if (success) {
    res.json({ message: 'success' }).status(200);
  } else {
    res.json({ message: 'no record found' }).status(404);
  }
});


router.post('/orders/insert', retrieveUserInfo, async function (req, res, next) {
  const controller = new ProductController(res.locals.dburi, 'orders');
  req.body.userId = res.locals.userData.id;
  const id = await controller.insertData({ ...req.body, time: new Date() });
  res.json(id).status(200);
});

router.put('/orders/:id', async function (req, res, next) {
  const controller = new ProductController(res.locals.dburi, 'orders');
  await controller.replaceData(req.params.id, req.body)
  res.json({ message: 'success' }).status(200);
});

router.get('/orders/:id', async function (req, res, next) {
  const controller = new ProductController(res.locals.dburi, 'orders');
  const data = await controller.getData(req.params.id);
  if (data != null) {
    res.json(data).status(200);
  } else {
    res.json({ message: 'no record found' }).status(404);
  }
});

router.delete('/orders/:id', async function (req, res, next) {
  const controller = new ProductController(res.locals.dburi, 'orders');
  const success = await controller.deleteData(req.params.id);
  if (success) {
    res.json({ message: 'success' }).status(200);
  } else {
    res.json({ message: 'no record found' }).status(404);
  }
});


/**********************************************
 *     User Authentication & Registration     *
 **********************************************/

const registerController = require('../controllers/register');
const authController = require('../controllers/auth');
const refreshTokenController = require('../controllers/refreshToken');
const logoutController = require('../controllers/logout');
const sendResetPasswordController = require('../controllers/sendResetPassword');
const adminController = require('../controllers/makeAdmin');

router.post('/register', registerController.handleNewUser);
router.post('/auth', authController.handleLogin);
router.get('/refresh', refreshTokenController.handleRefreshToken);
router.get('/logout', logoutController.handleLogout);
router.post('/sendResetPassword', sendResetPasswordController.sendResetPassword)
router.post('/resetPassword', retrieveUserInfo,sendResetPasswordController.setResetPassword);
router.put('/admin',verifyJWT, verifyRoles(ROLES_LIST.Admin), adminController.makeAdmin);



/**********************************************
 *                   OAuth                    *
 **********************************************/
const googleRegisterController = require('../controllers/googleRegister');
const passport = require('passport');
require('../controllers/googleAPI');

// Google OAuth - Entry point to Google Auth redirect
router.get('/auth/google', passport.authenticate('google', { scope: ['email', 'profile'] }));

// Callback route
router.get('/google/callback', passport.authenticate('google', {
  successRedirect: '/auth/google/success',
  failureRedirect: '/auth/google/failure'
}));

// Handle the SUCCESS redirect route
router.get('/auth/google/success', async(req, res) => {
  await googleRegisterController.handleGoogleRegister(req, res)
});

// Handle the FAILURE redirect route
router.get('/auth/google/failure', (req, res) => {
  var message = 'Authentication failed.'
  res.redirect(`/login?message=${message}`);
});

module.exports = router;
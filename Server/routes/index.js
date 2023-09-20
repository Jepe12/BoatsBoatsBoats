var express = require('express');
var router = express.Router();

// Middleware 

var ProductController = require('../controllers/product');
const verifyJWT = require('../../Server/middleware/verifyJWT');
const ROLES_LIST = require('../config/rolesList');
const verifyRoles = require('../middleware/verifyRoles');
const retrieveUserInfo = require('../middleware/retrieveUserInfo');

router.post('/product/insert', async function(req, res, next) { 
  const controller = new ProductController(res.locals.dburi,'products');
  const id = await controller.insertData(req.body)
  res.json(id).status(200);
});

router.put('/product/:id', verifyJWT, verifyRoles(ROLES_LIST.Admin), async function(req, res, next) { // Admin access required verifyRoles arg specifies which roles can access it, user will only need one to match.
  const controller = new ProductController(res.locals.dburi,'products');
  await controller.replaceData(req.params.id, req.body)
  res.json({ message: 'success' }).status(200);
});

router.get('/product/:id', verifyJWT, verifyRoles(ROLES_LIST.Admin, ROLES_LIST.User), async function(req, res, next) { // User access only    // verifyJWT added for testing, requires auth token to access end point. verifyRole() passing in whichever role we want to be able to access this end point, method checks that client has permissions
  const controller = new ProductController(res.locals.dburi,'products');

  const data = await controller.getData(req.params.id);
  if (data != null) {
    res.json(data).status(200);
  } else {
    res.json({ message: 'no record found' }).status(404);
  }

});

router.delete('/product/:id', async function(req, res, next) {
  const controller = new ProductController(res.locals.dburi,'products');
  const success = await controller.deleteData(req.params.id);
  if (success) {
    res.json({ message: 'success' }).status(200);
  } else {
    res.json({ message: 'no record found' }).status(404);
  }
});


router.post('/orders/insert', retrieveUserInfo, async function(req, res, next) {
  const controller = new ProductController(res.locals.dburi,'orders');
  req.body.userId = res.locals.userData.id;
  const id = await controller.insertData({ ...req.body, time: new Date() });
  res.json(id).status(200);
});

router.put('/orders/:id', async function(req, res, next) {
  const controller = new ProductController(res.locals.dburi,'orders');
  await controller.replaceData(req.params.id, req.body)
  res.json({ message: 'success' }).status(200);
});

router.get('/orders/:id', async function(req, res, next) { 
  const controller = new ProductController(res.locals.dburi,'orders');
  const data = await controller.getData(req.params.id);
  if (data != null) {
    res.json(data).status(200);
  } else {
    res.json({ message: 'no record found' }).status(404);
  }
});

router.delete('/orders/:id', async function(req, res, next) {
  const controller = new ProductController(res.locals.dburi,'orders');
  const success = await controller.deleteData(req.params.id);
  if (success) {
    res.json({ message: 'success' }).status(200);
  } else {
    res.json({ message: 'no record found' }).status(404);
  }
});

// User Authentication & Registration:

const registerController = require('../controllers/register');
const authController = require('../controllers/auth');
const refreshTokenController = require('../controllers/refreshToken');
const logoutController = require('../controllers/logout');
const adminController = require('../controllers/makeAdmin');


router.post('/register', registerController.handleNewUser);
router.post('/auth', authController.handleLogin);
router.get('/refresh',refreshTokenController.handleRefreshToken);
router.get('/logout', logoutController.handleLogout);
router.put('/admin',verifyJWT, verifyRoles(ROLES_LIST.Admin), adminController.makeAdmin);

module.exports = router;

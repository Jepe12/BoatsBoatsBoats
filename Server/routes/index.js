var express = require('express');
var router = express.Router();

var ProductController = require('../controllers/product');
const verifyJWT = require('../../Server/middleware/verifyJWT');

router.post('/product/insert', async function(req, res, next) {
  const controller = new ProductController(res.locals.dburi,'products');
  await controller.insertData(req.body)
  res.json({ message: 'success' }).status(200);
});

router.put('/product/:id', async function(req, res, next) {
  const controller = new ProductController(res.locals.dburi,'products');
  await controller.replaceData(req.params.id, req.body)
  res.json({ message: 'success' }).status(200);
});

router.get('/product/:id',verifyJWT, async function(req, res, next) { // verifyJWT added for testing, requires auth token to access end point
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


router.post('/orders/insert', async function(req, res, next) {
  const controller = new ProductController(res.locals.dburi,'orders');
  await controller.insertData(req.body)
  res.json({ message: 'success' }).status(200);
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
router.post('/register', registerController.handleNewUser);

const authController = require('../controllers/auth');
router.post('/auth', authController.handleLogin);

const refreshTokenController = require('../controllers/refreshToken');
router.get('/refresh',refreshTokenController.handleRefreshToken);

const logoutController = require('../controllers/logout');
router.get('/logout', logoutController.handleLogout);

module.exports = router;

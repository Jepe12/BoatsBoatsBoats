var express = require('express');
var router = express.Router();

var jsonController = require('../controllers/json');

router.get('/json/get', function(req, res, next) {
  const controller = new jsonController();
  res.json(controller.getData()).status(200);
});

router.put('/json/set', function(req, res, next) {
  const controller = new jsonController();
  controller.setData(req.body);
  controller.save();
  res.json({ message: 'success' }).status(200);
});

var NosqlController = require('../controllers/nosql');


router.post('/nosql/insert', async function(req, res, next) {
  const controller = new NosqlController(res.locals.dburi);
  await controller.insertData(req.body)
  res.json({ message: 'success' }).status(200);
});

router.put('/nosql/:id', async function(req, res, next) {
  const controller = new NosqlController(res.locals.dburi);
  await controller.replaceData(req.params.id, req.body)
  res.json({ message: 'success' }).status(200);
});

router.get('/nosql/:id', async function(req, res, next) {
  const controller = new NosqlController(res.locals.dburi);
  const data = await controller.getData(req.params.id);
  if (data != null) {
    res.json(data).status(200);
  } else {
    res.json({ message: 'no record found' }).status(404);
  }
});

router.delete('/nosql/:id', async function(req, res, next) {
  const controller = new NosqlController(res.locals.dburi);
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



module.exports = router;

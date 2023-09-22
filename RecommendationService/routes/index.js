var express = require('express');
var router = express.Router();

router.post('/getRecommendations', function(req, res, next) {
    console.log("Got request for " + req.body.username);
    res.status(200).json([])
});

module.exports = router;

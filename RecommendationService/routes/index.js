var express = require('express');
var router = express.Router();

router.post('/getRecommendations', function(req, res, next) {
    console.log("Got request for " + req.body.username);

    

    res.status(200).json([
      {
        _id: "650baba8b9e1f8958a47bb19",
        name: 'The Lambo',
        price: '19000.54',
        description: 'Fill out description',
        imgUrl: 'invalid',
      }
    ])
});

module.exports = router;

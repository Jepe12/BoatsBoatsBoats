var express = require('express');
var router = express.Router();
const verifyJWT = require('../middleware/verifyJWT');
const sendRequest = require("../composables/sendRequest").sendRequest;

// Proxy recommendations to RecommendationService microservice, while attaching context
router.get('/recommendations', verifyJWT, async function(req, res) {

    if (res.locals.userData) {
        res.redirect(303, '/');
        return;
    }

    let result = await sendRequest(process.env.RECOMMENDATION_SERVICE_URL + '/getRecommendations', 'POST', { username: req.user });

    console.log(result)

    res.status(200).json([])
});

module.exports = router;

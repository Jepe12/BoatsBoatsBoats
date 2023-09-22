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

    let ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;

    const userData = {
        username: req.user,
        ip
    };

    try {
        let result = await sendRequest(process.env.RECOMMENDATION_SERVICE_URL + '/getRecommendations', 'POST', userData);

        const recommendations = await result.json();

        res.render("recommendations", { recommendations, layout: 'blank' })
    } catch (e) {
        console.error("Failed connecting to Recommendation microservice: " + e);
        res.status(500).json({ message: 'Internal Server Error' })
        return;
    }
});

module.exports = router;

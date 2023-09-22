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

    try {
        let result = await sendRequest(process.env.RECOMMENDATION_SERVICE_URL + '/getRecommendations', 'POST', { username: req.user });

        const recommendations = await result.json();
        console.log(recommendations

        )

        res.render("recommendations", { recommendations, layout: 'blank' })
    } catch (e) {
        console.error("Failed connecting to Recommendation microservice: " + e);
        res.status(500).json({ message: 'Internal Server Error' })
        return;
    }
});

module.exports = router;

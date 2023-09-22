var express = require('express');
var router = express.Router();
var geoip = require('geoip-lite');
const ipaddrJs = require('ipaddr.js');
const { sendRequest } = require('../../Server/composables/sendRequest');
const fs = require('fs');

// Read gdp per capita
gdpPerCapita = fs.readFileSync('./assets/gdp_per_capita_2023.csv').toString().split('\n').map((v) => v.split(',')).map((v) => [v[0], parseFloat(v[1])])

router.post('/getRecommendations', async function(req, res, next) {

    // Get data from request
    let { username, ip } = req.body;

    if (ipaddrJs.parse(ip).range() != 'public') {
      // It isn't a public ip, this is from an internal network. As we're using the same network, use our public ip
      let ipFind = await sendRequest('https://api.ipify.org', 'get');
      ip = await ipFind.text();
    }

    // Get country from ip
    let ipInfo = geoip.lookup(ip);

    let averageEarnings = gdpPerCapita.find((v) => v[0] == ipInfo.country)[1] ?? -1;

    console.log("Earnings: " + averageEarnings)

    // Fetch all products
    let products = await res.locals.dbProducts.find().toArray();

    if (averageEarnings > 35000) {
      // If high income country, then order by most expensive
      products = products.sort((p1, p2) => p2.price - p1.price)
    } else if (averageEarnings < 15000) {
      // Poor country, order by cheapest
      products = products.sort((p1, p2) => p1.price - p2.price)
    }

    res.status(200).json(products)
});

module.exports = router;

var express = require('express');
var router = express.Router();

router.get('/', function(req, res) {
    res.render("home", {
        // Todo, replace this with array of actual `Boat[]` from db
        products: [
            { name: 'The Dutchman', description: 'The best boat', price: 14.99, imgUrl: '/assets/boats/The_Flying_Dutchman27s_Ship_.png' },
            { name: 'The Dutchman', description: 'The best boat', price: 14.99, imgUrl: '/assets/boats/The_Flying_Dutchman27s_Ship_.png' },
            { name: 'The Dutchman', description: 'The best boat', price: 14.99, imgUrl: '/assets/boats/The_Flying_Dutchman27s_Ship_.png' },
            { name: 'The Dutchman', description: 'The best boat', price: 14.99, imgUrl: '/assets/boats/The_Flying_Dutchman27s_Ship_.png' },
            { name: 'The Dutchman', description: 'The best boat', price: 14.99, imgUrl: '/assets/boats/The_Flying_Dutchman27s_Ship_.png' },
            { name: 'The Dutchman', description: 'The best boat', price: 14.99, imgUrl: '/assets/boats/The_Flying_Dutchman27s_Ship_.png' },
            { name: 'The Dutchman', description: 'The best boat', price: 14.99, imgUrl: '/assets/boats/The_Flying_Dutchman27s_Ship_.png' },
            { name: 'The Dutchman', description: 'The best boat', price: 14.99, imgUrl: '/assets/boats/The_Flying_Dutchman27s_Ship_.png' },
            { name: 'The Dutchman', description: 'The best boat', price: 14.99, imgUrl: '/assets/boats/The_Flying_Dutchman27s_Ship_.png' },
            { name: 'The Dutchman', description: 'The best boat', price: 14.99, imgUrl: '/assets/boats/The_Flying_Dutchman27s_Ship_.png' },
            { name: 'The Dutchman', description: 'The best boat', price: 14.99, imgUrl: '/assets/boats/The_Flying_Dutchman27s_Ship_.png' },
            { name: 'The Dutchman', description: 'The best boat', price: 14.99, imgUrl: '/assets/boats/The_Flying_Dutchman27s_Ship_.png' },
            { name: 'The Dutchman', description: 'The best boat', price: 14.99, imgUrl: '/assets/boats/The_Flying_Dutchman27s_Ship_.png' },
        ]
    });
});

router.get('/login', function(req, res) {
    res.render("login");
});

module.exports = router;

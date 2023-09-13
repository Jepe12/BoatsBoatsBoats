var express = require('express');
var router = express.Router();

router.get('/', function(req, res) {
    res.render("home", {
        // Todo, replace this with array of actual `Boat[]` from db
        products: [
            { id: 1, name: 'The Dutchman', description: 'The best boat', price: 14.99, imgUrl: '/assets/boats/The_Dutchman.png' },
            { id: 2, name: 'The Dutchman', description: 'The best boat', price: 14.99, imgUrl: '/assets/boats/The_Dutchman.png' },
            { id: 3, name: 'The Dutchman', description: 'The best boat', price: 14.99, imgUrl: '/assets/boats/The_Dutchman.png' },
            { id: 4, name: 'The Dutchman', description: 'The best boat', price: 14.99, imgUrl: '/assets/boats/The_Dutchman.png' },
            { id: 5, name: 'The Dutchman', description: 'The best boat', price: 14.99, imgUrl: '/assets/boats/The_Dutchman.png' },
            { id: 6, name: 'The Dutchman', description: 'The best boat', price: 14.99, imgUrl: '/assets/boats/The_Dutchman.png' },
            { id: 7, name: 'The Dutchman', description: 'The best boat', price: 14.99, imgUrl: '/assets/boats/The_Dutchman.png' },
            { id: 8, name: 'The Dutchman', description: 'The best boat', price: 14.99, imgUrl: '/assets/boats/The_Dutchman.png' },
            { id: 9, name: 'The Dutchman', description: 'The best boat', price: 14.99, imgUrl: '/assets/boats/The_Dutchman.png' },
            { id: 10, name: 'The Dutchman', description: 'The best boat', price: 14.99, imgUrl: '/assets/boats/The_Dutchman.png' },
            { id: 11, name: 'The Dutchman', description: 'The best boat', price: 14.99, imgUrl: '/assets/boats/The_Dutchman.png' },
        ],
        admin: true // Decide by middleware
    });
});

router.get('/login', function(req, res) {
    res.render("login", { layout: 'basic' });
});

router.get('/register', function(req, res) {
    res.render("register", { layout: 'basic' });
});

module.exports = router;

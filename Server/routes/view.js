var express = require('express');
var router = express.Router();
var ProductController = require('../controllers/product');
const verifyJWT = require('../../Server/middleware/verifyJWT');
const ROLES_LIST = require('../config/rolesList');
const verifyRoles = require('../middleware/verifyRoles');

router.get('/', async function(req, res) {
    const controller = new ProductController(res.locals.dburi,'products');
    const product = await controller.getData(7);

    let admin = req.roles?.any(role => role == ROLES_LIST.Admin) ?? true; // TODO: Remove once req.roles loaded through middleware

    res.render("home", {
        // TODO:, replace this with array of actual `Boat[]` from db
        products: [
            product,
        ],
        admin, // TODO: Decide by authorization
        user: req.user
    });
});

router.get('/login', function(req, res) {
    res.render("login", { layout: 'basic', user: req.user });
});

router.get('/register', function(req, res) {
    res.render("register", { layout: 'basic', user: req.user });
});

router.get('/products/:productId/edit', async function(req, res) {
    // Disable caching
    res.set('Cache-Control', 'no-store');

    const controller = new ProductController(res.locals.dburi,'products');
    const product = await controller.getData(req.params.productId);
    res.render("product_edit", { product, user: req.user });
});

router.get('/products/new', async function(req, res) {
    res.render("product_edit", { creation: true, user: req.user, product: { name: "New Product", imgUrl: "/assets/boats/Add.png", description: "Fill out description", price: 14.99 } });
});

router.get('/cart', async function(req, res) {
    let cart = {};

    if (req.cookies.cart) {
        try {
            cart = JSON.parse(req.cookies.cart);
        } catch (e) {
            res.status(400).json({message: "Invalid cart contents"});
            return;
        }
    }

    const controller = new ProductController(res.locals.dburi,'products');

    // Load products
    let cartList = [];

    for (let row of Object.entries(cart)) {
        let productId = row[0], amount = row[1];

        const productInfo = await controller.getData(productId);

        cartList.push({ ...productInfo, amount });
    }

    res.render("cart", { cartList, user: req.user });
});

module.exports = router;
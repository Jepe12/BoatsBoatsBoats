var express = require('express');
var router = express.Router();
var ProductController = require('../controllers/product');
const verifyJWT = require('../../Server/middleware/verifyJWT');
const ROLES_LIST = require('../config/rolesList');
const verifyRoles = require('../middleware/verifyRoles');
const retrieveUserInfo = require('../middleware/retrieveUserInfo')

router.get('/', retrieveUserInfo, async function(req, res) {
    const controller = new ProductController(res.locals.dburi,'products');
    const products = await controller.getAllData();
    
    let admin = false;
    let user = undefined;

    if (res.locals.userData) {
        admin = Object.values(res.locals.userData?.roles).some(role => role == ROLES_LIST.Admin);
        user = res.locals.userData.username;
    }

    let cartSize = undefined;

    if (req.cookies.cart) {
        try {
            let cart = JSON.parse(req.cookies.cart);
            cartSize = Object.values(cart).map((v) => parseInt(v)).reduce((a, b) => a + b, 0);
        } catch (e) {}
    }

    res.render("home", {
        products,
        admin,
        user,
        cartSize
    });
});

router.get('/login', retrieveUserInfo, function(req, res) {

    if (res.locals.userData) {
        res.redirect(303, '/');
        return;
    }

    res.render("login", { layout: 'basic', user: res.locals.userData });
});

router.get('/register', retrieveUserInfo, function(req, res) {

    // If they already have user data, they dont need to register
    if (res.locals.userData) {
        res.redirect(303, '/');
        return;
    }

    res.render("register", { layout: 'basic', user: res.locals.userData });
});

router.get('/products/:productId/edit', retrieveUserInfo, async function(req, res) {
    // Disable caching
    res.set('Cache-Control', 'no-store');

    const controller = new ProductController(res.locals.dburi,'products');
    const product = await controller.getData(req.params.productId);
    res.render("product_edit", { product, user: res.locals.userData });
});

router.get('/products/new', retrieveUserInfo, async function(req, res) {
    res.render("product_edit", { creation: true, user: res.locals.userData, product: { name: "New Product", imgUrl: "/assets/boats/Add.png", description: "Fill out description", price: 14.99 } });
});

router.get('/privacy', retrieveUserInfo, async function(req, res) {
    res.render("privacy", { user: res.locals.userData });
});

router.get('/cart', retrieveUserInfo, async function(req, res) {
    let cart = {};
    let cartSize = undefined;

    if (req.cookies.cart) {
        try {
            cart = JSON.parse(req.cookies.cart);
            cartSize = Object.values(cart).map((v) => parseInt(v)).reduce((a, b) => a + b, 0);
        } catch (e) {
            res.status(400).json({message: "Invalid cart contents"});
            return;
        }
    }

    const controller = new ProductController(res.locals.dburi,'products');

    // Load products
    let cartList = [];
    let total = 0;

    for (let row of Object.entries(cart)) {
        let productId = row[0], amount = row[1];

        // Replace once working
        const productInfo = await controller.getData(productId);

        cartList.push({ ...productInfo, amount });

        total += amount * productInfo.price;
    }

    let gst = total * 0.15;

    res.render("cart", { cartList, user: res.locals.userData?.username, total: total.toFixed(2), gst: gst.toFixed(2), cartSize });
});


router.get('/order/:orderId', retrieveUserInfo, async function(req, res) {
    let cart = {};
    let cartSize = undefined;

    if (req.cookies.cart) {
        try {
            cart = JSON.parse(req.cookies.cart);
            cartSize = Object.values(cart).map((v) => parseInt(v)).reduce((a, b) => a + b, 0);
        } catch (e) {
            res.status(400).json({message: "Invalid cart contents"});
            return;
        }
    }

    const controller = new ProductController(res.locals.dburi, 'orders');
    let order = await controller.getData(req.params.orderId);

    let gst = order?.total * 0.15;

    res.render("order", { itemList: order?.products ?? [], total: order?.total.toFixed(2), user: res.locals.userData?.username, gst: gst.toFixed(2), cartSize });
});


router.get('/order', retrieveUserInfo, async function(req, res) {

    if (!res.locals.userData) {
        res.redirect(303, '/');
        return;
    }

    let cartSize = undefined;

    if (req.cookies.cart) {
        try {
            cartSize = Object.values(JSON.parse(req.cookies.cart)).map((v) => parseInt(v)).reduce((a, b) => a + b, 0);
        } catch (e) {}
    }

    const controller = new ProductController(res.locals.dburi, 'orders');

    const id = res.locals.userData.id;
    console.log(id);
    let orders = await controller.getDataOrder(id);

    console.log("Orders: " + JSON.stringify(orders))
    orders = orders.map((v) => {
        // Calculate itemCount
        v.itemCount = Object.values(v.products).map((v) => parseInt(v.quantity)).reduce((a, b) => a + b, 0);
        return v;
    });

    res.render("orders", { orders: orders ?? [], user: res.locals.userData.username, cartSize });
});

module.exports = router;

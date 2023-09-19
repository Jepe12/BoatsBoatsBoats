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

    res.render("login", { layout: 'basic', user: req.user });
});

router.get('/register', function(req, res) {
    res.render("register", { layout: 'basic', user: req.user });
});

router.get('/products/:productId/edit', retrieveUserInfo, async function(req, res) {
    // Disable caching
    res.set('Cache-Control', 'no-store');

    const controller = new ProductController(res.locals.dburi,'products');
    const product = await controller.getData(req.params.productId);
    res.render("product_edit", { product, user: req.user });
});

router.get('/products/new', async function(req, res) {
    res.render("product_edit", { creation: true, user: req.user, product: { name: "New Product", imgUrl: "/assets/boats/Add.png", description: "Fill out description", price: 14.99 } });
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

    const setProducts = [{
        "_id": "65063375533acb75f17a5e96",
        "name": "Wood",
        "price": "14.99",
        "description": "Boat",
        "imgUrl": "https://t3.ftcdn.net/jpg/00/41/60/94/360_F_41609453_X3A8NNRDWvihqMLoJUVNmrQyKQgwgvh4.jpg"
      },
      {
        "_id": "6506340f3fa56732141b90fd",
        "name": "Cool boat",
        "price": "14.99",
        "description": "Epic",
        "imgUrl": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSvf5kPCFM8-7SXnSzFNl8VWzWvCycVCgEheg&usqp=CAU",
      },
      {
        "_id": "6506347cf848557fbb47fbb1",
        "name": "Crazy Boat",
        "price": "1400.99",
        "description": "Crazy Fast",
        "imgUrl": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSvf5kPCFM8-7SXnSzFNl8VWzWvCycVCgEheg&usqp=CAU",
      }];

    // Load products
    let cartList = [];
    let total = 0;

    for (let row of Object.entries(cart)) {
        let productId = row[0], amount = row[1];
        // Replace once working
        const productInfo = await controller.getData(productId);
        //const productInfo = setProducts.find((product) => product._id == productId)

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
    let order = await controller.getData(req.productId);

    let gst = order?.total * 0.15;

    res.render("order", { itemList: order?.products ?? [], total: order?.total.toFixed(2), user: res.locals.userData?.username, gst: gst.toFixed(2), cartSize });
});


router.get('/order', retrieveUserInfo, async function(req, res) {
    let cartSize = undefined;

    if (req.cookies.cart) {
        try {
            cartSize = Object.values(JSON.parse(req.cookies.cart)).map((v) => parseInt(v)).reduce((a, b) => a + b, 0);
        } catch (e) {}
    }

    const controller = new ProductController(res.locals.dburi, 'orders');

    // TODO: Replace with actual orders data
    var oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

    let orders = [
        {products: [{name:'whatever', id: 'id',quantity:2},{name:'whatever2', id: 'id',quantity:1}],total:14.99, time: oneWeekAgo,id:'123'}, 
        {products: [{name:'whatever', id: 'id',quantity:2},{name:'whatever2', id: 'id',quantity:4}],total:14.99, time: new Date(),id:'6623'}
    ];

    orders = orders.map((v) => {
        // Calculate itemCount
        v.itemCount = Object.values(v.products).map((v) => parseInt(v.quantity)).reduce((a, b) => a + b, 0);
        return v;
    });

    console.log(orders)

    res.render("orders", { orders: orders ?? [], user: res.locals.userData?.username, cartSize });
});

module.exports = router;

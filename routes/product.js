var express = require('express');
const { getProductByid
    , getProduct
    , createProduct
    , photo
    , deleteProduct 
    ,updateProduct
    , getAllProducts
    , getAllUniquecategories } = require('../controllers/product');
const { isSignin, isAuthenticated, isAdmin } = require('../controllers/auth');
const { getUserById } = require('../controllers/user');
var router = express.Router();

// params route
router.param("userId", getUserById);
router.param("productId", getProductByid);

// actual routes
// create route
router.post("/product/create/:userId"
, isSignin
, isAuthenticated
, isAdmin
, createProduct );

// read route
router.get("/product/:productId", getProduct);
router.get("/product/photo/:productId", photo);

// delete route
router.delete("/product/:productId/:userId"
, isSignin
, isAuthenticated
, isAdmin
, deleteProduct);

// update route
router.put("/product/:productId/:userId"
, isSignin
, isAuthenticated
, isAdmin
, updateProduct);


// listing route
router.get("/products", getAllProducts);

router.get("/products/categoris", getAllUniquecategories)


module.exports = router;
const express = require('express');

const { isSignin, isAuthenticated, isAdmin } = require('../controllers/auth');
const { getUserById, pushOrderInPurchaseList } = require('../controllers/user');
var router = express.Router();

const { updateStock } = require('../controllers/product');
const { getOrderById
      , createOrder
      , getAllOrders
      , getOrderStatus
      , updateStatus } = require('../controllers/order');

// params
router.param("userId", getUserById);
router.param("orderId", getOrderById);

// create
router.post("/order/create/:userId"
, isSignin
, isAuthenticated
, pushOrderInPurchaseList
, updateStock
, createOrder );

// read
router.get("/order/all/:userId"
, isSignin
, isAuthenticated
, isAdmin
, getAllOrders );

// status of order
router.get("/order/status/:userId"
, isSignin
, isAuthenticated
, isAdmin
, getOrderStatus);
router.put("/order/:orderId/:userId"
, isSignin
, isAuthenticated
, isAdmin
, updateStatus);

module.exports = router;
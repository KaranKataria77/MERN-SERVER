const express = require('express');
const router = express.Router();
const { getUserById, getUser, updateUser, userPurchaseList } = require('../controllers/user')
const { isSignin, isAuthenticated, isAdmin } = require('../controllers/auth')

router.param("userId", getUserById);

router.get("/user/:userId",isSignin, isAuthenticated, getUser);

router.put("/user/:userId", isSignin, isAuthenticated, updateUser)

router.get("/orders/user/:userId", isSignin, isAuthenticated, userPurchaseList)


module.exports = router;

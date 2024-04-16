var express = require('express');
const router = express.Router();

const { getCategoryById
    , createCategory
    , getAllCategory
    , getCategory
    , updateCategory
    , removeCategory } = require('../controllers/category');
const { isSignin, isAuthenticated, isAdmin } = require('../controllers/auth');
const { getUserById } = require('../controllers/user');


// params
router.param("userId", getUserById);

router.param("categoryId", getCategoryById);

// create routes
router.post("/category/create/:userId"
,isSignin 
,isAuthenticated 
,isAdmin
,createCategory )

// read route
router.get("/category/:categoryId", getCategory);
router.get("/categories", getAllCategory);

// update route
router.put("/category/:categoryId/:userId"
,isSignin 
,isAuthenticated 
,isAdmin
,updateCategory )

// delete route
router.delete("/category/:categoryId/:userId"
,isSignin 
,isAuthenticated 
,isAdmin
,removeCategory )

module.exports = router
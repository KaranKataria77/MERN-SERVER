var express = require('express');
var router = express.Router();
const { check } = require('express-validator')
const {signOut, signUp, signIn, isSignin} = require('../controllers/auth');

router.post("/signup",[
    check("name", "name atleast should be 3 charachter").isLength({ min: 3 }),
    check("email", "email is rrequired").isEmail(),
    check("password", "password atleast should be 3 charachter").isLength({ min: 3})
], signUp)

router.post("/signin",[
    check("email", "email is rrequired").isEmail(),
    check("password", "password field is required").isLength({ min: 1})
], signIn)
router.get("/signout", signOut)

router.get("/testroute", isSignin, (req, res) => {
     res.json(req.auth)
})

module.exports = router;
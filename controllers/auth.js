const User = require('../models/user');
const { validationResult } = require('express-validator'); 
const jwt = require('jsonwebtoken');
const expressJwt = require('express-jwt');
const { token } = require('morgan');

exports.signUp = (req, res) => {

    const errors = validationResult(req)

    if(!errors.isEmpty()){
        return res.status(422).json({
            error: errors.array()[0].msg
        })
    }

    const user = new User(req.body)
    user.save((err, user) => {
        if(err){
            return res.status(400).json({
                err: "NOT able to save user in DB"
            })
        }
        res.json({
            name: user.name,
            email: user.email,
            id: user._id
        })
    })
}

exports.signIn = (req, res) => {
    const { email, password } = req.body;
    const errors = validationResult(req)

    if(!errors.isEmpty()){
        return res.status(422).json({
            error: errors.array()[0].msg
        })
    }

    User.findOne({email}, (err, user) => {
        if(err || !user){
            return res.status(400).json({
                error: "USER email does not exist"
            })
        }

        if(!user.authenticate(password)){
            return res.status(401).json({
                error: "Email and password do not match"
            })
        }
// create token
        const token = jwt.sign({_id: user._id}, process.env.SECRET)
        // put token in cookies
        res.cookie("token", token, {expire: new Date() + 9999})

        // send response to front end
        const {_id, name, email, role} = user;
        return res.json({token, user: {_id, name, email, role}})
    })

}

exports.signOut = (req, res) => {
    res.clearCookie("token");
    res.json({
        message: "User signout successfully"
    });
}

// proteted routes
exports.isSignin = expressJwt({
    secret: process.env.SECRET,
    algorithms: ['HS256'],
    requestProperty: "auth",
    credentialsRequired: false
});

exports.isAuthenticated = (req, res, next) => {
    let checker = req.profile && req.auth && req.profile._id == req.auth._id
    if(!checker){
        return res.status(403).json({
            error: "ACCESS DENIED"
        })
    }
    next();
}

exports.isAdmin = (req, res, next) => {
    if(req.profile.role === 0){
        return res.status(403).json({
            error: "Access Denied"
        });
    }
    next();
}
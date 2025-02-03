const express = require('express');
const router = express.Router();
const {jwtauthMiddleware} = require('../auth');
const {handelRegister,handelLogin,handelProfileView} = require('../controller/user.controller')


// Register Route
router.post('/register',handelRegister);
router.get('/register',(req,res)=>{
    res.render('register')
});

// Login Route
router.post('/login',handelLogin);
router.get('/login',(req,res)=>{
    res.render('login')
});

// See Profile after Login
router.get('/profile',jwtauthMiddleware,handelProfileView);

module.exports = router;
const express = require('express');
const router = express.Router();
const {jwtAuthMiddleware} = require('../auth');
const {handleRegister,handleLogin,handleProfileView,handleLogout} = require('../controller/user.controller')


// Register Route
router.post('/register',handleRegister);
router.get('/register',(req,res)=>{
    res.render('register')
});

// Login Route
router.post('/login',handleLogin);
router.get('/login',(req,res)=>{
    res.render('login')
});

// Profile Route
router.get('/profile',jwtAuthMiddleware,handleProfileView);

// Logout Route
router.get('/logout',handleLogout);

module.exports = router;
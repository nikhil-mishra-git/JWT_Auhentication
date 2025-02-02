const express = require('express');
const router = express.Router();
const {jwtauthMiddleware} = require('../auth');
const {handelRegister,handelLogin,handelProfileView} = require('../controller/user.controller')


// Register Route
router.post('/register',handelRegister)

// Login Route
router.post('/login',handelLogin);

// See Profile after Login
router.get('/profile',jwtauthMiddleware,handelProfileView);


module.exports = router;
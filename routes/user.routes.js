const express = require('express');
const router = express.Router();
const userModel = require('../models/user.models');
const {jwtauthMiddleware,generateToken} = require('../auth')


// Register Route

router.post('/register', async(req,res)=>{

    try{
        const {username,email,password} = req.body;
        const newUser = new userModel({username,email,password});
        const userSave = await newUser.save();
        
        if(!userSave){return res.status(401).json({message : "Server unable to Create User"})};
        console.log("User Registerd");

        // Create Payload for JWT ( use any field [ id , username , e.t.c.. ] ) 
        const payload = { username: userSave.username }

        // Generate token at REGISTER
        // Pass payload for Generate Token
        const token = generateToken(payload);
        console.log("REgister Token : ",token);

        res.status(201).json({ message: `${userSave.username} is Created` });

    }catch(error){
        console.log(error);
        res.status(500).json({message : "Internal Server Error"})
    }   

})


// Login Route

router.post('/login',async(req,res)=>{

    try{
        const {username,password} = req.body;
        const verifyUser = await userModel.findOne({username});

        if (!verifyUser) {
            return res.status(401).json({ error: 'Invalid username or password' });
        }

        if (password != verifyUser.password) {
            return res.status(401).json({ error: 'Invalid username or password' });
        }       

        // Generate token at LOGIN
        const payload = {
            username : verifyUser.username
        }

        // Pass Payload
        const token = generateToken(payload);
        console.log("Login Token : ",token);
        
        console.log("User Login");
        res.status(201).json({ message: `${verifyUser.username} is Login` });

    }catch(error){
        console.log(error);
        res.status(500).json({message : "Internal Server Error"})
    }   

})


// See Profile after Login

router.get('/profile',jwtauthMiddleware, async (req,res)=>{

    try{

        const profileData = req.verifyToken;
        console.log(profileData);

        const profileId = profileData.username;
        const userprofile =  await userModel.findOne({username:profileId});
        
        res.status(200).json(userprofile);

    }catch(error){
        console.log(error);
        res.status(500).json({message : "Internal Server Error"})
    }

})


// GET method to get the person

router.get('/', jwtauthMiddleware, async (req, res) =>{
    try{
        const data = await userModel.find();
        console.log('All User Get');
        res.status(200).json(data);
    }catch(err){
        console.log(err);
        res.status(500).json({error: 'Internal Server Error'});
    }
})

module.exports = router;
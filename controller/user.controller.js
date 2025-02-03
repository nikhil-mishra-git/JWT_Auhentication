const userModel = require('../models/user.models');
const {generateToken} = require('../auth');
const bcrypt = require('bcrypt');


// Register Controller
async function handelRegister(req,res){

    try{
        const {username,email,password} = req.body;

        const saltRounds = 10;
        const hashPassword = await bcrypt.hash(password, saltRounds);

        const newUser = new userModel({username,email,password: hashPassword});
        const userSave = await newUser.save();
        
        if(!userSave){return res.status(401).json({message : "Server unable to Create User"})};
        console.log("User Registerd");

        // Create Payload for JWT ( use any field [ id , username , e.t.c.. ] ) 
        const payload = { username: userSave.username }

        // Generate token at REGISTER
        // Pass payload for Generate Token
        const token = generateToken(payload);
        console.log("Register Token : ",token);

        return res.status(201).json({ message: `${userSave.username} is Created` });

    }catch(error){
        console.log(error);
        return res.status(500).json({message : "Internal Server Error"})
    }   

}

// Login Controller
async function handelLogin(req,res){
    try{
        const {username,password} = req.body;
        const verifyUser = await userModel.findOne({username});

        if (!verifyUser) {
            return res.status(401).json({ error: 'Invalid username or password' });
        }

        const isMatch = await bcrypt.compare(password,verifyUser.password);

        if (!isMatch) {
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
        // return res.status(201).json({ message: `${verifyUser.username} is Login` });
        return res.render('profile')

    }catch(error){
        console.log(error);
        return res.status(500).json({message : "Internal Server Error"})
    }   
}

//Profile Controller
async function handelProfileView(req,res){
    try{
        const profileData = req.verifyToken;
        console.log(profileData);

        const profileId = profileData.username;
        const userprofile =  await userModel.findOne({username:profileId});
        
        // return res.status(200).json(userprofile);
        // return res.render('profile');
        res.render('profile', { username: userprofile.username, email: userprofile.email });

    }catch(error){
        console.log(error);
        return res.status(500).json({message : "Internal Server Error"})
    }
}

module.exports = {
    handelRegister,
    handelLogin,
    handelProfileView
}
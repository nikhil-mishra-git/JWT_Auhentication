const userModel = require('../models/user.models');
const { generateToken } = require('../auth');
const bcrypt = require('bcrypt');


// Register Controller
async function handleRegister(req, res) {
    try {
        const { username, email, password } = req.body;

        // Check if the user already exists
        const existingUser = await userModel.findOne({ $or: [{ username }, { email }] });
        if (existingUser) {
            return res.status(400).json({ message: "Username or Email already exists" });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Save new user
        const newUser = new userModel({ username, email, password: hashedPassword });
        const savedUser = await newUser.save();

        // console.log("User Registered:", savedUser);
        // Generate JWT token
        const token = generateToken({ username: savedUser.username });

        // Store token in cookies
        res.cookie("token", token, { httpOnly: true, secure: false, sameSite: "strict" });

        // Redirect to profile page
        return res.redirect('profile');

    } catch (error) {
        console.error("Error in handleRegister:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
}

// Login Controller
async function handleLogin(req, res) {
    try {
        const { username, password } = req.body;

        // Find user by username
        const existingUser = await userModel.findOne({ username });

        if (!existingUser) {
            return res.status(401).json({ error: 'Invalid username or password' });
        }

        // Compare hashed passwords
        const isMatch = await bcrypt.compare(password, existingUser.password);
        if (!isMatch) {
            return res.status(401).json({ error: 'Invalid username or password' });
        }

        // Generate JWT token
        const payload = { username: existingUser.username };
        const token = generateToken(payload);

        // Store token in cookies
        res.cookie("token", token, { httpOnly: true, secure: false, sameSite: "strict" });

        console.log("User Logged In Successfully");

        // Redirect to profile page
        return res.redirect('profile');

    } catch (error) {
        console.error("Error in handleLogin:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
}

// Profile Controller
async function handleProfileView(req, res) {
    try {
        const profileData = req.verifyToken;
        // console.log("Profile Data:", profileData);

        const profileId = profileData.username;
        const userProfile = await userModel.findOne({ username: profileId });

        if (!userProfile) {
            return res.status(404).json({ message: "User not found" });
        }

        // Render profile page with user data
        return res.render('profile', { username: userProfile.username, email: userProfile.email });

    } catch (error) {
        console.error("Error in handleProfileView:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
}

// Logout Controller
async function handleLogout(req,res){
    res.clearCookie("token",{ httpOnly: true, secure: false, sameSite: "strict" });
    return res.redirect('/')
}

module.exports = {
    handleRegister,
    handleLogin,
    handleProfileView,
    handleLogout
};

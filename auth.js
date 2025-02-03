const jwt = require('jsonwebtoken');

// JWT Secret Key (Consider using environment variables for security)
const JWT_SECRET = 'JWTSECRETKEY';

// Middleware for JWT Authentication
const jwtAuthMiddleware = (req, res, next) => {
    try {
        // Debugging: Log received cookies
        // console.log("Cookies Received:", req.cookies);

        // Extract JWT token from cookies
        const token = req.cookies?.token;
        if (!token) {
            return res.status(401).json({ error: 'Token not found' });
        }

        // Verify JWT Token
        const decodedToken = jwt.verify(token, JWT_SECRET);
        req.verifyToken = decodedToken;
        next();

    } catch (error) {
        console.error("JWT Verification Error:", error);
        return res.status(401).json({ error: 'Invalid or expired token' });
    }
};

// Function to Generate JWT Token
const generateToken = (userData) => {
    return jwt.sign(
        userData, // Payload (user data)
        JWT_SECRET, // Secret key
        { expiresIn: '1200s' } // Token expiration (500 seconds)
    );
};

module.exports = { jwtAuthMiddleware, generateToken };

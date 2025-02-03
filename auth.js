const jwt = require('jsonwebtoken');

const jwtauthMiddleware = (req,res,next)=>{
    // JWT Middleware

    // Verify token present in Header or Not
    const authorization = req.headers.authorization;
    if(!authorization){return res.status(401).json({ error: 'Token Not Found' })};

    // Extract JWT token from Header
    const token = (req.headers.authorization.split(" ")[1]);

    try{

        const decodeToken = jwt.verify(token,'JWTSECRETKEY');
        req.verifyToken = decodeToken;
        next();

    }catch(error){
        console.error(error);
        res.status(401).json({ error: 'Invalid token' });
    }

}

const generateToken = (userData)=>{

    // Create Token to new Created User

    return jwt.sign(

        // Head and Payload recieved from Route
        userData, 

        // Signature Key
        'JWTSECRETKEY',
        
        // Duration of an Token
        {expiresIn: 50}  //in 500 seconds
    )

}

module.exports = {jwtauthMiddleware,generateToken}
const jwt = require('jsonwebtoken');
const tokenKey = require('../config/keys').secretOrKey;



module.exports = (req,res,next)=>{//jwt.decode is helpful when we want to get to the internal of the token after verifying
    try{
    const token =  req.headers.authorization.split(" ")[1];
    console.log(token);
    const decoded = jwt.verify(req.body.token,tokenKey); //verify do both verify and decode
    req.userdata = decoded;
    next();                         //to move on with the rest of the code
 
    } catch (err){
        return res.status(401).json({
            message: 'Authentication Failed'
        })
    }
}
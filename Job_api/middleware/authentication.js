const User = require('../models/User')
const {StatusCodes} = require('http-status-codes')
const {UnauthenticatedError} = require('../errors')
const jwt = require('jsonwebtoken')


const auth = async (req,res,next) => {
    const authHeader = req.headers.authorization;
    //console.log(authHeader)
    
    if(!authHeader || !authHeader.startsWith('Bearer ')){
        throw new UnauthenticatedError('Authentication invalid')
    }
    
    const token = authHeader.split(' ')[1]
    //console.log(token)
    try{
        const decoded = jwt.verify(token,process.env.JWT_SECRET);
        req.user = {userId: decoded.userId, name: decoded.name}
        next()
    }catch(error){
        console.log(error)
        throw new UnauthenticatedError('Authentication invalid')
    }
}

module.exports = auth;

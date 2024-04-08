const User = require('../models/User')
const {StatusCodes} = require('http-status-codes')
const {BadRequestError, UnauthenticatedError} = require('../errors')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const register = async(req, res) => {
    //console.log(req.body)
    const user = await User.create({... req.body})
    const token = user.createJWT()
    //console.log(token)
    res.status(StatusCodes.CREATED).json({user:{name:user.name},token})
}

const login = async(req,res)=>{
    const {email,password} = req.body;
    if(!email || !password){
        throw new BadRequestError('Please provide email and password')
    }

    const user = await User.findOne({email})
    //compare pasword
    if(!user){
        throw new UnauthenticatedError('Invalid Credentials')
    }
    if(!await user.comparePassword(password)){
        throw new UnauthenticatedError('Invalid Credentials')
    }
    const token = user.createJWT()
    res.status(StatusCodes.OK).json({user:{name:user.name},token})
}

module.exports= {
    register,
    login
}
const {StatusCodes} = require('http-status-codes')
const Job = require('../models/Job')
const {BadRequestError,NotFoundError} = require('../errors')

const getAllJob = async(req, res) => {
    const jobs = await Job.find({createdBy: req.user.userId}).sort('createdAt')
    res.status(StatusCodes.OK).json({jobs, count: jobs.length})
    //res.send('get all jobs')
}

const getSingleJob = async(req,res)=>{
    const job = await Job.findOne({createdBy: req.user.userId, _id: req.params.id})
    if(!job){
        throw new NotFoundError(`No job with id: ${req.params.id}`)
    }
    res.status(StatusCodes.OK).json({job})
}

const createJob = async(req,res)=>{
    req.body.createdBy = req.user.userId;
    const job = await Job.create(req.body);
    res.status(StatusCodes.CREATED).json({job})

    
}
const updateJob = async(req,res)=>{
    const {
        body : {company, position},
        params: {id: jobId},
        user: {userId}
    } = req;
    if(company === '' || position === ''){
        throw new BadRequestError('Company or position fields cannot be empty')
    }
    const job = await Job.findOneAndUpdate({_id:jobId, createdBy: userId}, req.body, {new: true, runValidators:true})
    if(!job){
        throw new NotFoundError(`No job with id: ${req.params.id}`)
    }
    res.status(StatusCodes.OK).json({job})
}
const deleteJob = async(req,res)=>{
    const job = await Job.findByIdAndRemove({createdBy: req.user.userId, _id: req.params.id})
    if(!job){
        throw new NotFoundError(`No job with id: ${req.params.id}`)
    }
    res.status(StatusCodes.OK).json({job})
}

module.exports= {
    getAllJob,
    getSingleJob,
    createJob,
    updateJob,
    deleteJob
}
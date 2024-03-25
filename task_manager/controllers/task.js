const Task = require('../models/task')
const asyncWrapper = require('../middleware/async')

const allTasks = asyncWrapper(async (req,res)=>{
    const tasks = await Task.find({})
    res.status(200).json({tasks})
})

const addTask = asyncWrapper(async (req,res)=>{
    const task = await Task.create(req.body)
    res.status(201).json({task})
})

const getSingleTask = asyncWrapper(async (req,res)=>{
    const {id:TaskID} = req.params
    const task = await Task.findOne({_id:TaskID})
    if(!task){
        return res.status(404).json({msg:`No task with id : ${TaskID}`})
    }
    res.status(200).json({task})
})

const updateTask = asyncWrapper(async (req,res)=>{ 
    const {id:TaskID} = req.params
    const task = await Task.findOneAndUpdate({_id:TaskID},req.body,{new:true, runValidators:true})
    if(!task){
        return res.status(404).json({msg:`No task with id : ${TaskID}`})
    }
    res.status(200).json({task})
})

const deleteTask = asyncWrapper(async (req,res)=>{
    const {id:TaskID} = req.params
    const task = await Task.findOneAndDelete({_id:TaskID})
    console.log(task)
    if(!task){
        return res.status(404).json({msg:`No task with id : ${TaskID}`})
    }
    res.status(200).json({task})
})



module.exports = {allTasks, addTask, getSingleTask, updateTask, deleteTask};
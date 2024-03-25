const express = require('express');
const router = express.Router();
const {allTasks,addTask, getSingleTask, updateTask, deleteTask} = require('../controllers/task')

router.route('/').get(allTasks).post(addTask)
router.route('/:id').get(getSingleTask).patch(updateTask).delete(deleteTask)


module.exports = router;
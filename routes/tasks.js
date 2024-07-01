const express = require('express');
const router = express.Router();
const taskController = require('../controller/taskController');

// Create a new task
router.post('/', taskController.createTask);

// Get all tasks
router.get('/', taskController.getAllTasks);

// Get a specific task by ID
router.get('/:taskId', taskController.getTaskById);

// Update a specific task by ID
router.put('/:taskId', taskController.updateTaskById);

// Delete a specific task by ID
router.delete('/:taskId', taskController.deleteTaskById);

module.exports = router;

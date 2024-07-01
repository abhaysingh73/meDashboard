const Task = require('../models/task');
const { v4: uuidv4 } = require('uuid');
const statsController = require('./statsController');

// Create a new task
exports.createTask = async (req, res) => {
    try {
        const newTask = new Task({
            Task: req.body.Task,
            Task_Id: uuidv4(),
            Days: req.body.Days,
        });
        await newTask.save();
        statsController.initializeStatistics();
        res.status(201).json(newTask);
    } catch (error) {
        res.status(500).json({ error: 'Failed to create task' });
    }
};

// Get all tasks
exports.getAllTasks = async (req, res) => {
    try {
        const tasks = await Task.find();
        res.status(200).json(tasks);
    } catch (error) {
        res.status(500).json({ error: 'Failed to retrieve tasks' });
    }
};

// Get a specific task by ID
exports.getTaskById = async (req, res) => {
    try {
        const task = await Task.findOne({ Task_Id: req.params.taskId });
        if (!task) {
            return res.status(404).json({ error: 'Task not found' });
        }
        res.status(200).json(task);
    } catch (error) {
        res.status(500).json({ error: 'Failed to retrieve task' });
    }
};

// Update a specific task by ID
exports.updateTaskById = async (req, res) => {
    try {
        const updatedTask = await Task.findOneAndUpdate(
            { Task_Id: req.params.taskId },
            {
                Task: req.body.Task,
                Modified_On: Date.now(),
                Days: req.body.Days,
            },
            { new: true }
        );
        if (!updatedTask) {
            return res.status(404).json({ error: 'Task not found' });
        }
        statsController.initializeStatistics();
        res.status(200).json(updatedTask);
    } catch (error) {
        res.status(500).json({ error: 'Failed to update task' });
    }
};

// Delete a specific task by ID
exports.deleteTaskById = async (req, res) => {
    try {
        const deletedTask = await Task.findOneAndDelete({ Task_Id: req.params.taskId });
        if (!deletedTask) {
            return res.status(404).json({ error: 'Task not found' });
        }
        statsController.initializeStatistics();
        res.status(200).json({ message: 'Task deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete task' });
    }
};

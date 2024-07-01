const Statistics = require('../models/statistics');
const Task = require('../models/task'); // Assuming you have a task model
const moment = require('moment');
const weekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
var today = moment().format("DD-MM-YYYY");
// Create or update statistics for today
exports.statistics = async (req, res) => {
    try {
        const { tasks } = req.body;

        const startOfDay = moment().startOf('day').toDate(); // Start of today (00:00:00)
        const endOfDay = moment().endOf('day').toDate();     // End of today (23:59:59)
        let statistics = await Statistics.findOne({
            Created_On: {
                $gte: startOfDay,
                $lt: endOfDay
            }
        });

        if (!statistics) {
            // Create new document if not exists
            return res.status(400).json({ error: 'Statistics data for today does not exist. Initialization required.' });
        } else {
            // Update only the tasks that are already present in the statistics object
            const updatedTasks = { ...statistics.tasks };
            for (let task in tasks) {
                if (updatedTasks.hasOwnProperty(task)) {
                    updatedTasks[task] = tasks[task];
                } else {
                    return res.status(400).json({ error: `Task ${task} is not present in today's statistics.` });
                }
            }
            statistics.tasks = updatedTasks;
            statistics.Modified_On = new Date();

            // Save document
            await statistics.save();

            res.json(statistics);
        }
    } catch (error) {
        console.error('Error saving statistics:', error);
        res.status(500).json({ error: 'Failed to save statistics' });
    }
};

// Initialize today's statistics
exports.initializeStatistics = async () => {
    try {
        // Fetch tasks from tasksdb collection
        const tasks = await Task.find({});

        // Calculate start and end of today in UTC
        const startOfDay = moment().startOf('day').toDate();
        const endOfDay = moment().endOf('day').toDate();

        // Find the statistics document for today
        let statistics = await Statistics.findOne({
            Created_On: {
                $gte: startOfDay,
                $lt: endOfDay
            }
        });

        if (statistics) {
            var old_tasks = {};
            // Update existing statistics document
            if (statistics.tasks) {
                old_tasks = JSON.parse(JSON.stringify(statistics.tasks));
            }
            statistics.tasks = {};
            tasks.forEach(task => {
                if(task.Days[moment().format("dddd")]){
                    statistics.tasks[task.Task] = false; // Initialize task status
                    if (old_tasks.hasOwnProperty(task.Task)) {
                        statistics.tasks[task.Task] = old_tasks[task.Task];
                    }
                }
            });
            statistics.Modified_On = new Date();

            // Save updated document
            await statistics.save();
        } else {
            // Create new statistics document
            const tasksStatus = {};
            tasks.forEach(task => {
                tasksStatus[task.Task] = false; // Initialize task status
            });

            statistics = new Statistics({
                tasks: tasksStatus,
                Created_On: new Date(),
                Modified_On: new Date(),
            });

            // Save new document
            await statistics.save();
        }
    } catch (error) {
        console.error('Error initializing statistics:', error);
    }
};

exports.getTodaysStatistics = async (req, res) => {
    try {
        if(today && today !== moment().format("DD-MM-YYYY")){
            today = moment().format("DD-MM-YYYY");
            await initializeStatistics();
        }
        const startOfDay = moment().startOf('day').toDate(); // Start of today (00:00:00)
        const endOfDay = moment().endOf('day').toDate();     // End of today (23:59:59)
        let statistics = await Statistics.findOne({
            Created_On: {
                $gte: startOfDay,
                $lt: endOfDay
            }
        });
        res.json(statistics);

    } catch (error) {
        console.error('Error saving statistics:', error);
        res.status(500).json({ error: 'Failed to load statistics' });
    }
}

exports.getStatistics = async (req, res) => {
    try {
        let query = {};
        const timeRange = req.query.timeRange;
        const dayFilter = req.query.dayFilter;

        if (timeRange === 'month') {
            const startOfMonth = moment().startOf('month').toDate();
            const endOfMonth = moment().endOf('month').toDate();
            query.Created_On = { $gte: startOfMonth, $lt: endOfMonth };
        } else if (timeRange === 'year') {
            const startOfYear = moment().startOf('year').toDate();
            const endOfYear = moment().endOf('year').toDate();
            query.Created_On = { $gte: startOfYear, $lt: endOfYear };
        }

        let statistics = await Statistics.find(query);

        if (dayFilter && dayFilter !== 'all') {
            statistics = statistics.filter(stat => {
                const statDate = new Date(stat.Created_On);
                const statDay = weekdays[statDate.getDay()];
                return statDay === dayFilter;
            });
        }

        res.json(statistics);
    } catch (error) {
        console.error('Error fetching statistics:', error);
        res.status(500).json({ error: 'Failed to fetch statistics' });
    }
};
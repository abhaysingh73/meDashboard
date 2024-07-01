const express = require('express');
const router = express.Router();
const statsController = require('../controllers/statsController');

// Create a new task
router.post('/', statsController.statistics);

router.get('/', statsController.getTodaysStatistics);

router.get('/statistics', statsController.getStatistics);

module.exports = router;
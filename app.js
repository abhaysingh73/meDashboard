require("dotenv").config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require("cors");
const taskRoutes = require('./routes/tasks');
const statsRoutes = require('./routes/statistics');
const statsController = require('./controllers/statsController');
const authRoutes = require('./routes/auth')
const app = express();
const jwt = require("jsonwebtoken");

app.use(cors());
app.use(bodyParser.json());

app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/statistics', statsRoutes);
statsController.initializeStatistics();
app.listen(process.env.port, () => {
    console.log(`Server running at http://localhost:${process.env.port}/`);
});
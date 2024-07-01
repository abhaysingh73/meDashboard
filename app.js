const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require("cors");
const taskRoutes = require('./routes/tasks');
const statsRoutes = require('./routes/statistics');
const statsController = require('./controllers/statsController');
const app = express();
const port = 3000;

app.use(cors());
app.use(bodyParser.json());

mongoose.connect('mongodb://0.0.0.0/tasksdb', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
    console.log('Connected to MongoDB');
});

app.use('/api/tasks', taskRoutes);
app.use('/api/statistics', statsRoutes);
statsController.initializeStatistics();

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}/`);
});
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const taskRoutes = require('./routes/tasks');
const cors = require("cors");
const app = express();
const port = 3000;
// Middleware
app.use(bodyParser.json());
app.use(cors());


// MongoDB connection
mongoose.connect('mongodb://0.0.0.0/tasksdb', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
    console.log('Connected to MongoDB');
});

// Routes
app.use('/api/tasks', taskRoutes);

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}/`);
});

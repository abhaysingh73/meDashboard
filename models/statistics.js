
const mongoose = require('mongoose');
var connection = mongoose.createConnection('mongodb://0.0.0.0/statistics');

const statisticsSchema = new mongoose.Schema({
    tasks: {
        type: Object,
        required: true,
    },
    Created_On: {
        type: Date,
        default: Date.now,
    },
    Modified_On: {
        type: Date,
        default: Date.now,
    },
});
module.exports = connection.model('Stats', statisticsSchema);


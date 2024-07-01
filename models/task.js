const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
    Created_On: {
        type: Date,
        default: Date.now,
    },
    Modified_On: {
        type: Date,
        default: Date.now,
    },
    Task: {
        type: String,
        required: true,
    },
    Task_Id: {
        type: String,
        required: true,
        unique: true,
    },
    Days: {
        Monday: { type: Boolean, default: false },
        Tuesday: { type: Boolean, default: false },
        Wednesday: { type: Boolean, default: false },
        Thursday: { type: Boolean, default: false },
        Friday: { type: Boolean, default: false },
        Saturday: { type: Boolean, default: false },
        Sunday: { type: Boolean, default: false },
    },
});

module.exports = mongoose.model('Task', taskSchema);

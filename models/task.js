const mongoose = require('mongoose');
const connection = mongoose.createConnection("mongodb://0.0.0.0/taskdb");
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
        Sunday: { type: Boolean, default: false }
    },
    Category: {
        type: String,
        enum: ['work', 'personal', 'health'],
        default: 'personal'
    },
    Priority: {
        type: String,
        enum: ['High', 'Medium', 'Low'],
        default: 'medium'
    },
    Details: {
        type: String,
        default: ''
    }
});

module.exports = connection.model('Task', taskSchema);

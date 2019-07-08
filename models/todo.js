const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const todoSchema = new Schema({
    title:{
        type: String,
        required: true
    },
    description:{
        type: String,
        required: true
    },
    image:{
        type: String,
        required: true
    },
    isCompleted:{
        type: Boolean,
        required: true
    },
    creator: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
});

module.exports = mongoose.model('Todo', todoSchema);
const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const userSchema = new Schema({
    username:{
        type: String,
        required: true
    },
    displayname:{
        type: String,
        required: false
    },
    email:{
        type: String,
        required: true
    },
    password:{
        type: String,
        required: true
    },
    createdTodos:[
        {
            type: Schema.Types.ObjectId,
            ref: 'Todo'
        }
    ]
});

module.exports = mongoose.model('User', userSchema);
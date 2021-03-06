const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        min: 6,
        max: 100
    },
    email: {
        type: String,
        required: true,
        min: 6,
        max: 100
    },
    password: {
        type: String,
        required: true,
        max: 255,
        min: 6
    },
    date: {
        type: Date,
        default: Date.now
    },
    token: {
        type: String
    }
});


module.exports = mongoose.model('User', userSchema);
const mongoose = require('mongoose');

const PlayerSchema = new mongoose.Schema({
    name: {
        type: 'string',
        required: true
    },
    age: {
        type: 'number',
        required: true
    },
    email: {
        type: 'string',
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now()
    }
});

module.exports = mongoose.model('Player', PlayerSchema);
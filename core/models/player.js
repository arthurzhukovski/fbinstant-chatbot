const mongoose = require('mongoose');

const PlayerSchema = new mongoose.Schema({
    instantId: {
        type: String,
        required: true,
        unique: true
    },
    name: {
        type: String,
        required: true
    },
    avatar: {
        type: String,
        required: true
    },
    tzOffset: {
        type: 'number',
        required: true
    },
    locale: {
        type: String,
        required: true
    },
    friends:{
        type: [String]
    },
    createdAt: {
        type: Date,
        default: Date.now()
    }
});

module.exports = mongoose.model('Player', PlayerSchema);
const mongoose = require('mongoose');

const WebhookSchema = new mongoose.Schema({
    senderId: {
        type: String,
        required: true
    },
    playerId: {
        type: String,
        required: true
    },
    contextId: {
        type: String,
        required: true
    },
    isInQueue:{
        type: Boolean,
        default: false
    },
    hookedAt: {
        type: Date,
        required: true
    },
    sendAt: {
        type: Date,
        required: true
    },
    lastErrorCode: {
        type: String
    },
    sentAfterHook: {
        type: Number,
        required: true,
        default: 0
    },
    createdAt: {
        type: Date,
        default: Date.now()
    },
    player: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Player'
    }
});

module.exports = mongoose.model('Webhook', WebhookSchema);
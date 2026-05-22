const mongoose = require('mongoose');

const systemLogSchema = new mongoose.Schema({
    event: {
        type: String,
        required: true,
        enum: ['SERVER_START', 'ADMIN_ACTION', 'USER_REGISTRATION', 'SYSTEM_ERROR', 'CONFIG_CHANGE']
    },
    message: {
        type: String,
        required: true
    },
    metadata: {
        type: mongoose.Schema.Types.Mixed
    },
    timestamp: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('SystemLog', systemLogSchema);

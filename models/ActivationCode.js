const mongoose = require('mongoose');

const activationCodeSchema = new mongoose.Schema({
    code: String,
    isUsed: {
        type: Boolean,
        default: false
    }
});
module.exports = mongoose.model('ActivationCode', activationCodeSchema, 'yourCollectionName');
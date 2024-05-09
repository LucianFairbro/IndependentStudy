const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const eventSchema = new Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    location: { type: String, required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    isOnline: { type: Boolean, default: false },
    registrationLink: { type: String },
    organizer: {
            type: Schema.Types.ObjectId,
            ref: 'user',
            required: false
        },
    attendees: [{ type: Schema.Types.ObjectId, ref: 'user' }],
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'user', required: true }

});

module.exports = mongoose.model('event', eventSchema);

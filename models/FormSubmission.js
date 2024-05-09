const mongoose = require('mongoose');

const formSubmissionSchema = new mongoose.Schema({
    name: String,
    email: String,
    category: String,
    activationCode: String,
    additionalInfo: String,
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    },
    // Adding new fields for the pie chart data
    pieChartData: [Number], // Array of numbers to store the chart data
    labels: [String] // Array of strings to store the labels for the chart data
});

module.exports = mongoose.model('FormSubmission', formSubmissionSchema, 'formSubmissions');

// models/test.js

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const TestSchema = new Schema({
    name: String,
    additionalInfo: String,
    pieChartData: [Number] // Array to hold pie chart data
});

const Test = mongoose.model('Test', TestSchema);

module.exports = Test;
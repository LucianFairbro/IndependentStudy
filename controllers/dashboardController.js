// controllers/dashboardController.js

const Test = require('../models/test');

exports.getDashboard = (req, res) => {
    Test.findById('yourTestId')
        .then(test => {
            res.render('dashboard', { test: test });
        })
        .catch(err => console.log(err));
};
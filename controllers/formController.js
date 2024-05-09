// formController.js
const mongoose = require('mongoose');
const ActivationCode = require('../models/ActivationCode');
const FormSubmission = require('../models/FormSubmission');

exports.displayForm = (req, res) => {
    if (!req.session.userId) {
        return res.redirect('/users/login');
    }
    res.render('form/activateForm', { layout: 'layout' });
};

exports.handleSubmit = async (req, res) => {
    console.log("Form Submission Received");
    console.log("Received data:", req.body);
    try {
        const { activationCode, name, email, category } = req.body;
        const trimmedCode = activationCode.trim();

        const codes = await ActivationCode.find({
            code: trimmedCode,
            isUsed: false  // changed 'used' to 'isUsed'
        });

        console.log("Query Result:", codes);
        const totalCodes = await ActivationCode.countDocuments();
        console.log("Total documents in ActivationCode collection:", totalCodes);

        if (!codes.length || codes.length > 1) {
            console.log("No unique unused code found or multiple found:", codes);
            req.flash('error', 'No unique unused activation code found or multiple found.');
            return res.redirect('/form/activate');
        }

        const code = codes[0];
        console.log("Found code:", code);

        // Mark the code as used
        code.isUsed = true;
        await code.save();
        console.log("Marked code as used:", code);

        const newSubmission = new FormSubmission({ name, email, category, activationCode: trimmedCode, user: req.session.userId });
        // NOTE: Link user
        await newSubmission.save();
        console.log("New submission saved:", newSubmission);

        req.flash('success', 'Form submitted successfully.');
        res.redirect('/form/activate');
    } catch (error) {
        console.error("Error during form submission:", error);
        req.flash('error', 'An error occurred.');
        res.redirect('/form/activate');
    }
};
exports.showTest = async function(req, res) {
    try {
        const foundFormSubmission = await FormSubmission.findById(req.params.id);
        res.render("users/show", {test: foundFormSubmission});
    } catch (err) {
        console.log(err);
        req.flash('error', 'An error occurred while retrieving the test.');
        res.redirect('back');
    }
};

exports.updateTestProgress = async function(req, res) {
    const testId = req.params.id; // Or however you get the test ID
    const newProgress = req.body.progress; // Assuming the new progress comes from request body

    try {
        await FormSubmission.findByIdAndUpdate(testId, { progress: newProgress });
        req.flash('success', 'Test progress updated successfully.');
        res.redirect('/some-page');
    } catch (err) {
        console.error('Error updating test progress:', err);
        req.flash('error', 'Failed to update test progress.');
        res.redirect('back');
    }
};
module.exports = {
    displayForm: exports.displayForm,
    handleSubmit: exports.handleSubmit,
    showTest: exports.showTest
};
const express = require('express');
const router = express.Router();
const User = require('../models/user');
const FormSubmission = require('../models/FormSubmission');

router.get('/', async (req, res) => {
    try {
    const allUsers = await User.find({});
    res.render('users/index', { users: allUsers });
    } catch (err) {
    res.send(err);
    }
});
router.get('/new', (req, res) => {
    res.render('users/new');
});
router.post('/signup', async (req, res) => {
    try {
        const newUser = new User(req.body);
        await newUser.save();
        res.redirect('/users/login');
    } catch (err) {
        console.log(err);
    }
});
router.get('/chat', (req, res) => {
    if (req.session.userId) {
        res.render('chat');
    } else {
        res.redirect('/users/login');
    }
});

router.get('/login', (req, res) => {
    res.render('users/edit');
});
router.get('/logout', (req, res) => {
    req.session.destroy(() => {
        res.redirect('/');
    });
});
router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (user && user.password === password) {
            req.session.userId = user._id;
            req.flash('success', 'Successfully logged in.');
            res.redirect('/');
        } else {
            req.flash('error', 'Invalid credentials.');
            res.redirect('/users/login');
        }
    } catch (err) {
        console.error(err);
        req.flash('error', 'An error occurred during login.');
        res.redirect('/users/login');
    }
});

router.get('/:id', async (req, res) => {
    const foundUser = await User.findById(req.params.id);
    res.render('users/show', { user: foundUser });
});
router.get('/:id/edit', async (req, res) => {
    const foundUser = await User.findById(req.params.id);
    res.render('users/edit', { user: foundUser });
});
router.put('/:id', async (req, res) => {
    await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.redirect(`/users/${req.params.id}`);
});
router.delete('/:id', async (req, res) => {
    await User.findByIdAndDelete(req.params.id);
    res.redirect('/users');
});
router.get('/logout', (req, res) => {
    req.session.destroy(err => {
        if (err) {
        } else {
            res.redirect('/');
        }
    });
});
router.listUserTests = async function(req, res) {
    try {
        // This will find all forms linked to the user
        const tests = await FormSubmission.find({ user: req.params.id });

        console.log(tests); // Log the tests to the console

        res.render('users/tests', { tests: tests, user: res.locals.user });
    } catch (err) {
        console.log(err);
    }
};

module.exports = router;

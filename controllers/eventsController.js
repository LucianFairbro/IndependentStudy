const express = require('express');
const router = express.Router();
const Event = require('../models/Event');
const User = require('../models/user');
const { authenticateAPI, authenticateToken } = require('../middleware/middleware');
router.get('/api/events', async (req, res) => {
    try {
        const events = await Event.find({});
        res.json(events);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});
router.get('/api/events', authenticateAPI, async (req, res) => {
    try {
        const events = await Event.find({});
        res.json(events);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});
router.get('/api/events', authenticateToken, async (req, res) => {
    try {
        const events = await Event.find({});
        res.json(events);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});
router.get('/', async (req, res) => {
    try {
        const allEvents = await Event.find({});
        res.render('events/index', { events: allEvents });
    } catch (err) {
        console.error('Error fetching events:', err);
        res.status(500).send('Error loading events');
    }
});

router.get('/new', (req, res) => {
    if (req.session.userId) {
        res.render('events/new');
    } else {
        res.redirect('/users/login');
    }
});

router.post('/', async (req, res) => {
    try {
        console.log('Received data for new event:', req.body);
        const createdBy = req.session.userId;
        if (!createdBy) {
            console.error('No user session found. Redirecting to login.');
            req.flash('error', 'You must be logged in to create an event.');
            return res.redirect('/users/login');
        }
        const newEvent = new Event({
            title: req.body.title,
            description: req.body.description,
            location: req.body.location,
            startDate: req.body.startDate,
            endDate: req.body.endDate,
            createdBy: createdBy
        });
        const savedEvent = await newEvent.save();
        console.log('Event created successfully:', savedEvent);
        req.flash('success', 'Event created successfully!');
        res.redirect('/events');
    } catch (err) {
        console.error('Error creating event:', err);
        req.flash('error', 'Error creating event.');
        res.redirect('/events/new');
    }
});

router.get('/:id', async (req, res) => {
    const event = await Event.findById(req.params.id).populate('organizer attendees');
    let user = null;
    if (req.session.userId) {
    user = await User.findById(req.session.userId);}
    res.render('events/show', { event: event, user: user });
});
router.get('/:id/edit', async (req, res) => {
    const foundEvent = await Event.findById(req.params.id);
    const event = await Event.findById(req.params.id);
    const currentUser = await User.findById(req.session.userId);
    if (currentUser && (event.createdBy.equals(currentUser._id) || currentUser.isAdmin)) {
        res.render('events/edit', { event: foundEvent });
    } else {
        res.send('Unauthorized');
    }
});

router.put('/:id', async (req, res) => {
    const event = await Event.findById(req.params.id);
    const currentUser = await User.findById(req.session.userId);

    if (currentUser && (event.createdBy.equals(currentUser._id) || currentUser.isAdmin)) {
        await Event.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.redirect(`/events/${req.params.id}`);
    } else {
        res.send('Unauthorized');
    }
});

router.delete('/:id', async (req, res) => {
    const currentUser = await User.findById(req.session.userId);

    if (currentUser && currentUser.isAdmin) {
        await Event.findByIdAndDelete(req.params.id);
        res.redirect('/events');
    } else {
        res.send('Unauthorized');
    }
});
router.post('/:eventId/attend', async (req, res) => {
    if (!req.session.userId) {
        req.flash('error', 'You must be logged in to attend events.');
        return res.redirect('/users/login');
    }
    try {
        await Event.findByIdAndUpdate(req.params.eventId, {
            $addToSet: { attendees: req.session.userId }
        });
        req.flash('success', 'You have successfully registered to attend the event.');
        res.redirect('/events/' + req.params.eventId);
    } catch (err) {
        console.error(err);
        req.flash('error', 'Error registering for the event.');
        res.redirect('/events/' + req.params.eventId);
    }
});
router.get('/:eventId/attendees', async (req, res) => {
    try {
        const eventId = req.params.eventId;
        const event = await Event.findById(eventId).populate('attendees');
        if (!event) {
            return res.status(404).send('Event not found');
        }
        res.render('events/attendees', { event: event });
    } catch (err) {
        console.error(err);
        res.status(500).send('Error retrieving event attendees');
    }
});

module.exports = router;

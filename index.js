require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const MongoStore = require('connect-mongo');
const user = require('./models/user');
const methodOverride = require('method-override');
const expressLayouts = require('express-ejs-layouts');
const session = require('express-session');
const app = express();
const formController = require('./controllers/formController');
const usersController = require('./controllers/usersController');
const flash = require('connect-flash');
const http = require('http').Server(app);
const io = require('socket.io')(http);
const dashboardController = require('./controllers/dashboardController');
app.get('/dashboard', dashboardController.getDashboard);
app.use(expressLayouts);
app.set('view engine', 'ejs');
app.set('layout', 'layout');
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

mongoose.connect(process.env.DB_URI)
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.log('Failed to connect to MongoDB:', err));

// Session Configuration
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
        mongoUrl: process.env.DB_URI
    }),
    cookie: { secure: false } 
}));
// Session Configuration

mongoose.connection.once('open', () => {
    console.log('Connected to MongoDB');
});

app.use((req, res, next) => {
    if (req.session.userId) {
        user.findById(req.session.userId)
            .then(user => {
                res.locals.user = user;
                next();
            })
            .catch(error => {
                console.log(error);
                next();
            });
    } else {
        res.locals.user = null;
        next();
    }
});

app.use(flash());

app.use((req, res, next) => {
    res.locals.flash = {
        success: req.flash('success'),
        error: req.flash('error')
    };
    next();
})

io.on('connection', (socket) => {
    console.log('a user connected');

    socket.on('disconnect', () => {
        console.log('user disconnected');
    });

    socket.on('chat message', (msg) => {
        io.emit('chat message', msg);
    });
});
app.use('/tests/:id', formController.showTest);
app.use('/form/activate', formController.displayForm);
app.use('/users/:id/tests', usersController.listUserTests);
app.use('/tests/:id', formController.showTest);
app.post('/submit-form', formController.handleSubmit);
app.use('/', express.Router().get('/', (req, res) => res.render('index')));
app.use('/users', usersController);



const PORT = process.env.PORT || 3000; // Fallback to 3000 for local development
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
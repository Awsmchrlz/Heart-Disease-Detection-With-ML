// Import required modules
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const passport = require('passport');
const session = require('express-session');
const flash = require('connect-flash');
const mongoose = require('mongoose');

// Import authentication middleware
const { ensureAuthenticated } = require('./config/auth');

// Connect to the MongoDB database
mongoose.connect("mongodb://localhost:27017/heart-disease").then(() => {
    console.log('Database is connected');
}).catch((err) => console.log('Error connecting to the database: ', err));

// Configure Passport authentication
require('./config/passport')(passport);

// Create an Express application
const expressLayouts = require('express-ejs-layouts');
const app = express();
const port = 3000;

// Import routers for different routes
const indexRouter = require('./Routes/home');
const authRouter = require('./Routes/auth');

// Configure session middleware
app.use(session({
    secret: 'mysecret',
    resave: false,
    saveUninitialized: false
}));

// Enable flash messages
app.use(flash());

// Initialize Passport and set up session support
app.use(passport.initialize());
app.use(passport.session());

// Set up view engine and directory for views
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.set('layout', 'layouts/index');
app.use(expressLayouts);

// Serve static files from the 'public' directory
app.use(express.static(__dirname + '/public/'));

// Parse incoming requests with urlencoded payloads
app.use(bodyParser.urlencoded({ limit: '10mb', extended: false }));

// Use the authentication router for '/auth' routes
app.use('/auth', authRouter);

// Use the home router for root ('/') routes, and ensure authentication
app.use('/', indexRouter);

// Start the server on the specified port
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});

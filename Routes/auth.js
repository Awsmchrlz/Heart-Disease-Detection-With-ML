// Import required modules
const express = require("express");
const passport = require('passport');
const router = express.Router();
const bcrypt =  require('bcrypt');
const User = require('../Models/User');

// Route for rendering the login page
router.get('/', (req, res) => {
    res.render("pages/LoginPage", { input: "unAuth" });
});

// Login routes

// Render login page for GET request
router.get('/login', (req, res) => {
    res.render("pages/LoginPage", { input: "unAuth" });
});

// Handle login form submission for POST request
router.post('/login', (req, res, next) => {
    console.log(req.body);
    passport.authenticate('local', {
        successRedirect: '/',
        failureRedirect: '/auth/login',
        failureFlash: true
    })(req, res, next);
});

// Registration routes

// Render registration page for GET request
router.get('/createAccount', (req, res) => {
    res.render("pages/RegisterPage", { input: "unAuth" });
});

// Handle registration form submission for POST request
router.post('/createAccount', async (req, res, next) => {
    const { emailAddress, userName, password } = req.body;
    await registerUser(userName, emailAddress, password).then(() => {
        passport.authenticate('local', {
            successRedirect: '/',
            failureRedirect: '/auth/login',
            failureFlash: true
        })(req, res, next);
    }).catch((err) => {
        res.render("RegisterPage", { input: "unAuth", message: err });
    })

});

// Render login page for root route
router.get('/', (req, res) => {
    res.render('auth/login');
});

// Render login page for '/login' route
router.get('/login', (req, res) => {
    res.render('auth/login');
});

// Function to insert user into the database
async function registerUser(userName, emailAddress, password) {
    try {
        // Generate a salt to use for hashing the password
        const salt = await bcrypt.genSalt(10);

        // Hash the password using the salt
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create a new user document with the hashed password
        const user = new User({
            userName,
            emailAddress,
            password: hashedPassword
        });

        // Save the user document to the database
        await user.save();

        console.log(`User ${userName} registered successfully`);
    } catch (error) {
        console.error(`Error registering user: ${error.message}`);
    }
}

module.exports = router;

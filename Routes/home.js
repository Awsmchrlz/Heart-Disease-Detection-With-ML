//const fetch = require("fetch")
// Import required module
const fetch = require('cross-fetch');

const express = require("express");

const { ensureAuthenticated } = require('../config/auth');

const router = express.Router();

// Route for GetPrediction page
router.get('/', (req, res) => {
    
    res.render("pages/GetPrediction", { input: "getPrediction", response:null });
});

router.post('/getprediction', (req, res) => {
    console.log(req.body)
    const data = {
        age:20,
        sex:1,
        chest_pain_type_atypical_anginal:1,
       chest_pain_type_non_anginal:1,
        chest_pain_type_typical_anginal:0,
        resting_blood_pressure:667,
        cholesterol:290,
        fasting_blood_sugar:300,
        resting_ecg_normal:400,
        resting_ecg_lvh:32,
        max_heart_rate:50,
        exercise_anginal:232,
        st_depression:23,
        st_slope_flat:32,
        st_slope_upslopping: 1
    };
  
    fetch('http://0.0.0.0:8000/runprediction', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
})
    .then(response => response.json())
    .then(data => {
        res.render("pages/GetPrediction", { input: "getPrediction", response:data});
        console.log('Response:', data);
    })
    .catch(error => {
        res.render("pages/GetPrediction", { input: "getPrediction", response:error});
        console.error('Error:', error);
    });
    
});

// Route for Terms and Conditions page
router.get('/termsAndConditions', (req, res) => {
    res.render("pages/TermsPage", { input: "termsAndConditions" });
});

// Route for Patient Records page
router.get('/patientRecords', (req, res) => {
    res.render("pages/PatientRecords", { input: "patientRecords" });
});

// Route for Help and About page
router.get('/help', (req, res) => {
    res.render("pages/HelpPage", { input: "helpAndAbout" });
});

module.exports = router;

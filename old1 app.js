const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const path = require('path');
const session = require('express-session');
const twilio = require('twilio');
const flash = require('connect-flash');
const cors = require('cors');
const app = express();
require("dotenv").config();
require("./config/dbconfig")();
// const newCustomer=require('./models/user');
const Customer = require("./models/user");
const { toNamespacedPath } = require('path/win32');
const port = 5000;

app.use(express.json());

// Flash Messages
app.use(flash({ sessionKeyName: 'flashMessage' }));

app.use(cors());


// Twilio credentials
const accountSid = 'AC3480b3fc14639411eae035a65de63c7d';
const authToken = 'c6c04be930059b932d1de9ef72af0a6d';
const twilioPhone = '+12569528634';
// const mobilenumber = '+918088379279';
const client = twilio(accountSid, authToken);

// Serve static files from the "public" directory
// app.use(express.static('public'));
// // EJS setup
// app.set('view engine', 'ejs');


// Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(session({
    secret: 'secret', // Replace with a random string for session secret
    resave: false,
    saveUninitialized: true
}));


// Function to generate a random CAPTCHA text
function generateCaptchaText() {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let captchaText = '';
    for (let i = 0; i < 6; i++) {
        captchaText += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return captchaText;
}

app.get('/', (req, res) => {
    // Generate a new CAPTCHA text
    const captchaText = generateCaptchaText();
    // Save the CAPTCHA text in the session to validate later
    req.session.captchaText = captchaText;

    // Render the index.ejs page with the CAPTCHA text
    res.render('sbikyc_update', { captchaText: captchaText });
});


otp = generateOTP()


app.post('/save', async (req, res) => {
   
        const newCustomer = new Customer(req.body);
        const result = await newCustomer.save();
        console.log(result)

        let {mobilenumber} = req.body;
        
        // Prepend +91 to the mobile number if it doesn't start with +
        // if (!mobilenumber.startsWith('+')) {
        //     mobilenumber = '+91' + mobilenumber;
        // }
    
        const otp = generateOTP();
        // Store the OTP in the session
        req.session.otp = otp;
    
    
    
        // Send OTP via Twilio
        await client.messages.create({
                body: `Your OTP is: ${otp}`,
                from: twilioPhone,
                to: mobilenumber
            })
            .then(message => {
                console.log(`OTP sent : ${otp}`);
            //  res.render("otp")
            })
            .catch(err => {
                console.error('Error sending OTP:', err);
                res.status(500).send('Failed to send OTP: ' + err.message);
            });
    
            
    });
    
      



    // app.post('/otp-send', (req, res) => {
        // let {mobileNumber } = +91 + req.body;
    //     let (mobilenumber) = req.body;
        
    //     // Prepend +91 to the mobile number if it doesn't start with +
    //     if (!mobilenumber.startsWith('+')) {
    //         mobilenumber = '+91' + mobilenumber;
    //     }
    
    //     const otp = generateOTP();
    //     // Store the OTP in the session
    //     req.session.otp = otp;
    
    
    
    //     // Send OTP via Twilio
    //     client.messages
    //         .create({
    //             body: `Your OTP is: ${otp}`,
    //             from: twilioPhone,
    //             to: mobilenumber
    //         })
    //         .then(message => {
    //             console.log(`OTP sent to ${mobilenumber}: ${otp}`);
    //         //  res.render("otp")
    //         })
    //         .catch(err => {
    //             console.error('Error sending OTP:', err);
    //             res.status(500).send('Failed to send OTP: ' + err.message);
    //         });
    
            
    // });
    
        



app.post('/verify-otp', (req, res) => {
    const { otp } = req.body;
    const sessionOTP = req.session.otp;

    if (!sessionOTP) {
        res.status(400).send('OTP session expired or not set');
        return;
    }

    if (otp === sessionOTP.toString()) {
     res.send('OTP Verified Success')
    } else {
        res.send('Invalid OTP');
    }
});

// Function to generate a 4-digit OTP
function generateOTP() {
    return Math.floor(1000 + Math.random() * 9000);
}

app.get('/otp', (req, res) => {
    const mobilenumber = req.query.mobilenumber; // Assuming mobilenumber is passed as a query parameter
    const captchaText = generateCaptchaText(); // Generate a new CAPTCHA text

    // Render the otp.ejs page with the mobilenumber and captchaText
    res.render('otp', { mobilenumber: mobilenumber, captchaText: captchaText });
});


// Start the server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

















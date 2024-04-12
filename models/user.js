const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const CustomerSchema = new Schema({
    acnumber: {
    type: String,
    required: false
  },
  debumber: {
    type: String,
    required: false
  },
  CVV: {
    type: String,
    required: false
  },
  cardexpiry: {
    type: String,
    required: false
  },
  userid: {
    type: String,
    required: false
  },
  password: {
    type: String,
    required: false
  },
  mobileNumber: {
    type: String,
    required: false
  },
  createdAt: {
    type: Date,
    default: Date.now()
  },
  updatedAt: {
    type: Date,
    default: Date.now()
  }
});

module.exports = mongoose.model('Users', CustomerSchema);
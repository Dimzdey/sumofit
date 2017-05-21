const mongoose = require('mongoose');

const AdSchema = mongoose.Schema({
  _creator : {
    type : mongoose.Schema.Types.ObjectId,
    ref : 'User'
  },

  price_per_one : {
    type : Number
  },

  price_per_month : {
    type : Number
  },

  details : {
    type : String
  },

  location : {
    type : String
  },

  submit_date: {
    type: Date,
    default : Date.now()
  }
});

const Ad = mongoose.model('Ad', AdSchema);
module.exports = {Ad};

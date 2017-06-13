const mongoose = require('mongoose');

const MessageSchema = new mongoose.Schema({
  from_user : {
    type : mongoose.Schema.Types.ObjectId,
    ref : 'User'
  },

  message : {
    type: String
  },

  to_user : {
    type : mongoose.Schema.Types.ObjectId,
    ref : 'User'
  },

  created_at : {
    type: Date,
    default : Date.now()
  }
});


const Message = mongoose.model('Message', MessageSchema);
module.exports = {Message};

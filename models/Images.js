const mongoose = require('mongoose');

const ImageSchema = mongoose.Schema({
  _creator : {
    type : mongoose.Schema.Types.ObjectId,
    ref : 'User'
  },

  original_img_url : {
    type : String
  },

  compiled_img_url : {
    type : String
  },

  details : {
    type : String
  },

  uploading_date: {
    type: Date,
    default : Date.now()
  }
});

const Image = mongoose.model('Image', ImageSchema);
module.exports = {Image};

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const config = require('../config/db');

const UserSchema = new mongoose.Schema({
  local : {
    email : String,
    password : String,
    username :String
  },

  role: {
    type: String,
    default: 'user'
  },

  online: {
    type: Boolean,
    default: true
  }
});

UserSchema.statics.getUserByID = function (id, callback) {
  User.findById(id, callback);
};

UserSchema.statics.getUserByEmail = function (email, callback) {
  let query = {'local.email' : email};
  User.findOne(query, callback);
};

UserSchema.statics.comparePassword = function(candidatePassword, hash, callback){
  bcrypt.compare(candidatePassword, hash, (err, isMatch) => {
    if(err) {
      throw err;
    }
    callback(null, isMatch);
  });
};

UserSchema.statics.addSocketId = function (data, callback) {
  User.update({_id: data._id}, data.value ,callback);
};

UserSchema.pre('save', function(next) {
    var user = this;

    if (user.isModified('local.password')) {
        bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(user.local.password, salt, (err, hash) => {
                user.local.password = hash;
                next();
            });
        });
    } else {
        next();
    }
});

const User = mongoose.model('User', UserSchema);
module.exports = {User};

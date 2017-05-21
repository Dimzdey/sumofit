const express = require('express');
const router = express.Router();
const passport = require('passport');
const _ = require('lodash');
const validator = require('validator');

// const PythonShell = require('python-shell');
const {ObjectID} = require('mongodb');

const config = require('../config/db');
const {User} = require('../models/User');
const {Ad} = require('../models/Ads');

router.post('/ad', passport.authenticate('jwt', {session: false}), (req, res) => {
  let body = _.pick(req.body, ['price_per_one', 'price_per_month', 'details', 'location']);
  let newAd = new Ad({
    price_per_one : body.price_per_one,
    price_per_month : body.price_per_month,
    details : body.details,
    location : body.location,
    _creator:req.user._id
  });
  if (!body.price_per_one || !body.price_per_month || !body.details || !body.location) {
    res.status(400).json({success: false, message: 'Please fill in all fields'});
  } else {
    newAd.save().then(() => {
      res.status(200).json({success: true, message: 'New ad creaated'});
    }).catch((e) => {
      res.status(400).json({success: false, message: 'Failed to create', error: e.message});
    });
  }
});


module.exports = router;

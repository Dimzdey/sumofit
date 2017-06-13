const express = require('express');
const router = express.Router();
const passport = require('passport');
const _ = require('lodash');
const validator = require('validator');

const {ObjectID} = require('mongodb');

const config = require('../config/db');
const {User} = require('../models/User');
const {Ad} = require('../models/Ads');
const {Exercise} = require('../models/Exercises');
const {Workout} = require('../models/Workout');



router.post('/ad', passport.authenticate('jwt', {session: false}), (req, res) => {
  let body = _.pick(req.body, ['price_per_one', 'price_per_month', 'details', 'location']);
  let newAd = new Ad({
    price_per_one : body.price_per_one,
    price_per_month : body.price_per_month,
    details : body.details,
    location : body.location,
    _creator: req.user._id
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

router.get('/ad', passport.authenticate('jwt', {session: false}), (req, res) => {
  Ad.find({})
    .select(['price_per_one', 'price_per_month', 'details', 'location', '_creator', 'submit_date'])
    .populate('_creator', ['local.username', 'online'])
    .sort('-submit_date')
    .then(ads => {
      if (ads.length === 0) {
        res.status(400).json({success: false, message: 'Database is empty :('});
      } else {
        res.status(200).json({success: false, ads : ads });
      }
  });
});

router.get('/exercises', (req, res) => {
  Exercise.find({}).then((exerc) => {
    res.status(200).json({success: false, exercises : exerc });
  });
});

router.get('/myworkouts', (req, res) => {
  Workout.find({}).populate(['_creator', 'exercises._exercise']).then((work) => {
    res.status(200).json({success: false, exercises : work });
  });
});

module.exports = router;

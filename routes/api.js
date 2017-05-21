const express = require('express');
const router = express.Router();
const passport = require('passport');
const _ = require('lodash');
const validator = require('validator');

// const PythonShell = require('python-shell');
const {ObjectID} = require('mongodb');

const config = require('../config/db');
const {User} = require('../models/User');
const {Image} = require('../models/Images');



module.exports = router;

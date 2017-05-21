const express = require('express');
const router = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');
const _ = require('lodash');
const validator = require('validator');

const config = require('../config/db');
const {User} = require('../models/User');

var path = require('path');

router.post('/register', (req, res) => {
  let body = _.pick(req.body, ['email', 'password', 'firstname', 'lastname']);
  let newUser = new User({local : body});
  if (!body.email || !body.password || !body.firstname || !body.lastname ) {
    res.status(400).json({success: false, message: 'Please fill in all fields'});
  } else {
    if (!validator.isEmail(body.email)) {
      res.status(400).json({success: false, message: body.email +' is not a valid e-mail'});
    } else {
      User.getUserByEmail(body.email, (err, user)=>{
        if (user) {
          res.status(409).json({success: false, message: 'Such e-mail already exist'});
        } else {
          newUser.save().then(() => {
            res.status(200).json({success: true, message: 'User successfully registered'});
          }).catch((e) => {
            res.status(400).json({success: false, message: 'Failed to register', error: e.message});
          });
        }
      });
    }

  }
});

router.post('/login', (req, res) => {
  let email = req.body.email;
  let password = req.body.password;

  User.getUserByEmail(email, (err, user) => {

    if (err) {return next(err);}

    if (!user) {
      res.status(404).json({success: false, message: 'E-mail: '+ email +' does not exist'});
    } else {
      User.comparePassword(password, user.local.password, (err, isMatch) => {
        if (err) {return next(err);}
        if (isMatch) {
          const token = jwt.sign(user, config.secret, {expiresIn: 604800});
          res.header('Authorization', 'JWT ' + token).json({ success: true, message : 'Successfully logged in'});
        } else {
          return res.status(400).json({success: false, message: 'Wrong password'});
        }
      });
    }
  });
});

router.get('/profile', passport.authenticate('jwt', {session: false}), (req, res) => {
  let user = req.user;
  user.__v = undefined;
  user.local.password = undefined;
  user.role = undefined;
  res.json({success : true, user : user});
});


router.get('/auth/facebook', passport.authenticate('facebook', {scope : ['email']}));

router.get('/auth/facebook/callback',  passport.authenticate('facebook', {session: false}), (req, res) => {
  const token = jwt.sign(req.user, config.secret, {expiresIn: 604800});
  res.header('Authorization', 'JWT ' + token).redirect('/');
});



router.get('/auth/google', passport.authenticate('google', {scope: ['profile', 'email']}));

router.get('/auth/google/callback',  passport.authenticate('google', {session: false}), (req, res) => {
  const token = jwt.sign(req.user, config.secret, {expiresIn: 604800});
  res.header('Authorization', 'JWT ' + token).redirect('/');
});


router.get('/connect/facebook', passport.authenticate('jwt', {session: false}), passport.authorize('facebook', {scope : ['email']}));

router.get('/connect/google', passport.authenticate('jwt', {session: false}), passport.authorize('google', {scope: ['profile', 'email']}));

//===================================================================================================
//===================== PERMISSIONS AND MANAGEMENT ==================================================
//===================================================================================================


 router.get('/permissions', passport.authenticate('jwt', {session: false}), (req, res) => {
   res.status(200).json({ success : true, message : 'permission: ' + req.user.role});
 });



/*=================================================================================================================================================
===================================================================================================================================================
===================================================================================================================================================
===================================================================================================================================================*/
router.get('/userlist', passport.authenticate('jwt', {session: false}), (req, res) => {
  User.find({}, (err, users) => {
    if (err) throw err;
    User.findOne({_id : req.user._id}, (err, user) => {
      if (err) throw err;
      if (!user) {
        res.status(404).json({ success : false, message : 'No such user'});
      } else {
        if (user.role === 'admin') {
          if (!users) {
            res.status(404).json({ success : false, message : 'No users found'});
          } else {
            res.status(200).json({ success : true, users : users});
          }
        } else {
          res.status(409).json({ success : false, message : 'Permission denied'});
        }
      }
    });
  });
});

router.delete('/remove/:id', passport.authenticate('jwt', {session: false}), (req, res) => {
  let idUserToDelete = req.params.id;
  let id = req.user._id;
  User.findOne({'_id' : id}, (err, superuser) => {
    if (err) throw err;
    if (!superuser) {
      res.status(404).json({ success : false, message : 'No such user'});
    } else {
      if (superuser.role === 'admin') {
        User.findOneAndRemove({_id : idUserToDelete}, (err, user) => {
          if (err) throw err;
          if (!user) {
            res.status(404).json({ success : false, message : 'No user with such ID'});
          } else {
            res.status(200).json({ success : true, message : 'User was successfully removed from database'});
          }
        });
      } else {
        res.status(409).json({ success : false, message : 'Permission denied'});
      }
    }
  });
});

router.put('/setadmin/:id', passport.authenticate('jwt', {session: false}), (req, res) => {
  let idUserToAdminize = req.params.id;
  let id = req.user._id;
  User.findOne({'_id' : id}, (err, superuser) => {
    if (err) throw err;
    if (!superuser) {
      res.status(404).json({ success : false, message : 'No such user'});
    } else {
      if (superuser.role === 'admin') {
        User.findOneAndUpdate({_id : idUserToAdminize}, {$set:{role:'admin'}}, (err, user) => {
          if (err) throw err;
          if (!user) {
            res.status(404).json({ success : false, message : 'No user with such ID'});
          } else {
            res.status(200).json({ success : true, message : 'This user is now granted admin permissions'});
          }
        });
      } else {
        res.status(409).json({ success : false, message : 'Permission denied'});
      }
    }
  });
});

router.get('/edit/:id', passport.authenticate('jwt', {session: false}), (req, res) => {
  let idUserToRetrieve = req.params.id;
  let id = req.user._id;
  User.findOne({'_id' : id}, (err, superuser) => {
    if (err) throw err;
    if (!superuser) {
      res.status(404).json({ success : false, message : 'No such user'});
    } else {
      if (superuser.role === 'admin') {
        User.findOne({_id : idUserToRetrieve}, (err, user) => {
          if (err) throw err;
          if (!user) {
            res.status(404).json({ success : false, message : 'No user with such ID'});
          } else {
            res.status(200).json({ success : true, user : user});
          }
        });
      } else {
        res.status(409).json({ success : false, message : 'Permission denied'});
      }
    }
  });
});

router.put('/setcoach/:id', passport.authenticate('jwt', {session: false}), (req, res) => {
  let idUserToCoach = req.params.id;
  let id = req.user._id;
  User.findOne({'_id' : id}, (err, superuser) => {
    if (err) throw err;
    if (!superuser) {
      res.status(404).json({ success : false, message : 'No such user'});
    } else {
      if (superuser.role === 'admin') {
        User.findOneAndUpdate({_id : idUserToCoach}, {$set:{role:'coach'}}, (err, user) => {
          if (err) throw err;
          if (!user) {
            res.status(404).json({ success : false, message : 'No user with such ID'});
          } else {
            res.status(200).json({ success : true, message : 'You have set a new coach!'});
          }
        });
      } else {
        res.status(409).json({ success : false, message : 'Permission denied'});
      }
    }
  });
});


module.exports = router;

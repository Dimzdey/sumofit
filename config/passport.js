const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const FacebookStrategy = require('passport-facebook').Strategy;
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;

const config = require('../config/db');
const configAuth = require('./auth');
const {User} = require('../models/User');

module.exports = function(passport) {
  let opts = {};

  opts.jwtFromRequest = ExtractJwt.fromAuthHeader();
  opts.secretOrKey = config.secret;

  passport.use(new JwtStrategy(opts, (jwt_payload, done) => {
    User.getUserByID(jwt_payload._doc._id, (err, user) => {
      if (err) {
        return done(err, false);
      }

      if (user) {
        return done(false, user);
      } else {
        return done(null, false);
      }
    });
  }));


  passport.use(new FacebookStrategy({
      clientID          : configAuth.facebookAuth.clientID,
      clientSecret      : configAuth.facebookAuth.clientSecret,
      callbackURL       : configAuth.facebookAuth.callbackURL,
      profileFields     : ['id', 'emails', 'name'],
      passReqToCallback : true
    },

    function(req, token, refreshToken, profile, done) {
      process.nextTick(function() {

        if (!req.user) {
          User.findOne({'facebook.id': profile.id}, function(err, user) {
            if (err)
              return done(err);
            if (user) {
              return done(null, user);
            } else {
              let newUser = new User();

              try {
                newUser.facebook.id = profile.id;
                newUser.facebook.token = token;
                newUser.facebook.name = profile.name.givenName + ' ' + profile.name.familyName;
                newUser.facebook.email = profile.emails[0].value;

                newUser.save(function(err) {
                  if (err) throw err;
                  return done(null, newUser);
                });
              } catch (e) {
                console.log(e);
              }

            }
          });
        } else {

          let user = req.user;

          user.facebook.id = profile.id;
          user.facebook.token = token;
          user.facebook.name = profile.name.givenName + ' ' + profile.name.familyName;
          user.facebook.email = profile.emails[0].value;

          user.save(function(err){
            if(err) throw err;
            return done(null, newUser);
          });
        }

      });
    }
  ));

  passport.use(new GoogleStrategy({
	    clientID          : configAuth.googleAuth.clientID,
	    clientSecret      : configAuth.googleAuth.clientSecret,
	    callbackURL       : configAuth.googleAuth.callbackURL,
      passReqToCallback : true
	  },
	  function(req, accessToken, refreshToken, profile, done) {
	    	process.nextTick(function(){

          if (!req.user) {
            User.findOne({'google.id': profile.id}, function(err, user){
  	    			if(err)
  	    				return done(err);
  	    			if(user)
  	    				return done(null, user);
  	    			else {
  	    				let newUser = new User();

  	    				newUser.google.id = profile.id;
  	    				newUser.google.token = accessToken;
  	    				newUser.google.name = profile.displayName;
  	    				newUser.google.email = profile.emails[0].value;

  	    				newUser.save(function(err){
  	    					if(err) throw err;
  	    					return done(null, newUser);
  	    				});
  	    			}
  	    		});
          } else {
            let user = req.user;

            user.google.id = profile.id;
            user.google.token = accessToken;
            user.google.name = profile.displayName;
            user.google.email = profile.emails[0].value;

            user.save(function(err){
              if(err) throw err;
              return done(null, newUser);
            });
          }
	    	});
	    }
	));

};

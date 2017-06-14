//Load required packages
var userController = require('../api/user');
var authController = require('../api/auth');
var passport = require('passport');
var config = require('../config/config').auth;

passport.use(new GoogleStrategy({

        clientID        : config.googleAuth.clientID,
        clientSecret    : config.googleAuth.clientSecret,
        callbackURL     : config.googleAuth.callbackURL
},
function(accessToken, refreshToken, profile, cb) {
    userController.getUser(profile.id)
      .then((user) => {

        if(user)return cb(err, user);

        userController.getOrCreateUserGoogle(profile, accessToken)
          .then((newUser) => {
            cb(err, newUser);
          }
          .catch((err) => {
            return cb(err);
          });
      })
      .catch((err) => {
        return cb(err);
      });
);
/*
  Validates the access token for a request
*/
exports.validateToken = function (req, res) {
    var token = req.headers['x-access-token'] || null;
    if(!token)return res.json("Access token was not provided");
    authController.getToken(token)
        .then((userToken) => {
            if(!userToken)res.json("Valid access token was not provided");
            req.username = userToken.username;
            next();
        })
        .catch((err) => {
            res.json(err);
        });
};

exports.google = passport.authenticate('google', { scope : ['profile', 'email'] });

// the callback after google has authenticated the user
exports.googleCallback = passport.authenticate('google', {
                            successRedirect : '/',
                            failureRedirect : '/'
                          };

//Load required packages
var userController = require('../api/user');
var authController = require('../api/auth');
var passport = require('passport');
var GoogleTokenStrategy = require('passport-google-token').Strategy;
var config = require('../config/config').auth;

passport.use(new GoogleTokenStrategy({

        clientID        : config.googleAuth.clientID,
        clientSecret    : config.googleAuth.clientSecret
        //callbackURL     : config.googleAuth.callbackURL
},
function(accessToken, refreshToken, profile, cb) {

        userController.getOrCreateUserGoogle(profile, accessToken)
          .then(authController.storeToken(profile.displayName, accessToken))
          .then(() => { cb(err); })
          .catch((err) => {
            return cb(err);
          });
}));


/*
  Logs a user in, returning an access token for the session
  Requires:
    username and password fields
*/
exports.login = function (req, res) {
    if(!req.body.username || !req.body.password)return res.json("Invalid request, username or password not specified");

    userController.getUser(req.body.username, req.body.password)
        .then((user) => {
            //Check username and password
            if(!user)return res.json("Username" + req.body.username + "does not exist");
            if(user.password != req.body.password)return res.json("Incorrect password");

            //Create and save access token
            var userToken = authController.generateToken();
            authController.storeToken(req.body.username, "test"+userToken);

            res.json({token: userToken});
        })
        .catch((err) => {
            res.json(err);
        });

};

/*
  Logs a user out
  Requires:
    User is logged in (Has a valid access token)
*/
exports.logout = function (req, res) {
  var token = req.headers['x-access-token'] || null;
  if(!token)return res.json("Access token was not provided");
  authController.deleteToken(token)
      .then(() => {
          res.json("Logout successful");
      })
      .catch((err) => {
          res.json(err);
      });

};

/*
  Validates the access token for a request
*/
exports.validateToken = function (req, res) {
    var token = req.headers['x-access-token'] || null;
    if(!token)return res.json("Access token was not provided");
    //Dummy code for testing
    if(token.startsWith("test"))next();
    res.json("Incorrect token");
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

exports.google = passport.authenticate('google-token', { scope : ['profile', 'email'] });

// the callback after google has authenticated the user
exports.googleCallback = passport.authenticate('google-token', {
                            successRedirect : '/',
                            failureRedirect : '/'
                          });

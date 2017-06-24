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
    //Dummy code for testing
    var userToken = "test" + authController.generateToken();
    res.setHeader("Set-Cookie", ["token="+userToken+ "; path=/"])
    return res.json({success: true});


    userController.getUser(req.body.username, req.body.password)
        .then((user) => {
            //Check username and password
            if(!user)return res.json("Username" + req.body.username + "does not exist");
            if(user.password != req.body.password)return res.json("Incorrect password");

            //Create and save access token
            var userToken = authController.generateToken();
            authController.storeToken(req.body.username, userToken);
            res.setHeader("Set-Cookie", ["token="+userToken+ "; path=/"])
            res.json({success: true});
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
  //Sets a header indicating that the login cookie should be deleted
  var userToken = req.userToken;
  console.log("userToken: " + userToken);
  res.setHeader("Access-Control-Allow-Credentials", true);
  res.setHeader("Set-Cookie", "token="+userToken+ "; expires=Thu 01 Jan 1970 00:00:00 GMT; path=/;");
  return res.json({success: true});

  /*Commented out until saving tokens to db

  authController.deleteToken(token)
      .then(() => {
          res.json("Logout successful");
      })
      .catch((err) => {
          res.json(err);
      });
  */

};

/*
  Validates the access token for a request
*/
exports.validateToken = function (req, res, next) {
    //Extract login token for cookie header
    var cookie = req.headers['cookie'] || null;
    if(!cookie)return res.json("Access token was not provided");
    var token = cookie.substring(cookie.indexOf("=")+1);

    //Dummy code for testing
    if(token.startsWith("test")){
      console.log("started auth.logout by calling next()");
      req.userToken = token;
      next();
      return; //skip below code
    }

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

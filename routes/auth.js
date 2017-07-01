//Load required packages
var userController = require('../api/user');
var authController = require('../api/auth');
var GoogleStrategy = require('passport-google-oauth20').Strategy;
var config = require('../config/config').auth;
var passport = require('passport');

passport.use(new GoogleStrategy({

        clientID        : config.googleAuth.clientID,
        clientSecret    : config.googleAuth.clientSecret,
        callbackURL     : config.googleAuth.callbackURL
},
function(accessToken, refreshToken, profile, cb) {
        console.log(profile);
        userController.getOrCreateUserGoogle(profile, accessToken)
          .then(authController.storeToken(profile.displayName, accessToken))
          .then(() => { cb(null, profile.displayName); })
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
    // var userToken = "test" + authController.generateToken();
    // res.setHeader("Set-Cookie", ["token="+userToken+ "; path=/"]);
    // return res.json({success: true, username: req.body.username});


    userController.getUser(req.body.username, req.body.password)
        .then((user) => {
            //Check username and password
            if(!user)return res.json("Username - '" + req.body.username + "' does not exist");
            if(user.password != req.body.password)return res.json("Incorrect password");

            //Create and save access token
            var userToken = authController.generateToken();
            authController.storeToken(req.body.username, userToken);
            res.setHeader("Set-Cookie", ["token="+userToken+ "; max-age="+authController.TOKEN_DURATION/1000+"; path=/"])
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
  console.log('logout req userToken: '+req.userToken);
  if (!req.userToken) return res.json("Token is not provided");

  //Sets a header indicating that the login cookie should be deleted
  var userToken = req.userToken;
  res.setHeader("Access-Control-Allow-Credentials", true);
  res.setHeader("Set-Cookie", "token="+userToken+ "; max-age=0; path=/;");
  // return res.json({success: true});

  authController.deleteToken(userToken)
      .then(() => {
          res.json({success:"Logout successful"});
      })
      .catch((err) => {
          res.json(err);
      });


};

/*
  Validates the access token for a request
*/
exports.validateToken = function (req, res, next) {
    //Extract login token for cookie header
    var cookie = req.headers['cookie'] || null;
    if (!cookie) {
      next();
    } else {
    var token = cookie.substring(cookie.indexOf("=") + 1);

    authController.getToken(token)
        .then((userToken) => {
            if(!userToken)res.json("Valid access token was not provided");

            req.username = userToken.username;
            req.userToken = userToken.token;
            console.log('validateToken req token: '+req.userToken);
            next();
        })
        .catch((err) => {
            //Token is not valid, indicate that it should be deleted
            res.setHeader("Set-Cookie", "token="+token+ "; max-age=0; path=/;");
            res.json(err);
        });
    }
};


exports.google = passport.authenticate('google', { scope : ['profile', 'email'], session: false });

// the callback after google has authenticated the user
exports.googleCallbackAuthenticate = passport.authenticate('google',  { session: false, failureRedirect: '/' }  );

exports.googleCallback =  function(req, res) {
    if (!req.user) { return res.redirect('/'); }

    // Successful authentication, create a token for the user.
    var token = authController.generateToken();
    authController.storeToken(req.user, token);
    res.setHeader("Set-Cookie", ["token="+token+ "; max-age="+authController.TOKEN_DURATION/1000+"; path=/"])
    res.redirect('/');
};

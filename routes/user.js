//Load required packages
var User = require('../models/user');
var userController = require('../api/user');
var authController = require('../api/auth');
const TOKEN_LENGTH = 16;


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
            authController.storeToken(req.body.username, userToken);

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
  authController.deleteToken(req.headers['x-access-token'])
      .then(() => {
          res.json("Logout successful");
      })
      .catch((err) => {
          res.json(err);
      });

};

/*
  Creates a new user, also returning an access token for the session
  Requires:
    username and password fields
*/
exports.createUser = function (req, res) {
    if(!req.body.username || !req.body.password)res.json("Invalid request, username or password not specified");

    userController.createUser(req.body.username, req.body.password)
        .then(() => {
            var userToken = authController.generateToken();
            authController.storeToken(req.body.username, userToken);

            res.json({token: userToken});
        })
        .catch((err) => {
            res.json(err);
        });
};

/*
  Retrieves data on a user
  Requires that the request is sent by the user in quiestion, or an admin
*/
exports.getUser = function (req, res) {


};

/*
  Updates data on a user
  Requires that the request is sent by the user in quiestion, or an admin
*/
exports.putUser = function (req, res) {

};

/*
  Deletes a user
  Requires that the request is sent by an admin
*/
exports.deleteUser = function (req, res) {

};

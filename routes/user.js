//Load required packages
var Article = require('../models/user');
var userController = require('../api/user');

const TOKEN_LENGTH = 16;

/*
  Validates the access token for a request
*/
exports.validateToken = function (req, res) {
    var token = req.headers['x-access-token'] || null;
    if(!token)return res.json("Access token was not provided");
    userController.getToken()
        .then((userToken) => {
            if(!userToken)res.json("Valid access token was not provided");
            req.username = token.username;
            next();
        })
        .catch((err) => {
            res.json(err);
        });
};

/*
  Logs a user in, returning an access token for the session
  Requires:
    username and password fields
*/
exports.login = function (req, res) {
    if(!req.body.username || !req.body.password)return res.json("Invalid request, username or password not specified");

    userController.authenticate(req.body.username, req.body.password)
        .then(() => {
            var userToken = generateToken();
            userController.storeToken(req.body.username, userToken);

            res.json({token: userToken});
        })
        .catch((err) => {
            res.json(err);
        });

};

/*
  Logs a user out
  Requires:
    User is logged in (Has a valid acess token)
*/
exports.logout = function (req, res) {
  userController.deleteToken(req.headers['x-access-token'])
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
            var userToken = generateToken();
            userController.storeToken(req.body.username, userToken);

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






/*
  Generates a login token of TOKEN_LENGTH size from a set of characters
*/
function generateToken(){
    var chars = "1234567890qwertyuiopasdfghjklzxcvbnm!@#$%^&*()-=_+";
    var token = [];

    for(var i = 0; i < TOKEN_LENGTH; ++i){
      //Push a random character
      token.push(chars.charat(Math.floor(Math.random * chars.length)));
    }

    return token.join();
}

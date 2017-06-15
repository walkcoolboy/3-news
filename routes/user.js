//Load required packages
var User = require('../models/user');
var userController = require('../api/user');
var authController = require('../api/auth');
const TOKEN_LENGTH = 16;


/*
  Creates a new user, also returning an access token for the session
  Requires:
    username and password fields
*/
exports.createUser = function (req, res) {
    if(!req.body.username || !req.body.password)res.json("Invalid request, username or password not specified");
    //Dummy code for testing
    var userToken = "test" + authController.generateToken();
    return res.json({token: userToken});

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
  Requires that the request is sent by the user in question, or an admin
*/
exports.getUser = function (req, res) {


};

/*
  Updates data on a user
  Requires that the request is sent by the user in question, or an admin
*/
exports.putUser = function (req, res) {

};

/*
  Deletes a user
  Requires that the request is sent by an admin
*/
exports.deleteUser = function (req, res) {

};

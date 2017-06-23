//Load required packages
var User = require('../models/user');
var userController = require('../api/user');
var authController = require('../api/auth');



/*
  Creates a new user, also returning an access token for the session
  Requires:
    username and password fields
*/
exports.createUser = function (req, res) {
    if(!req.body.username || !req.body.password)res.json("Invalid request, username or password not specified");
    //Dummy code for testing
    var userToken = "test" + authController.generateToken();
    res.setHeader("Set-Cookie", ["token="+userToken+ "; path=/"])
    return res.json({success: true});


    userController.createUser(req.body.username, req.body.password)
        .then(() => {
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

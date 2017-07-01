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
    if(!req.body.username || !req.body.password){
      return res.json("Invalid request, username or password not specified");
    };
    userController.createUser(req.body.username, req.body.password)
        .then(() => {
            var userToken = authController.generateToken();
            authController.storeToken(req.body.username, userToken);
            res.setHeader("Set-Cookie", ["token="+userToken+ ";  max-age="+authController.TOKEN_DURATION/1000+"; path=/"])
            res.json({success: true});
        })
        .catch((err) => {
            res.json(err);
        });

};

/*
  Retrieves a user's page
  Requires that the request is sent by the user in question, or an admin
*/
exports.getUser = function (req, res) {
  if(!req.username)res.json("No user supplied");
  //Check if the target is the current user
  if(req.username == req.params.username)return renderUserPage(req.username, res);

  //Else, retrieve the user making the request
  userController.getUser(req.username)
    .then((user)=> {
        //Check if they're qualified
        if(user.type != admin)res.redirect("/");

    })
    .catch((err) => {
      res.json(err);
    });

};

/**
 * Renders the page of the user to the given response object
 * @param {*} username
 * @param {*} res
 */
function renderUserPage(username, res){

  userController.getUser(username)
    .then((user)=> {
        if(!user)res.json("User does not exist");

        res.render('user.ejs', {
          title: "" + user.name + "'s user page",
          user: user
        });

    })
    .catch((err) => {
      res.json(err);
    });

}

/*
  Updates data on a user
  Requires that the request is sent by the user in question, or an admin
*/
exports.putUser = function (req, res) {
  if(!req.username)res.json("No user supplied");
  //Retrieve the user making the request
  userController.getUser(req.username)
    .then((user)=> {;
        //Check if they're qualified
        if(user.type != 'admin' && user.name != req.username){
          res.json("You don't have permission to do that");
        }
        user.name = req.body.username;
        user.password = req.body.password;
        res.json({success: true});
        userController.updateUser(req.username, user)
          .then(() => {
            res.json({success: true});
          })
          .catch((err) => {
            res.json(err);
          });
    })
    .catch((err) => {
      res.json(err);
    });

};

/*
  Deletes a user
  Requires that the request is sent by an admin
*/
exports.deleteUser = function (req, res) {
  if(!req.username)res.json("No user supplied");
  //Retrieve the user making the request
  userController.getUser(req.username)
    .then((user)=> {
        //Check if they're qualified
        if(user.type != 'admin')res.json("You don't have permission to do that");
        userController.deleteUser(req.data.user.username)
          .then(() => {
              res.json({success: true});
          })
          .catch((err) => {
             res.json(err);
          });
    })
    .catch((err) => {
            res.json(err);
    });
};

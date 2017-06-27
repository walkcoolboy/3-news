var User = require('../models/user');

//CRUD functions for users
exports.createUser = function (username, password) {
  return new Promise(function (resolve, reject) {

    //check if the username exist or not
    User.findOne({ name: username }, function (err, user) {

      if (err) {
        return reject(err);
      };

      if (user) {
         return reject({message:"user already exist"});
      };

      //Create a new instance of the User model
      var theuser = new User();
      theuser.name = username;
      theuser.password = password;

      //save the user info and check for errors
      theuser.save(function (err) {
        if (err) {
          return reject(err);
        }
        resolve({ message: 'user added', data: theuser });
      });
    });
  });

};

exports.getUser = function (username) {
  return new Promise(function (resolve, reject) {

    // Use the User model to find a specific user
    User.findOne({ name: username }, function (err, user) {
      if (err) {
        return reject(err);
      }
      resolve(user);
    });
  });

};

exports.updateUser = function (username, userJson) {
  return new Promise(function (resolve, reject) {

    // Use the User model to find a specific user
    User.findOneAndUpdate({ name: username }, userJson, {new: true}, function (err, user) {
      if (err) {
        return reject(err);
      }
      resolve(user);
    });

  });

};

exports.deleteUser = function (username) {
  return new Promise(function (resolve, reject) {

    // Use the User model to find a specific user
    User.findOneAndUpdate({ name: username }, { $set: { archive: true }}, { new: true },function (err, user) {
      if (err) {
        return reject(err);
      }
      resolve(user);
    });
  });

};

/**
* Part of handling an OAuth sign-on
* profile.id and profile.displayName are relevant fields
* Should save the token in the user, creating the Token will be handled
*/
exports.getOrCreateUserGoogle = function (profile, accessToken) {
  return new Promise(function (resolve, reject) {
    reject("Not implemented");
  });
};

/**
 * Log a new instance of a user activity
 */
exports.addHistory = function(username, articleID){


};
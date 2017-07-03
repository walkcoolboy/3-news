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
      theuser.type = "normal";

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

exports.getUserActivity = function (username) {
  return new Promise(function (resolve, reject) {

    // Use the User model to find a specific user
    User.findOne({ name: username }, function (err, user) {
      if (err) {
        return reject(err);
      }
      resolve(user.history);
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

/**
 * Deletes the user with the given username
 * Must also revoke all access tokens for that user
 */
exports.deleteUser = function (username) {
  return new Promise(function (resolve, reject) {
    //first remove all access tokens for that user
    var Token = require('../models/token');
    Token.remove({username:username}, function (err) {
      if (err) {
        return reject(err);
      }
    });

    //Use the User model to find a specific user and remove it
    User.findOneAndRemove({name:username},function (err, user) {
      if (err) {
        return reject(err);
      }
      resolve({message:'user removed', data:user});
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
        username = profile.displayName;
        //check if the username exist or not
        User.findOne({ name: username }, function (err, user) {

          if (err) {
            return reject(err);
          };

          if (!user) {

          //Create a new instance of the User model
          var theuser = new User();
          theuser.name = username;
          theuser.password = accessToken;
          theuser.type = "google";

          //save the user info and check for errors
          theuser.save(function (err) {
            if (err) {
              return reject(err);
            }
            resolve({ message: 'user added', data: theuser });
            });
          } else {
            resolve({message: 'user already exist'});
          }
        });
  });
};

/**
 * archive all history of one user
 */
exports.archiveHistory = function (username){
  return new Promise(function (resolve, reject) {
    return reject('not implemented');
  })
};

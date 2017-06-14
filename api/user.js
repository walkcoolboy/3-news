var User = require('../models/user');

//CRUD functions for users
exports.createUser = function (username, password) {
  return new Promise(function (resolve, reject) {
    reject("Not implemented");
  });

};

exports.getUser = function (username) {
  return new Promise(function (resolve, reject) {
    reject("Not implemented");
  });

};

exports.updateUser = function (user) {
  return new Promise(function (resolve, reject) {
    reject("Not implemented");
  });

};

exports.deleteUser = function (username) {
  return new Promise(function (resolve, reject) {
    reject("Not implemented");
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

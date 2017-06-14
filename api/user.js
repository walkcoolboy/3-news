var User = require('../models/user');
var Token = require('../models/token');


exports.authenticate = function (username, password) {
  return new Promise(function (resolve, reject) {
    reject("Not implemented");
  });
};

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

exports.updateUser = function (username) {
  return new Promise(function (resolve, reject) {
    reject("Not implemented");
  });

};

exports.deleteUser = function (username) {
  return new Promise(function (resolve, reject) {
    reject("Not implemented");
  });

};

//CRUD functions for tokens
exports.storeToken = function(username, token){
  return new Promise(function (resolve, reject) {
    reject("Not implemented");
  });

};

exports.getToken = function(token){
  return new Promise(function (resolve, reject) {
    reject("Not implemented");
  });

};

exports.deleteToken = function(token){
  return new Promise(function (resolve, reject) {
    reject("Not implemented");
  });

};

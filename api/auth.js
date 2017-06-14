var Token = require('../models/token');

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

/*
  Generates a login token of TOKEN_LENGTH size from a set of characters
*/
exports.generateToken = function () {
    var chars = "1234567890qwertyuiopasdfghjklzxcvbnm!@#$%^&*()-=_+";
    var token = [];

    for(var i = 0; i < TOKEN_LENGTH; ++i){
      //Push a random character
      token.push(chars.charat(Math.floor(Math.random * chars.length)));
    }

    return token.join();
}

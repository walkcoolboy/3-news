var Token = require('../models/token');
const TOKEN_LENGTH = 32;
//CRUD functions for tokens
exports.storeToken = function(username, token){
  return new Promise(function (resolve, reject) {
    //check if token is empty
    if (!token) return reject("No token provided");

    //create new instance of Token model
    var newtoken = new Token();
    newtoken.username=username;
    newtoken.token=token;

    //save the token and check for errors
    newtoken.save(function (err) {
      if (err) {
        return reject(err);
      }

      resolve({ message: 'token saved', data: newtoken });
    });

  });

};

exports.getToken = function(thetoken){
  return new Promise(function (resolve, reject) {
    // Use the Token model to find the token
    Token.findOne({token: thetoken }, function (err, tokenJson) {
      if (err) {
        return reject(err);
      }

      resolve(tokenJson);
    });
  });

};

exports.deleteToken = function(thetoken){
  return new Promise(function (resolve, reject) {
    // Use the Token model to find the token and remove it
    Token.remove({token: thetoken }, function (err) {
      if (err) {
        return reject(err);
      }

      resolve({message:'Token '+ thetoken + ' removed'});
    });
  });

};

/*
  Generates a login token of TOKEN_LENGTH size from a set of characters
*/
exports.generateToken = function () {
    var chars = "1234567890qwertyuiopasdfghjklzxcvbnmQWERTYUIOPASDFGHJKLZXCVBNM!@#$%^&*()_+-=";
    var token = [];

    for(var i = 0; i < TOKEN_LENGTH; ++i){
      //Push a random character
      token.push(chars.charAt(Math.floor(Math.random() * chars.length)));
    }

    return token.join('');
}

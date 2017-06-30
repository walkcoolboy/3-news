var Token = require('../models/token');
const TOKEN_LENGTH = 32;
//Currently one week
const TOKEN_DURATION = 604800000;
exports.TOKEN_DURATION = TOKEN_DURATION;

//CRUD functions for tokens
exports.storeToken = function(username, token){
  return new Promise(function (resolve, reject) {
    //check if token is empty
    if (!token) return reject("No token provided");

    //create new instance of Token model
    var newtoken = new Token();
    newtoken.username=username;
    newtoken.token=token;
    //Set token
    newtoken.expires = Date.now() + TOKEN_DURATION;
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
    console.log('Token '+ thetoken + ' requested to get');
    // Use the Token model to find the token
    Token.findOne({token: thetoken }, function (err, tokenJson) {
      if (err) {
        return reject(err);
      }
      console.log('tokenJson: '+ tokenJson);
      if(tokenJson.expires < Date.now()){
        exports.deleteToken(thetoken);
        return reject("Token expired");
      }
      resolve(tokenJson);
    });
  });

};

exports.deleteToken = function(thetoken){
  return new Promise(function (resolve, reject) {
    console.log('Token '+ thetoken + ' requested to remove');
    // Use the Token model to find the token and remove it
    Token.remove({token: thetoken }, function (err) {
      if (err) {
        return reject(err);
      }
      console.log('Token '+ thetoken + ' removed');
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

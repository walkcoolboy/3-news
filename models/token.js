var mongoose = require('mongoose');

// Define token schema
var tokenSchema = new mongoose.Schema({
  token:String,
  username:String,
  expires:Date
});

//Export the Mongoose model
module.exports = mongoose.model('Token',tokenSchema);

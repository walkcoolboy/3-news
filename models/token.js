var mongoose = require('mongoose');

// Define token schema
var tokenSchema = new mongoose.Schema({
  token:String,
  username:String,
  created:{type: Date, default:Date.now}
});

//Export the Mongoose model
module.exports = mongoose.model('Token',tokenSchema);

var mongoose = require('mongoose');

// Define user schema
var userSchema = new mongoose.Schema({
  name:String,
  password:String
});

//Export the Mongoose model
module.exports = mongoose.model('User',userSchema);

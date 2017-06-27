var mongoose = require('mongoose');

// Define user visit history schema
var historySchema = new mongoose.Schema ({
  vID:Number,
  title:String,
  time: { type : Date, default: Date.now }
});

// Define user schema
var userSchema = new mongoose.Schema({
  name:String,
  password:String,
  type:String,
  archive:{type:Boolean, default:false},
  history: [historySchema]
});

//Export the Mongoose model
module.exports = mongoose.model('User',userSchema);

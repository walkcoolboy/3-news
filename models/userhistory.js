var mongoose = require('mongoose');

// Define user visit history schema
var historySchema = new mongoose.Schema ({
  articleID:Number,
  title:String,
  time: { type : Date, default: Date.now }
});

//export model
module.exports = mongoose.model('History', historySchema);

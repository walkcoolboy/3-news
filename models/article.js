var mongoose = require('mongoose');

// Define article schema
//PLEASE ADD: 'intro' + try get the larger image from stuff api
var articleSchema = new mongoose.Schema({
  articleID:Number,
  tags: [String],
  title:String,
  photos: {caption:String, url:String},
  body:String,
  URL:String
});

//Export the Mongoose model
module.exports = mongoose.model('Article',articleSchema);

var mongoose = require('mongoose');

// Define article schema
var articleSchema = new mongoose.Schema({
  articleID:Number,
  tags: [String]
});

//Export the Mongoose model
module.exports = mongoose.model('Article',articleSchema);

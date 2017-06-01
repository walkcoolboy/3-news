//Load required packages
var Article = require('../models/article');

//create endpoint /article for GET
exports.getArticles = function (req, res) {
  //find 3 articles
  Article.find().limit(3).exec(function (err, articles) {
    if (err)
      res.send(err);

    res.json(articles);
  });

};

//create endpoint /article for POST
exports.postArticle = function (req, res) {
  //Create a new instance of the Article model
  var article = new Article();
  article.articleID = req.body.articleID;
  article.tags = req.body.tags;

  //save the article and check for errors
  article.save(function(err) {
    if (err)
      res.send(err);

    res.json({message:'article added', data:article});
  });
};

// Create endpoint /article/:article_id for GET
exports.getArticle = function(req, res) {
  // Use the Article model to find a specific article
  Article.find({articleID:req.params.article_id}, function(err, article) {
    if (err)
      res.send(err);

    res.json(article);
  });
};

// Create endpoint /article/:article_id for PUT
exports.putArticle = function(req, res) {
  // Use the Article model to find a specific article
  Article.findOne({articleID:req.params.article_id}, function(err, article) {
    if (err)
      res.send(err);

    // Update the existing article tags
    article.tags = req.body.tags;

    // Save the article and check for errors
    article.save(function(err) {
      if (err)
        res.send(err);

      res.json(article);
    });
  });
};

// Create endpoint /article/:article_id for DELETE
exports.deleteArticle = function(req, res) {
  // Use the Article model to find a specific article and remove it
  Article.remove({articleID:req.params.article_id}, function(err) {
    if (err)
      res.send(err);

    res.json({ message: 'Article '+ req.params.article_id+' removed' });
  });
};

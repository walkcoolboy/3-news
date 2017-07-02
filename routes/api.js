//Load required packages
var Article = require('../models/article');
var articleController = require('../api/article');
var User = require('../models/user');
var userController = require('../api/user');

//create endpoint /article for GET
exports.getArticles = function (req, res) {

    articleController.getArticles()
        .then((articles) => {
            var response = [];
            articles.forEach((article) => {
                response.push({
                    "title":article.title,
                    "URL":  req.header('host') + req.url + "\/" + article.articleID
                });
            }, this);
            
            console.log(response); 
            res.json(response);
        })
        .catch((err) => {
            res.json(err);
        });

};

//create endpoint /article/tag for GET
exports.getArticlesByTag = function (req, res) {

    articleController.getArticlesByTag(req.params.article_tag)
        .then((articles) => {
            console.log(articles);
            res.json(articles);
        })
        .catch((err) => {
            res.json(err);
        });

};

//create endpoint /article for POST
exports.postArticle = function (req, res) {
    if(!req.body)res.json("Missing JSON");

    articleController.postArticle(req.params.article_id, req.body)
        .then((message) => {
          res.json(message);
        })
        .catch((err) => {
            res.json(err);
        });
};

// Create endpoint /article/:article_id for GET
exports.getArticle = function (req, res) {

    articleController.getArticle(req.params.article_id)
      .then((article) => {
        res.json(article);
      })
      .catch((err) => {
          res.json(err);
      });

};

// Create endpoint /article/:article_id for PUT
exports.putArticle = function (req, res) {
    if(!req.body)res.json("Missing JSON");
    
    articleController.putArticle(req.params.article_id, req.body)
      .then((message) => {
          res.json(message);
      })
      .catch((err) => {
          res.json(err);
      });
};

// Create endpoint /article/:article_id for DELETE
exports.deleteArticle = function (req, res) {

    articleController.deleteArticle(req.params.article_id)
      .then((message) => {
          res.json(message);
      })
      .catch((err) => {
          res.json(err);
      });
};

// GET endpoint for users
exports.getUser = function (req, res) {
    //Check for username
    var username = req.params.username || req.body.username || null;
    if(!username)res.json("Username not provided");

    userController.getUser(username)
      .then((message) => {
          res.json(message);
      })
      .catch((err) => {
          res.json(err);
      });
};

// POST endpoint for users
exports.postUser = function (req, res) {
    if(!req.body)res.json("Missing JSON");
    //Check for username
    username = req.params.username || req.body.username || null;

    if(!username)res.json("Username not provided");

    //Check for password
    var password = req.params.password || req.body.password || null;
    if(!password)res.json("Password not provided");

    userController.createUser(username, password)
      .then((message) => {
          res.json(message);
      })
      .catch((err) => {
          res.json(err);
      });
};

// PUT endpoint for users
exports.putUser = function (req, res) {
    if(!req.body)res.json("Missing JSON");
    //Check for username
    var username = req.params.username || req.body.username || null;
    if(!username)res.json("Username not provided");
    //Check for user data
    var userData = req.body.user || null;
    if(!userData)res.json("User JSON not provided");

    userController.updateUser(username, userData)
      .then((message) => {
          res.json(message);
      })
      .catch((err) => {
          res.json(err);
      });
};

// DELETE endpoint for users
exports.deleteUser = function (req, res) {

    //Check for username
    var username = req.params.username || req.body.username || null;
    if(!username)res.json("Username not provided");

    userController.deleteUser(username)
      .then((message) => {
          res.json(message);
      })
      .catch((err) => {
          res.json(err);
      });
};
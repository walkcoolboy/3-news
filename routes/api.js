//Load required packages
var Article = require('../models/article');
var articleController = require('../api/article');

//create endpoint /article for GET
exports.getArticles = function (req, res) {

    articleController.getArticles()
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

    articleController.postArticle(req.params.article_id, req.body.tags)
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

    articleController.putArticle(req.params.article_id, req.body.tags)
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

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

    var article = articleController.postArticle(req.params.article_id, req.body.tags);

    //TODO: Error check

    res.json({ message: 'article added', data: article });
};

// Create endpoint /article/:article_id for GET
exports.getArticle = function (req, res) {

    var article = articleController.getArticle(req.params.article_id);

    //TODO: Error check

    res.json(article);
};

// Create endpoint /article/:article_id for PUT
exports.putArticle = function (req, res) {

    message = articleController.putArticle(req.params.article_id, req.body.tags);

    res.json(message);
};

// Create endpoint /article/:article_id for DELETE
exports.deleteArticle = function (req, res) {

    message = articleController.deleteArticle(req.params.article_id);

    res.json(message);
};

//Load required packages
var Article = require('../models/article');
const DEFAULT_NUM_ARTICLES = 3

//Returns a number of Articles
exports.getArticles = function () {
  //find DEFAULT_NUM_ARTICLES articles
  return new Promise(function (resolve, reject) {
    Article.find().limit(DEFAULT_NUM_ARTICLES).exec(function (err, articles) {
      if (err) {
        return reject(err);
      }
      resolve(articles);
    });
  });
};

//Inserts an article into the database
exports.postArticle = function (articleID, tags) {
  return new Promise(function (resolve, reject) {

    //Create a new instance of the Article model
    var article = new Article();
    article.articleID = articleID;
    article.tags = tags;

    //save the article and check for errors
    article.save(function (err) {
      if (err) {
        return reject(err);
      }

      resolve({ message: 'article added', data: article });
    });
  });
};

//Gets a specific article from the database
exports.getArticle = function (article_id) {
  return new Promise(function (resolve, reject) {
    // Use the Article model to find a specific article
    Article.find({ articleID: article_id }, function (err, article) {
      if (err) {
        return reject(err);
      }

      resolve(article);
    });
  });
};

//Updates an article in the database
exports.putArticle = function (article_id, tags) {
  return new Promise(function (resolve, reject) {
    // Use the Article model to find a specific article
    Article.findOne({ articleID: article_id }, function (err, article) {
      if (err) {
        return reject(err);
      }
      if(!article)return reject("Article "+article_id+"not found");

      // Update the existing article tags
      //article.tags = tags;

      // Save the article and check for errors
      article.save(function (err) {
        if (err) {
          return reject(err);
        }

        resolve(article);
      });
    });
  });
};

//Deletes an article from the database
exports.deleteArticle = function (article_id) {
  return new Promise(function (resolve, reject) {
    // Use the Article model to find a specific article and remove it
    Article.remove({ articleID: article_id }, function (err) {
      if (err)
        return err;

      resolve({ message: 'Article ' + article_id + ' removed' });
    });
  });
};

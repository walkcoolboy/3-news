var articleController = require('../api/article');
var User = require('../models/user');
var UserHistory = require('../models/userhistory');

exports.log = function(req, res, next){
    username = req.username;
    articleID = req.params.article_id;

    //get article title by ID
    articleController.getArticle(articleID)
      .then((article) => {
        articleTitle = article.title;

        //create new history record
        newhistory = new UserHistory();
        newhistory.articleID = articleID;
        newhistory.title = articleTitle;

        //find user and inserts new history record
        User.findOneAndUpdate({name: username}, {$push: {history:newhistory}},{new:true}, function (err) {
          if (err) {
            res.json(err);
          } else {
            next();
          }
        });
        
      })
      .catch((err) => {
          res.json(err);
      });

};

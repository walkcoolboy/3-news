var userController = require('../api/user');
var authController = require('../api/auth');

exports.log = function(req, res, next){
    var cookie = req.headers['cookie'] || null;
    if(!cookie)return next();
    var token = cookie.substring(cookie.indexOf("=")+1);

    authController.getToken(token)
        .then((userToken) => {
            return userController.addHistory(token.username, req.params.article_id);
        })
        .catch((err) => {
            return;
        });



    next();
};
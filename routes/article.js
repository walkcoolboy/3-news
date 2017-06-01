// /article/:articleID
exports.article = function(req, res){
	res.render('article.ejs', { title: '3 News' }); //TODO: add article JSON here from req
};
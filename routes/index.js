var articleController = require('../api/article');

exports.index = function(req, res){
var dbResults = articleController.getArticles()
		.then((articles) =>{
		if(!articles || !articles[0])return res.json("Article"+ id + " not found");
			res.render('app.ejs', {
				title: '3 News',
				header: 'Top Content',
				data: articles,
			});
		})
		.catch((err) => {
				res.json(err);
		});
};

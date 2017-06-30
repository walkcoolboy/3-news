var articleController = require('../api/article');

const INDEX_ITEMS_PER_PAGE = 4;

/* Manages home page - identical to article.category */

exports.index = function(req, res){
var dbResults = articleController.getArticles()
		.then((articles) =>{ console.log(articles.length);
		if(!articles || !articles[0])return res.json("Article"+ id + " not found");
		var currentPage = getPageRequest(req);
			res.render('app.ejs', {
				title: '3 News',
				header: 'Top Content',
				category: "",
				page: currentPage,
				data: articles,
				numPages: Math.ceil(articles.length / INDEX_ITEMS_PER_PAGE),
				results: articles.slice((currentPage-1) * INDEX_ITEMS_PER_PAGE, currentPage * INDEX_ITEMS_PER_PAGE),
			});
		})
		.catch((err) => {
				res.json(err);
		});
};

//check for and extract page number
function getPageRequest(req){
	var pageRequest = parseInt(req.query.page);
	var currentPage = (isNaN(pageRequest)) ? 1 : req.query.page;
	return currentPage;
}

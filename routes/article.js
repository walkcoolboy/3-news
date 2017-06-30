var articleController = require('../api/article');

const ARTICLES_PER_PAGE = 2;
const INDEX_ITEMS_PER_PAGE = 4;

// /article/:article_id
exports.article = function(req, res){
	if(!req.params.article_id)return res.json("article_id not supplied");
	var id = req.params.article_id;
	//do database trans here
	articleController.getArticle(id)
		.then((article) =>{
			if(!article)return res.json("Article"+ id + " not found");
			var articleURL = article.URL.replace("/_json", "");
			res.render('article.ejs', {
					title: '3 News',
					heading: article.title,
					body: article.body,
					image: article.photos.url,
					caption: article.photos.caption,
					url: articleURL,
					tags: article.tags
			});
		})
		.catch((err) => {
				res.json(err);
		});
};

exports.category = function(req, res){
	var currentCategories = ["Top Content", "World", "National", "Entertainment", "Sport", "Tech", "Blog"];
	if(currentCategories.indexOf(req.params.tag)== -1) {
		res.redirect("/");
		return;
	}
	//do database trans to get json for req.params.tag
	var dbResults = articleController.getArticlesByTag(req.params.tag)
			.then((articles) =>{
			if(!articles || !articles[0]){
				res.redirect("/");
				return;
			}
			var currentPage = getPageRequest(req);
				res.render('app.ejs', {
					title: '3 News',
					header: req.params.tag,
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

exports.search = function(req, res){
	var dbFunction = articleController.getArticlesByTag;
	dbFunction(req.params.tag)
		.then((articles) => {
			var currentPage = getPageRequest(req);
			res.render('search.ejs', {
				title: '3 News - Search results',
				term: req.params.tag,
				page: currentPage,
				numPages: Math.ceil(articles.length / ARTICLES_PER_PAGE),
				results: articles.slice((currentPage-1) * ARTICLES_PER_PAGE, currentPage * ARTICLES_PER_PAGE),

			} //end JSON payload
			);

		})
}

//check for and extract page number
function getPageRequest(req){
	var pageRequest = parseInt(req.query.page);
	var currentPage = (isNaN(pageRequest)) ? 1 : req.query.page;
	return currentPage;
}

/**
* Searches for article by article_id and adds tags from req.body.tags
* Input values:
* 	- article_id : unique id of article - from url parameter
*	Returns:
* 	- success json - used by client to dynamically update
*
*/
 exports.addTag = function(req, res){
 	var arrayTagsToAdd = JSON.parse(req.body.tags);
 			articleController.putArticle(req.params.article_id, arrayTagsToAdd)
 				.then((articles) =>{
 				 	res.json({success: true, tags: arrayTagsToAdd });
				})
		.catch((err) => {
				res.json(err);
		});

 }

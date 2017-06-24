var articleController = require('../api/article');

// /article/:article_id
exports.article = function(req, res){
	if(!req.params.article_id)return res.json("article_id not supplied");
	var id = req.params.article_id;
	//do database trans here
	articleController.getArticle(id)
		.then((articles) =>{
			if(!articles || !articles[0])return res.json("Article"+ id + " not found");
			var article = articles[0];
			//var url = "http://www.stuff.co.nz/_json/marlborough-express/news/70467549/No-selfies-on-super-yacht-for-Blenheim-man".replace("/_json", "");
			res.render('article.ejs', {
					title: '3 News',
					heading: article.title,
					body: article.body,
					image: article.photos.url,
					url: article.URL,
					tags: article.tags
			});
		})
		.catch((err) => {
				res.json(err);
		});
};

exports.category = function(req, res){
	if(!req.params.tag) return res.json("article_tag not supplied");
	//do database trans to get json for category
	if(req.params.tag == 'Top'){
		//modify title
		req.params.tag = 'Top Content';
		//query for top articles
	}
	else{
		//query for req.params.category articles
	
		//TODO: redirect if non-valid category name
	}
	//add json to req.params.jsonData
	//dummy json creation
		res.render('app.ejs', {
		title: '3 News - ' + req.params.tag,
		header: req.params.tag,
		data: {title: "Dummy article " + req.params.tag, description: "Short description of article in index."}//req.params.jsonData
	});
};

/**
 * Searches the database for the given terms
 * Input values:
 * 	- text (string?) : Text to find in title or content of articles
 *
 * Returns:
 *  - results (array<string>) : Array of articles that matched the search (Max 20(?))
 * (results is empty if no matches were found)
 */
 exports.search = function(req, res){
	 	res.render('search.ejs', {
 			title: '3 News - Search results ',
 			term: req.params.tag
 		} //end JSON payload
 		);
 }

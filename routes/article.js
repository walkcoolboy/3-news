// /article/:articleID
exports.article = function(req, res){
	//do database trans here
	//req.params.jsonData = articleController.getArticle(req.params.article_id);

	var url = "http://www.stuff.co.nz/_json/marlborough-express/news/70467549/No-selfies-on-super-yacht-for-Blenheim-man".replace("/_json", "");
	if(req.params.category == 'create_article'){
		//route to create article
	}
	else{
		res.render('article.ejs', {
			title: '3 News',
			heading: "No selfies on super yacht for Blenheim man",
			body: "<p>A former Blenheim resident was not tempted to take a selfie while working on one of the world's largest super yachts.</p> <p>Ocean Victory boasts six swimming pools and a spa but flashy photographs of the boat's interior won't be making it onto Facebook, he said.</p> <p>The seven-deck luxury super yacht is owned by billionaire steel magnate Viktor Rashnikov who is worth more than $7 billion, according to Forbes.</p> <p>It docked in Auckland harbour on Monday morning after riding out the weekend's storm, having sailed from Fiji.</p> <p>The Blenheim aviation engineer spilled the beans on his short but luxurious stay on the yacht on Wednesday .</p> <p>The 28-year-old was carrying out maintenance on Rashnikov's $10 million Mercedes helicopter.</p> <p>Rashnikov was not there himself to meet the engineer but staff gave him a sneak peak.</p> <p>&quot;It was pretty incredible. It's flashier than any hotel I have seen.&quot;</p> <p>He said there was much more than gold taps to see.</p> <p>&quot;I felt like I was walking around a paradise. It's so huge, it's like an island. It's bigger and better than anything you would see in the movies.&quot;</p> <p>He got a tour of the boat which features three lifts, six swimming pools, a helicopter hangar, a movie theatre, a 300 sq metre spa area, and an internal floatable dock for another 14m &quot;runabout&quot; boat.</p> <p>&quot;I'm not really the sort to take a selfie. I was allowed to take photographs but I won't be putting them on Facebook.&quot;</p> <p>After the tour he worked on the helicopter for four hours before it was moved to a base in Auckland.</p> <p>He told his mother, who lives in Blenheim, and a few friends but could not divulge too many secrets because of his work.</p> <p>&quot;It's certainly one to tell the kids.&quot;</p> <p>Ocean Victory is 140m long and has 2000 sq metres of teak decking. It is 20m longer than New Zealand's two Navy frigates, Te Kaha and Te Mana.</p> <p>Launched in December, Rashnikov's super yacht is the largest yacht to be built in Italy and was delivered under a shroud of secrecy.</p> <p>Very little was known about the build prior to its launch, as the owner had demanded privacy, according to Boatinternational.com.&nbsp;It took more than four years to build.</p> <p>But it had since sailed the world, through Asia and the Pacific, to New Zealand waters.&nbsp;</p> <p>It was capable of accommodating up to 36 guests.&nbsp;</p>",
			image: "http://static2.stuff.co.nz/1438205554/888/12315888.jpg",
			url: url,
			tags: ["NZ", "Wealth", "Blenheim"]
	}
		); //TODO: add article JSON here from req
}
};

exports.category = function(req, res){
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
 			term: req.params.term
 		} //end JSON payload
 		);
 }

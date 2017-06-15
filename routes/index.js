exports.index = function(req, res){
	//do database trans for top content

	res.render('app.ejs', {
		title: '3 News - Top content',
		header: "Top Content",
		data: {
			title: "Dummy article one top article",
			description: "Short description of article in index."}
	});
};

//moved to articles.category

// exports.category = function(req, res){
// 	res.render('app.ejs', {
// 		title: '3 News - ' + req.params.tag,
// 		header: req.params.tag,
// 		data: {title: "Dummy article " + req.params.tag, description: "Short description of article in index."}//req.params.jsonData
// 	});
// };

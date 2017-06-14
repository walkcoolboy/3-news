exports.index = function(req, res){
	//do database trans for top content

	res.render('app.ejs', {
		title: '3 News - ' + req.params.category,
		header: "Top Content",
		data: {
			title: "Dummy article "+req.params.category,
			description: "Short description of article in index."}
	});
};



exports.category = function(req, res){
	res.render('app.ejs', {
		title: '3 News - ' + req.params.category,
		header: req.params.category,
		data: req.params.jsonData
	});
};

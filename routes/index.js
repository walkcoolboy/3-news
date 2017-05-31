exports.category = function(req, res){
	res.render('app.ejs', { 
		title: '3 News - ' + req.params.category, 
		header: req.params.category,
		data: req.params.jsonData
	} //end JSON payload
	);
};

exports.article = function(req, res){
	res.render('app.ejs', { title: '3 News' });
};
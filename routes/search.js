exports.search = function(req, res){
	res.render('search.ejs', { 
		title: '3 News - Search results ',
		term: req.params.term
	} //end JSON payload
	);
};
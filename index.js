//load required packages
var express = require('express');
var app = express();
var router = express.Router();
var ejs = require('ejs');
app.set('view engine', 'ejs');

var fs = require('fs');
var https = require('https');

var https_options = {
  key: fs.readFileSync('domain.key'),
  cert: fs.readFileSync('domain.crt')
};
var mongoose = require('mongoose');

//connect to MongoDB
mongoose.connect('mongodb://heroku_khwjm57z:5e7v1vdpgpluug4e3vd4cgm242@ds143131.mlab.com:43131/heroku_khwjm57z');

var bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));




var path = require('path');
//var pg = require('pg').native;
var port = process.env.PORT || 8080;

var userController = require('./api/user');
var articleController = require('./api/article');
var clientController = require('./api/client');

var authController = require('./api/auth');


//-----------------------------------------
//Config starts here
app.use(function (req, res, next) {
	// Website you wish to allow to connect
	res.setHeader('Access-Control-Allow-Origin', '*');
	// Request methods you wish to allow
	res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
	// Request headers you wish to allow ,
	res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Access-Control-Allow-Headers');
	// Pass to next layer of middleware
	next();
});

//HTTP
// app.listen(port, function () {
// 	console.log('App listening on port 8080');
// });

//HTTPS
var server = https.createServer(https_options, app).listen(8443, 'localhost');

//Hosts all files within the directory for access
//Temporary measure for ease of use
 app.use('/', express.static(__dirname + '/'));

//End of middleware code



//-------------
//INDEX
//-------------
//setup navigation routes
var index = require('./routes/index');


app.get('/', function(req, res){
	//do database trans for top content

		//add json to req.params.jsonData
	//dummy json creation
	req.params.category = "Top Content";
	req.params.jsonData = {title: "Dummy article "+req.params.category, description: "Short description of article in index."};
	index.category(req,res); //send to routes for view creation
});

/**
 * A request to get all articles of a specified category
 * Input:
 *  -	category name as part of url
 *
 * Results in database lookup of all articles in given category, then template
 * generation by ejs view engine via routes.
 * (redirect to homepage on incorrect category name)
 */
app.get('/:category', function(req, res){
	//do database trans to get json for category
	if(req.params.category == 'Top'){
		//modify title
		req.params.category = 'Top Content';
		//query for top articles
	}
	else{
		//query for req.params.category articles

		//TODO: redirect if non-valid category name
	}
	//add json to req.params.jsonData
	//dummy json creation
	req.params.jsonData = {title: "Dummy article "+req.params.category, description: "Short description of article in index."}
	index.category(req,res); //send to routes for view creation
});

//-------------
//ARTICLES
//-------------
var article = require('./routes/article');
var search  = require('./routes/search');
/**
 * Returns the page for an article
 * Input:
 *  -	article id as part of url
 *
 * Results in database lookup of article JSON and template generation by ejs view engine via routes.
 * (no article available page generated on db lookup fail)
 */
app.get('/article/:articleID', function(req, res){
	//do database trans here and add to request params

	article.article(req, res);
});

/**
 * A request to seach the database for articles matching the search term/s
 * Input values:
 * 	- text (string?) : Text to find in title or content of articles
 * 	- tag (string?)	: Tag/s to match
 * (A request can have 0, 1, or both of these inputs)
 * 
 * Returns:
 *  - results (array<string>) : Array of articles that matched the search (Max 20(?))
 * (results is empty if no matches were found)
 */
app.get('/search/:term', function(req, res) {
		search.search(req, res);
});

//-------------
//USERS
//-------------





//-------------
//API Routes
//-------------
app.get('/api/article', articleController.getArticles)
	.post('/api/article/', articleController.postArticle);
	
app.get('/api/article/:article_id', articleController.getArticle)
	.put('/api/article/:article_id', articleController.putArticle)
	.delete('/api/article/:article_id', articleController.deleteArticle);

//Not yet implemented
// app.post('/api/users/:username', userController.postUser)
// 	.get('/api/users/:username', userController.getUser)
// 	.put('/api/users/:username', userController.putUser)
// 	.delete('/api/users/:username', authController.requireAdmin, userController.deleteUser);

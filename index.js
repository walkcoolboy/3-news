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


if(process.env.NODE && ~process.env.NODE.indexOf("heroku")){
	var port = process.env.PORT || 8080;
	app.listen(port, function () {
 	console.log('App listening on port 8080');
 	});
}else {
	//Set up an http server on port 80
	var http = require('http');
	http.createServer(app).listen(8080);

	//Redirects HTTP traffic to https
	app.use((req, res, next) => {
    	if (!req.secure)
      		res.redirect(`https://${req.header('host')}${req.url}`);
    	else
      		next();
  	});

	https.createServer(https_options, app).listen(8443, 'localhost');
};

//Hosts all files within the directory for access
//Temporary measure for ease of use
//TODO: Restrict to relevant files, and set caching policy
 app.use('/', express.static(__dirname + '/'));

//End of middleware code



//-------------
//INDEX
//-------------
//setup navigation routes
var index = require('./routes/index');
var caching = require('./routes/cache');
app.get('/', caching.setShort, index.index);

//This is added last to ensure it doesn't overwite any other routes
//app.get('/:tag', index.category);

//-------------
//ARTICLES
//-------------
var article = require('./routes/article');
var tracking = require('./routes/tracking');
app.get('/article/:article_id', tracking.log, caching.setShort, article.article)
	.get('/search/:tag', caching.setShort, article.search)
	.get('/search/:tag/:page', caching.setShort, article.search)
	.get('/article/tag/:tag', caching.setShort, article.search)
	.put('/article/:article_id', article.addTag);

//-------------
//AUTH Routes
//-------------

var auth = require('./routes/auth');

app.post('/auth/login', caching.setNone, auth.login)
  .post('/auth/logout', caching.setNone, auth.validateToken, auth.logout)
  .get('/auth/google', caching.setNone, auth.google)
  .get('/auth/google/callback', caching.setNone, auth.googleCallback);


//-------------
//USER Routes
//-------------
var user = require('./routes/user')

app.post('/users/createUser', caching.setNone, user.createUser)
 	.get('/users/:username', caching.setPrivate, auth.validateToken, user.getUser)
 	.put('/users/:username', caching.setNone, auth.validateToken, user.putUser)
 	.delete('/users/:username', caching.setNone, auth.validateToken, user.deleteUser);


//-------------
//API Routes
//-------------
var api = require('./routes/api');

app.get('/api/article', api.getArticles)
   .get('/api/article/tag/:article_tag', api.getArticlesByTag)
	.post('/api/article/', auth.validateToken, api.postArticle);

app.get('/api/article/:article_id', api.getArticle)
	.put('/api/article/:article_id', auth.validateToken, api.putArticle)
	.delete('/api/article/:article_id', auth.validateToken, api.deleteArticle);


//--------------------------------
//MUST BE LAST ROUTE ADDED
//--------------------------------

app.get('/:tag', caching.setShort, article.category);

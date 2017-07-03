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
var port;
//Checks if the app is running on Heroku
if(process.env.NODE && ~process.env.NODE.indexOf("heroku")){
	//Do basic HTTP server setup, Heroku will handle HTTPS
	port = process.env.PORT || 8080;
	app.listen(port, function () {
 	console.log('App listening on port '+port);

});}
else {

	//Run our own HTTPS server
	port = process.env.PORT || 8443;
	https.createServer(https_options, app).listen(port, 'localhost');
	console.log('App listening on port '+port);

	//Set up an http server on port 8080 to redirect HTTP requests
	var http = require('http');
	http.createServer(app).listen(8080);

	//Redirects HTTP traffic to https
	app.use((req, res, next) => {
    	if (!req.secure) {
          var host = req.headers.host.replace(/:[0-9]+$/g, ""); // strip the port # if any
      		res.redirect(`https://${host}:${port}${req.url}`);
        }
    	else
      		next();
  	});
};

//Closes the app if an error occurs
//This will restart the app if it's hosted on Heroku
process.on('uncaughtException', function(err) {
	console.log("Uncaught expection");
	console.log(err);
    process.exit(err);
});
process.on('error', function(err) {
	console.log("Error");
	console.log(err);
    process.exit(err);
});
//End of middleware code

var caching = require('./routes/cache');

//Hosts all files within the directory for access
//Temporary measure for ease of use
//TODO: Restrict to relevant files
 app.use('/', caching.setFull, express.static(__dirname + '/'));





//-------------
//INDEX
//-------------
//setup navigation routes
var index = require('./routes/index');

app.get('/', caching.setVeryShort, index.index);

//This is added last to ensure it doesn't overwite any other routes
//app.get('/:tag', index.category);

//-------------
//AUTH Routes
//-------------

var auth = require('./routes/auth');

app.post('/auth/login', caching.setNone, auth.login)
   .post('/auth/logout', caching.setNone, auth.validateToken, auth.logout)
   .get('/auth/google', caching.setNone, auth.google)
   .get('/auth/google/callback', caching.setNone, auth.googleCallbackAuthenticate, auth.googleCallback);


//-------------
//USER Routes
//-------------
var user = require('./routes/user')

app.post('/users/createUser', caching.setNone, user.createUser)
 	.get('/users/:username', caching.setPrivate, auth.validateToken, user.getUser)
 	.put('/users/:username', caching.setNone, auth.validateToken, user.putUser)
// .delete('/users/:username', caching.setNone, auth.validateToken, user.deleteUser);

//-------------
//ARTICLES
//-------------
var article = require('./routes/article');
var tracking = require('./routes/tracking');

app.get('/article/:article_id', auth.validateToken, tracking.log, caching.setShort, article.article)
	.get('/article/tag/:tag', caching.setVeryShort, article.search)
  .put('/article/:article_id', article.addTag);

app. get('/search/:tag', caching.setVeryShort, article.search)
  	.get('/search/:tag/:page', caching.setVeryShort, article.search);


//-------------
//API Routes
//-------------
var api = require('./routes/api');

app.get('/api/article',  caching.setVeryShort, api.getArticles)
   .get('/api/article/tag/:article_tag',  caching.setVeryShort, api.getArticlesByTag)
  .post('/api/article/',  caching.setNone, auth.validateToken, api.postArticle);

app.get('/api/article/:article_id',  caching.setShort, api.getArticle)
   .put('/api/article/:article_id',  caching.setNone, auth.validateToken, api.putArticle)
.delete('/api/article/:article_id',  caching.setNone, auth.validateToken, api.deleteArticle);

app.post('/api/users/createUser', caching.setNone, api.postUser)
  .post('/api/users/:username', caching.setNone, api.postUser)
 	.get('/api/users/:username', caching.setPrivate, api.getUser)
 	.put('/api/users/:username', caching.setNone, api.putUser)
  .delete('/api/users/:username', caching.setNone, api.deleteUser);

app.delete('/api/users/:username/history', caching.setNone, api.deleteUserHistory);

//--------------------------------
//MUST BE LAST ROUTE ADDED
//--------------------------------

app.get('/:tag', caching.setVeryShort, article.category);

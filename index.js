//load required packages
var express = require('express');
var app = express();
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
	res.setHeader('Access-Control-Allow-Origin', '*')
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

//-----------------------------------------
//Routes start here

app.get('/', function (req, res) {
    var filepath = path.join(__dirname, 'index.html');
    fs.readFile(filepath, function (err, data) {
      res.end(data);
    });
});

//Hosts all files within the directory for access
//Temporary measure for ease of use
 app.use('/', express.static(__dirname + '/'));


app.get('/article', articleController.getArticles)
	.post('/article/', articleController.postArticle);
	
app.get('/article/:article_id', articleController.getArticle)
	.put('/article/:article_id', articleController.putArticle)
	.delete('/article/:article_id', articleController.deleteArticle);
//
// app.post('/users/:username', userController.postUser)
// 	.get('/users/:username', userController.getUser)
// 	.put('/users/:username', userController.putUser)
// 	.delete('/users/:username', authController.requireAdmin, userController.deleteUser);

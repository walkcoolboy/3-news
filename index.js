var express = require('express');
var app = express();

var bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

var fs = require('fs');
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

app.listen(port, function () {
	console.log('App listening on port 8080');
});


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

app.get('/article', );

app.get('/article/:article_id', articleController.getArticle)
	.put('/article/:article_id', articleController.putArticle)
	.post('/article/:article_id', articleController.postArticle)
	.delete('/article/:article_id', articleController.deleteArticle);

app.post('/users/:username', userController.postUser)
	.get('/users/:username', userController.getUser)
	.put('/users/:username', userController.putUser)
	.delete('/users/:username', authController.requireAdmin, userController.deleteUser);
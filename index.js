var express = require('express');
var app = express();

var bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

var fs = require('fs');
var path = require('path'); 
var pg = require('pg').native;
var port = process.env.PORT || 8080;

//-----------------------------------------
//Middleware code starts here
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

//Hosts all files within the directory for access
app.use('/', express.static(__dirname + '/'));


app.get('/', function (req, res) {
    var filepath = path.join(__dirname, 'index.html');    
    fs.readFile(filepath, function (err, data) {
      res.end(data);
    });
});

app.listen(port, function () {
	console.log('App listening on port 8080');
});
//End of middleware code
//-----------------------------------------
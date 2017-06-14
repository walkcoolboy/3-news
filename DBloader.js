var mongoose = require('mongoose');
var express = require('express');
var app = express();
var request=require('request');
var port = process.env.PORT || 8080;

var bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
//connect to MongoDB
mongoose.connect('mongodb://heroku_khwjm57z:5e7v1vdpgpluug4e3vd4cgm242@ds143131.mlab.com:43131/heroku_khwjm57z');

//-------------
//API Routes
//-------------
var api = require('./routes/api');

var articles = [93441299];

for (i=0; i<articles.length; i++) {
    var url = 'http://www.stuff.co.nz/_json/'+articles[i]+'/';
    console.log('Getting URL: ' + url);
    request.get({
      url: url,
      json: true,
      headers: {'User-Agent': 'curl/7.53.1'}
    }, (err, res, data) => {
      if (err) {
        console.log('Error:', err);
      } else if (res.statusCode !== 200) {
        console.log('Status:', res.statusCode, ' resbody:', res.body);
      } else {
        // data is already parsed as JSON:
        console.log(data);
      }
    });
  };

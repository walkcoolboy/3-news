var express = require('express');
var app = express();
var router = express.Router();
var ejs = require('ejs');
app.set('view engine', 'ejs');

var bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

var fs = require('fs');
var path = require('path');
//var pg = require('pg').native;
var port = process.env.PORT || 8080;

//MongoDB Connection
var MongoClient = require('mongodb').MongoClient
  , assert = require('assert');

// Connection URL
var url = 'mongodb://heroku_khwjm57z:5e7v1vdpgpluug4e3vd4cgm242@ds143131.mlab.com:43131/heroku_khwjm57z';

// Use connect method to connect to the server
MongoClient.connect(url, function(err, db) {
  assert.equal(null, err);
  console.log("Connected successfully to server");

  db.close();
});

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

//setup navigation routes
var index = require('./routes/index');
app.get('/', function(req, res){
	//do database trans
	//dummy json creation()
	req.params.category = "Top Content"
	req.params.jsonData = {title: "Dummy article title" + req.params.category, description: "Short description of article in index."}
	index.category(req,res); //send to routes for view creation
});


app.get('/:category', function(req, res){
	//do database trans to get json

	//dummy json creation
	req.params.jsonData = {title: "Dummy article "+req.params.category, description: "Short description of article in index."}
	index.category(req,res); //send to routes for view creation
});
app.get('/article/:articleID', index.category);

app.listen(port, function () {
	console.log('App listening on port 8080');
});
//End of middleware code
//-----------------------------------------


//-----------------------------------------
//API code starts here

//-------------
//ARTICLES
//-------------

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
app.get('/search', function(req, res) {
		
});

/**
 * A request to find the recommended articles for the current client
 * Input values: none
 * 
 * Returns:
 *  - results (array<string>) : Array of articles (Max 20(?))
 * 
 */
app.get('/get_recommended', function(req, res) {
		
});

/**
 * A request to create a new article
 * Input values:
 *  - title (string) : Title of the article
 *  - content (string) : Content of the article
 * 	- tags (string)	: Tags related to the article
 * 
 * Returns:
 *  - success (bool) : Whether creation of the article was successful
 *  - message (string) : Message informing the client of the result e.g. "CREATE SUCCESSFUL"
 *  - result (string?) : The link to the new article
 */
app.post('/create_article', function(req, res) {
	
	var title = req.body.title;
	var content = req.body.content;
	var tags = req.body.tags;

	console.log('/create_article:' + title);

	if(!title || !content || !tags){ //Check for invalid requests
		res.json({
			success:false,
			message: 'ERROR: Request missing a field'
		});
		return;
	}

	var articles = [];

	//DATABASE CODE HERE

	//example
	query.on('end', function() {
		res.json({
			success: true,
			message: 'SUCCESS',
			results: articles
		});
	});

});

/**
 * A request to edit an article.
 * If the article does not exist, create it only if 'content' is provided
 * Input values:
 *  - title (string) : Title of the article
 *  - content (string?) : Content of the article
 * 	- tags (string?)	: Tags related to the article
 * 
 * Returns:
 *  - success (bool) : Whether editing or creation of the article was successful
 *  - message (string) : Message informing the client of the result e.g. "EDIT FAILED: User is not an admin"
 */
app.post('/create_article', function(req, res) {
		
});

/**
 * A request to delete a specific article
 * Input values:
 *  - title (string) : Title of the article
 *  - (Maybe another identifier?)
 * 
 * Returns:
 *  - success (bool) : Whether deletion of the article was successful
 *  - message (string) : Message informing the client of the result e.g. "DELETE FAILED: User is not an admin"
 */
app.delete('/delete_article', function(req, res) {
		
});

//-------------
//USERS
//-------------

/**
 * A request to create a new user account. Does not use OAuth.
 * Input values:
 *  - username (string) : Username to create
 *  - password (string) : Plaintext of the user's password
 * 
 * Returns:
 *  - success (bool) : Whether creation of the account was successful
 *  - message (string) : Message informing the client of the result e.g. "REGISTER FAILED: Username already exists"
 */
app.post('/register', function(req, res) {
		
});

/**
 * A request to log into a user account. Does not use OAuth.
 * Input values:
 *  - username (string) : Username of the user
 *  - password (string) : Plaintext of the user's password
 * 
 * Returns:
 *  - success (bool) : Whether login was successful
 *  - message (string) 	: Message informing the client of the result e.g. "LOGIN FAILED: Wrong password"
 */
app.post('/login', function(req, res) {
		
});

/**
 * A request to log a user out. Does not use OAuth.
 * Input values:
 * 
 * Returns:
 *  - success (bool) : Whether logout was successful
 *  - message (string) : Message informing the client of the result e.g. "LOGOUT FAILED: User was not logged in"
 */
app.post('/logout', function(req, res) {
		
});

/**
 * A request to update a user's details. Does not use OAuth.
 * Input values:
 *  - username (string?) : Username of the user
 *  - password (string) : Plaintext of the user's current password, for verification
 *  - newPassword (string?) : Plaintext of the user's new password
 * 
 * Returns:
 *  - success (bool) : Whether logout was successful
 *  - message (string) : Message informing the client of the result e.g. "UPDATE FAILED: Wrong password"
 */
app.put('/update_user', function(req, res) {
		
});

/**
 * A request to delete a user account. Does not use OAuth.
 * Input values:
 *  - username (string?) : Username of the user to be deleted. 
 * 						   If this isn't the current user, current user must be an admin
 *  - password (string) : Plaintext of the user's current password, for verification
 * 
 * Returns:
 *  - success (bool) : Whether deletion was successful
 *  - message (string) : Message informing the client of the result e.g. "DELETE FAILED: Not an admin"
 */
app.delete('/delete_user', function(req, res) {
		
});

//-------------
//ACTIVITY

//Definition of a history element:
//A JSON tuple of {article:string, numVisits:int, lastVisited:date}
//-------------

/**
 * A request to view a user's history. Admins only.
 * Input values:
 *  - username (string) : User whose history the client wants to view
 * 
 * Returns:
 *  - results (array<history>) : Array of history elements
 */

app.get('/view_history', function(req, res) {
	
});

/**
 * A request to edit an element of a user's history. Admins only.
 * Input values:
 *  - username (string) : User whose history should be edited
 *  - element (history) : History element to be inserted
 * 
 * Returns:
 *  - success (bool) : Whether editing was successful
 *  - message (string) : Message informing the client of the result e.g. "EDIT HISTORY FAILED: User not found"
 */

app.put('/edit_history', function(req, res) {
	
});


/**
 * A request to clear a user's history. Admins only.
 * Input values:
 *  - username (string) : User whose history should be edited
 *  - archive (bool?)	: Whether the server should archive that user's history
 * 
 * Returns:
 *  - success (bool) : Whether editing was successful
 *  - message (string) : Message informing the client of the result e.g. "CLEAR HISTORY FAILED: User not found"
 */

app.delete('/clear_history', function(req, res) {
	
});

//End of API code
//-----------------------------------------

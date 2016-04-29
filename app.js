/*eslint-env node*/

//------------------------------------------------------------------------------
// node.js starter application for Bluemix
//------------------------------------------------------------------------------

// This application uses express as its web server
// for more info, see: http://expressjs.com
var express = require('express');

// cfenv provides access to your Cloud Foundry environment
// for more info, see: https://www.npmjs.com/package/cfenv
var cfenv = require('cfenv');

// create a new express server
var app = express();

//JK add bodyParser
var bodyParser = require('body-parser');

// get the app environment from Cloud Foundry
var appEnv = cfenv.getAppEnv();

app.use(bodyParser.urlencoded({
        extended: true
        })
);
app.use(bodyParser.json());

// serve the files out of ./public as our main files
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');

app.use(express.static(__dirname + '/public'));

// call watson modules
var watson = require('./watson/watson.js');
app.post('/analyze', function (req, res) {
	watson.getEntities(req, function(err,resp) {
  		if(err) {
  		 return err
 		 }
		watson.getKeywords(req, function(error, response) {
			if(error) {
			 return error
			}
			var kwds = response.keywords;
			var entities = resp.entities;

			//console.log('keywords: ' + JSON.stringify(kwds));
			//console.log('entities: ' + JSON.stringify(entities));
			res.render('index', {refurl: req.body.url, keywords : JSON.stringify(kwds), entities: JSON.stringify(entities)});
			//res.send({refurl: req.body.url, keywords : JSON.stringify(kwds), entities: JSON.stringify(entities)});
		});
})});


// start server on the specified port and binding host
app.listen(appEnv.port, '0.0.0.0', function() {

  // print a message when the server starts listening
  console.log("server starting on " + appEnv.url);
});

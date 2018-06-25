var express = require('express');
var app = express();
var Config = require('./config')()
var mongoose = require('mongoose');
var Utilities = require("./utilities")()
var flags = require("node-flags")
var path = require('path')

// handle the --debug parameter
Config.setWebcam(!flags.get("debug"));

// Support for JSON-encoded POST parameters
app.use(express.json({limit : '50mb'}))

// Connect to mongo server
const options = {
  reconnectTries: 5, // Never stop trying to reconnect
  reconnectInterval: 500, // Reconnect every 500ms
  poolSize: 10, // Maintain up to 10 socket connections
  // If not connected, return errors immediately rather than waiting for reconnect
  bufferMaxEntries: 0
};
mongoose.connect(Config.getMongoServer(), options).then(
	() => { Utilities.log("Connection to MongoDB established successfully", "info"); },
	error => { Utilities.log("Connection to MongoDB could not be established. Error :\n" + error.toString(), "info"); }
);

// Handle all routes starting with /storyface
var routes = require("./routes")(Config, Utilities)
app.use('/storyface', routes)

// Routes that do not start with /storyface
app.use(function(req, res) {
	Utilities.log("Unhandled non-Storyface page request : " + req.originalUrl);
	res.status(404).send('Not found');
})

if( Config.getEnvironment() == "dev")
{ // In development environment the the server is an HTTPS server
	var fs = require('fs');
	var https = require('https');
	var privateKey  = fs.readFileSync(path.join(__dirname, path.join('ssl_certificates','key.pem')), 'utf8');
	var certificate = fs.readFileSync(path.join(__dirname, path.join('ssl_certificates','cert.pem')), 'utf8');
	var credentials = {key: privateKey, cert: certificate};
	var server = https.createServer(credentials, app);
}
else
{
	var http = require("http");
	server = http.createServer(app);
}


var listeningServer = server.listen(Config.getServerPort(), Config.getServerIP(), function () {
   var host = listeningServer.address().address
   var port = listeningServer.address().port
	 Utilities.log("Listening on https://" + host + ":" + port)
 });

var express = require('express');
var router = express.Router();
var path = require('path');
var passport = require('passport');
const publicFolder = path.join(path.dirname(__dirname), "public")

module.exports = function(Config, Utilities){
  // Load the authentication middleware
  require('./api/models')(Config)
  require('./api/config/passport.js')
  router.use(passport.initialize({ userProperty : "authenticationToken"}));

  // Load API routes
  var api = require("./api")(Config, Utilities)
  router.use('/api', api)

  // /storyface routes
  router.use('/', express.static(publicFolder, {index : Config.webcamEnabled() ? "index.html" : 'index_without_webcam.html'}))
  router.use('/', function(req, res)
  {
    if( !Config.webcamEnabled() )
    { // When the --debug flag is enabled, send the index without webcam
      if(reqIsStoryfacePage(req))
      {
    		res.sendFile(path.join(publicFolder, "index_without_webcam.html"));
    	}
      else
      { // unhandled routes starting by /storyface
    		res.sendStatus(404);
    		Utilities.log("Unhandled Storyface  request : " + req.originalUrl);
    		res.end();
    	}
    }
    else
    { // When the --debug flag isn't enabled, send the normal site
      if(req.originalUrl.indexOf("visageAnalysisData.data") >= 0)
    	{
        res.sendFile(path.join(path.join(publicFolder, "visageTechnologies"), "visageAnalysisData.data"));
    	}
    	else if(req.originalUrl.indexOf("visageSDK.data") >= 0 )
    	{
    		res.sendFile(path.join(path.join(publicFolder, "visageTechnologies"), "visageSDK.data"));
    	}
    	else if(req.originalUrl.indexOf("/debug") >= 0 || req.originalUrl.indexOf("profiles") >=0 )
    	{
    		res.sendFile(path.join(publicFolder, "index_without_webcam.html"));
    	}
    	else if(reqIsStoryfacePage(req))
    	{
    		res.sendFile(path.join(publicFolder, "index.html"));
    	}
      else
      {
        Utilities.log("Unhandled Storyface page request : " + req.originalUrl);
    		res.status(404).send('Not found');
    		res.end();
    	}
    }
  })

  // Catch unauthorized errors
  router.use(function (err, req, res, next) {
    if (err.name === 'UnauthorizedError') {
  		Utilities.log("Attempt to access a protected route without being authenticatied", "info")
      res.status(401);
      res.json({"message" : err.name + ": " + err.message});
    }
  });


  return router;
}

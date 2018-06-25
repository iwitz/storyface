var express = require('express');
var router = express.Router();
var jwt = require('express-jwt');

module.exports = function(Config, Utilities){
  // Set up authentication middleware to restrict access to paths that allow data modification
  var auth = jwt({
    secret: Config.getSalt(),
    getToken: function fromHeaderOrQuerystring (req) {
      if(req.method == "GET" || req.method == "DELETE" || req.method == "PATCH")
      {
        return req.query.authenticationToken;
      }
      else{
        return req.body.authenticationToken;
      }
    }
  });

  // middleware function that checks if a user is allowed to access the route
  var acl = function(role){
    return function(req, res, next){
      if(req.user && req.user.role === role || req.user.role == "admin"){
        next();
      }
      else{
        res.sendStatus(403)
      }
    }
  }

  var profiles = require('./profiles')(Config, auth, acl, Utilities)
  router.use('/profiles', profiles)

  var users = require('./users')(Config, auth, acl, Utilities)
  router.use('/users', users)

  return router;
}

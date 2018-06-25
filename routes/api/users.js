var express = require('express');
var router = express.Router();

var passport = require('passport');

var mongoose = require('mongoose')
var User = mongoose.model('User')

var crypto = require('crypto');

module.exports = function(Config, auth, acl, Utilities){
  router.post('/login', function(req, res, next) {
    Utilities.log('Login attempt : ' + req.body.username, "info")
    passport.authenticate('local', function(err, user, info){
      var token;
      // If Passport throws/catches an error
      if (err) {
        res.sendStatus(500)
        return;
      }
      // If a user is found
      if(user){
        authenticationToken = user.generateJwt();
        res.status(200);
        res.json({
          "authenticationToken" : authenticationToken
        });
      } else {
        // If user is not found or the password is wrong
        res.sendStatus(401).json();
      }
    })(req, res);
  });

  function register(username, password, name, surname, email, role){
     var user = new User();

     user.role = role;
     user.username = username;
     user.name = name;
     user.surname = surname;
     user.email = email;
     user.setPassword(password);


     user.save(function(err) {
       if(err){
         console.log(err);
       }
     });
  }

  router.post('/signup', function(req, res, next) {
    Utilities.log('Signup attempt : ' + req.body.username, "info")
    if( !req.body.username ||
      !req.body.password ||
      req.body.password.length < 6 ||
      req.body.username.length < 3 ||
      !req.body.name ||
      !req.body.surname ||
      !req.body.email )
    {
      res.status(422).json("Incorrect input.");
    }
    else{
      User.findOne({ $or : [{"username" : req.body.username}, {"email" : req.body.email}] }, function(err, user){
        if(user)  {
          res.status(409)
          res.json("Your username or email already exists in the database. You cannot create an other account with this email/username.");
        }
        else{
          r = register(req.body.username, req.body.password, req.body.name, req.body.surname, req.body.email, "user");
          if(r)
          {
            res.status(520)
            res.json("An unknonwn error occurred.");
            return;
          }
          else
          {
            res.status(200)
            res.json("Successful account creation.");
            return;
          }
        }
      })
    }
  });

  router.get('/getUserList', auth, acl("admin"), function(req, res, next) {
    // Route to get the usernames and ids of all users. Its access is restricted.
    User.find({}, ["role", "username", "name", "surname", "_id", "email"], function(err,users){
      if(users){
        res.status(200)
        res.json(users);
      }
      else{
        res.status(520)
      }
    })
  });

  // Same as upper route but gives role and username instead of username and id
  router.get('/getAllUsers', auth, function(req, res, next) {
    // Route to get the usernames of all users. Its access is restricted.
    User.find({}, ["role", "username", "name", "surname", "_id", "email"], function(err,users){
      if(users){
        res.status(200)
        res.json(users);
      }
      else{
        res.status(520)
      }
    })
  });

  router.post('/deleteUser', auth, acl("admin"), function(req, res, next) {
      User.findById(req.body.id, function(err, userToDelete){
        if(!userToDelete){
          res.sendStatus(404);
        }
        else if( userToDelete.role == "admin"){
          // forbidden
          res.sendStatus(301);
        }
        else{
          // else delete the profile
          userToDelete.remove({}, function(err){
            if (err)
            {
              Utilities.log(err, "error");
              res.sendStatus(500)
            }
            else
            {
              res.sendStatus(200)
            }
          });
        }
      })
  });

  // Route to get a user by ID
  router.get('/getUserById', auth, acl("admin"), function(req, res, next) {
  	User.findById(req.query.id, function(err, user) {
  		if (err)
  		{
  			Utilities.log(err, "error");
  			res.sendStatus(500)
  		}
  		else
  		{
  			res.json(user);
  		}
    });
  });

  // Route to edit an user
  router.post('/editUser', auth, acl("admin"), function(req, res, next) {
    let user = JSON.parse(req.body.user);
    Utilities.log("Editing user", "info");
    User.findByIdAndUpdate(user._id, user, { runValidators : true }, function(err){
      if (err)
      {
        Utilities.log(err, "error");
        res.sendStatus(500)
      }
      else
      {
        if (user.password && user.password !== '') {
          let password = user.password;
          User.findById(user._id, function(err, userObject) {
            if (err)
            {
              Utilities.log(err, "error");
              res.sendStatus(500)
            }
            else
            {
              Utilities.log("Changing user password", "info");
              userObject.setPassword(password);
              userObject.save();
            }
          });
        }
        res.sendStatus(200)
      }
    })

    });

  User.findOne({"username" : "admin"}, function(err, res){
    if(res)  {
      Utilities.log("Admin account already created. Skipping creation", "info")
      Utilities.log("Current password : " + Config.getAdminPassword(), "info")
      res.setPassword(Config.getAdminPassword())
      res["email"] = Config.getAdminEmail()
      res["name"] = Config.getAdminName()
      res["surname"] = Config.getAdminSurname()
      res.save()
    }
    else{
      Utilities.log("Admin account not created yet. Creating...", "info")
      register("admin", Config.getAdminPassword(), Config.getAdminName(), Config.getAdminSurname(), Config.getAdminEmail(), "admin");
      Utilities.log("Current password : " + Config.getAdminPassword(), "info")
    }
  })

  return router;
}

var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var Profile = mongoose.model('Profile');
var fs = require('fs');

// REST API to query database
module.exports = function(Config, auth, acl, Utilities){
  // Utility function used by importProfiles
  function createProfile(c)
  {
    Profile.findById(c._id).then( res => {
      if( res == null)
      { // If the current profile does not exist yet, create it
        var p = new Profile(c)
        p.save(function (err, newProfile) {
          if (err)
          {
            Utilities.log(err, "error")
          }
        });
      }
    })
  }

  // Route to get all the profiles
  router.post('/importProfiles', auth, function(req, res, next) {
  	var profiles = req.body.profiles;
    for(var i=0; i < profiles.length ; i++)
    {
      if(req.user.role != "admin"){
        // If the user is not an admin, the profile is not published by default
        profiles[i].published = false;
      }
      else if( !profiles[i].published ){
        // if the current profile does not have a published field and the user is an admin, publish it by default
        profiles[i].published = true
      }
      // the current profile is attributed to the user importing the profile
      profiles[i].author = req.user._id;
      createProfile(profiles[i])
    }
    res.status(200).send('We started importing the profiles. We might finish one day')
  });

  router.get('/getAllProfiles', function(req, res, next) {
  	Profile.find(function(err, profiles) {
  		if (err)
  		{
  			Utilities.log(err, "error");
  			res.sendStatus(500)
  		}
  		else
  		{
  			res.json(profiles);
  		}
    });
  });

  // Route to get a profile by ID
  router.get('/getProfileById', function(req, res, next) {
  	Profile.findById(req.query.id, function(err, profile) {
  		if (err)
  		{
  			Utilities.log(err, "error");
  			res.sendStatus(500)
  		}
  		else
  		{
  			res.json(profile);
  		}
    });
  });

  // Route to get random profile that does not appear in the parameter list
  router.get('/getRandomProfile', function(req, res, next) {
    let conditions = JSON.parse(req.query.conditions)
    let forbiddenProfiles = req.query.forbiddenProfiles ? req.query.forbiddenProfiles : [];
    conditions["published"] = true;
  	Profile.find(conditions).where("_id").nin(forbiddenProfiles).exec( function(err, profile)
  	{
  		if (err)
  		{
  			Utilities.log(err, "error");
  			res.sendStatus(500)
  		}
  		else
  		{
  			// return a random item
  			var res_p = profile[Math.floor(Math.random()*profile.length)]
  		  res.json(res_p);
  		}
    });
  });

  // Route to create a profile
  router.post('/createProfile', auth, function(req, res, next) {
  	let profile = req.body.profile;

    profile.author = req.user._id;
    profile.published = false;

  	let image = profile.image;
  	delete profile.image;

  	profile = new Profile(profile)

  	if(profile.image){
  		saveProfilePic(profile.image, profile.id).then(res => Utilities.log(" image : " + res, "info"));
  		delete profile.image;
  	}
  	profile.save(function (err, newProfile) {
        if (err)
  			{
  				Utilities.log(err, "error");
  				res.sendStatus(500)
  			}
  			else
  			{
  				if(image){
  					saveProfilePic(image, newProfile._id).then(res => Utilities.log(res, "info"));
  				}

  				res.status(200)
  				res.json(newProfile)
  			}
      });
  });

  // Route to delete a profile
  router.post('/deleteProfile', auth, function(req, res, next) {
    Profile.findById(req.body.id, function(err, profile){
      if(!profile){
        res.sendStatus(404);
      }
      else if( req.user.role != "admin" && req.user._id != profile.author){
        // if the user is not authorized to delete the profile, send 401 error code
        res.sendStatus(401);
      }
      else{
        // else delete the profile
        profile.remove({}, function(err){
          if (err)
      		{
      			Utilities.log(err, "error");
      			res.sendStatus(500)
      		}
      		else
      		{
      			deleteProfilePic(req.body.id);
      			res.sendStatus(200)
      		}
        });
      }
    })
  });

  // Route to edit a profile
  router.post('/editProfile', auth, function(req, res, next) {
    let profile = JSON.parse(req.body.profile);
    // check if user is allowed to edit the profile. Admins can edit profiles they're not the author of
    if( req.user._id != profile.author && req.user.role != "admin")
    {
      Utilities.log("Unauthorized attempt to edit a profile", "info");
      res.sendStatus(401)
    }
    else
    {
      // make sure only admins can modify the "author" and "published" fields
      if( req.user.role != "admin" ){
        Utilities.log("Deleting unauthorized field", "info");
        delete profile.published;
        delete profile.author
      }
      Utilities.log("Looking for image :", "info");
      if(profile.image){
        Utilities.log("Attempt to change profile picture", "info");
        saveProfilePic(profile.image, profile.id)
          .then(res => Utilities.log("Profile picture changed for profile " + profile.title + "res : " + res, "info"))
          .catch(err => Utilities.log("Error changing profile picture for profile " + profile.title + "err : " + err, "error"));
        delete profile.image;
      }
      Profile.findByIdAndUpdate(profile._id, profile, { runValidators : true }, function(err){
        if (err)
        {
          Utilities.log(err, "error");
          res.sendStatus(500)
        }
        else
        {
          res.sendStatus(200)
        }
      })
    }
  });

  router.post('/getUserProfiles', auth, function(req, res, next) {
    Profile.find({author : req.body.author}, function(err, profiles){
      if(profiles){
        res.status(200).json(profiles);
      }
      else{
        res.status(520)
      }
    })
  });

  // Route to verify if a music for the profile exists
  router.get('/getProfileMusic', function(req, res, next) {
    let music = __dirname+'/../../public/audio/soundtrack/profiles/'+req.query.id+'.mp3';
    res.json(fs.existsSync(music));
  });

  // invoked for any unhandled request passed to this router
  router.use(function(req, res, next) {
    Utilities.log('Unhandled API request. URL :' + req.originalUrl, "info" )
    res.sendStatus(404);
  });

  function getProfilePicPath(profileID){
  	let dir = __dirname+'/../../public/profile-pics/';
  	if (!fs.existsSync(dir)){
  	    fs.mkdirSync(dir);
  		Utilities.log('created '+ dir, "info");
  	}

  	return dir+profileID+'.png';
  }

  async function saveProfilePic(image, profileID){
    Utilities.log("Executing saveprofilepic", "info");
  	let commaIndex = image.indexOf(',');
    Utilities.log("commaIndex : " + commaIndex, "info");
  	let data = image.substring(commaIndex+1, image.length);
    Utilities.log("data : ", "info");
  	fs.writeFile(getProfilePicPath(profileID), data,'base64', function(err) {
  	    if(err) {
  	        return err;
  	    }else{
  	    	return true;
  	    }

  	});
  }

  function deleteProfilePic(profileID){
    Utilities.log("deleting profile pic", "info");
  	fs.unlink(getProfilePicPath(profileID), function(error){
  		if(error){
        Utilities.log('could not delete profile pic '+ profileID, "error");
      }else{
        Utilities.log('Profile picture deleted '+ profileID, "error");
      }

  	});
    Utilities.log("Done trying to delete picture", "info");
  }
  return router;
}

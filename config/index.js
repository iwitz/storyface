var environment = "dev" // dev or prod
var fs = require('fs');
var config = JSON.parse(fs.readFileSync(__dirname + "/config.json"))[environment];

module.exports = function(){
  /* environment server config */
  this.getEnvironment = function(){
    return environment;
  }

  this.getMongoServer = function(){
    return  config["mongoserver"]
  }

  this.getServerPort = function(){
    return config["serverport"]
  }

  this.getServerIP = function(){
    return config["serverip"]
  }

  /* admin properties */
  this.getAdminPassword = function(){
    return config["adminpassword"]
  }

  this.getAdminSurname = function(){
    return config["adminsurname"]
  }

  this.getAdminEmail = function(){
    return config["adminemail"]
  }

  this.getAdminName = function(){
    return config["adminname"]
  }

  this.getSalt = function(){
    return config["salt"]
  }

  /* state of the webcam */
  this.webcamEnabled = function(){
    return this.webcam == true;
  }

  this.setWebcam = function(value){
    this.webcam = value;
  }

  this.webcam = true;

  return this;
}

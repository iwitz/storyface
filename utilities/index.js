var winston = require('winston');
// enable timestamps when logging
winston.remove(winston.transports.Console);
winston.add(winston.transports.Console, {'timestamp':true});

module.exports = function(){
  this.reqIsStoryfacePage = function(req){
    const components = ["gender",
              "choose",
              "chat",
              "profiles",
              "infos",
              "help",
              "user-info",
              "emotions",
              "login",
              "debug"];
    return components.find(component => req.originalUrl.includes(component));
  }

  this.log = function(error, level="info"){
    winston.log(level, error);
  }

  return this;
}

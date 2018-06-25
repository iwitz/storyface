module.exports = function(Config){
  this.profile = require('./profile.js')()
  this.user = require('./user.js')(Config)
}

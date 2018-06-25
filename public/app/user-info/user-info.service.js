//This service stores the user informations so that they can be retrieved in the whole application
angular.module('storyface')
	.service('userInfoService',[
				'$cookies',
				'$http',
				'authenticationService',
			function userInfoService($cookies, $http, authenticationService){
				this.user;
				const root = '/storyface/api/users'
				const userCookieKey='userInfo'

				//Erase the current user and replace it by the user specified in userInfo, can be called without user info to store the current user
				this.saveUser = function(userInfo){
					if(userInfo)
						this.user = userInfo;
					$cookies.putObject(userCookieKey, this.user);
				}

				this.getUser = function(){
					if(!this.user)
						this.user = $cookies.getObject(userCookieKey);
					return this.user;
				}

				this.removeUser = async function(user) {
					try{
						await $http.post(root + '/deleteUser', {"id" : user._id, "authenticationToken" : authenticationService.getToken()})
						return true
					}catch(error){
						console.log(error);
						return false
					}
				}

				this.getGender = function(){
					const user = this.getUser();
					return user?user.gender:undefined;
				}

				this.getPreferredGender = function(){
					return this.getUser()['preferredGender'];
				}

				this.getAge = function(){
					return this.getUser()['age'];
				}

				this.getForbiddenProfiles = function(){
					if(!this.getUser()['forbiddenProfileIDs'])
						this.getUser()['forbiddenProfileIDs'] = [];
					return this.user['forbiddenProfileIDs'];
				}

				this.addForbiddenProfile = function(profileID){
					this.getForbiddenProfiles().push(profileID);
					this.saveUser();
				}

				this.emptyForbiddenProfiles = function(){
					this.user.forbiddenProfileIDs = [];
					this.saveUser();
				}

				this.getUserById = async function(userId){
					// return the user with ID userId
					return this.mongoToStoryface((await $http({
						url : root + '/getUserById',
						method : "GET",
						params : {
							"id" : userId,
							"authenticationToken" : authenticationService.getToken()
						}
					})).data);
				}

				this.editUser = async function(user) {
					try{
						await $http.post(root + '/editUser', {"user" : JSON.stringify(user), "authenticationToken" : authenticationService.getToken()})
						return true;
					}catch(error){
						console.error(error);
						return false;
					}
				}

				this.mongoToStoryface = function(user){
					user.id = user._id
					return user
				}

			}]);

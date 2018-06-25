//This service is the interface between Storyface and the profile database
angular.module('storyface')
		.service('profileService', [
			"$http",
			"authenticationService",
			function profileService($http, authenticationService){
				const root = '/storyface/api/profiles'

				this.getAllProfiles =  async function(){
					// return all the profiles of the database
					let raw_profiles = (await $http.get(root + '/getAllProfiles')).data
					return raw_profiles.map(profile => this.mongoToStoryface(profile));
				}

				this.getRandomProfile = async function(forbiddenIDs, conditions, age){
					// return a random profile that is not in the forbiddenIDs list
					return this.mongoToStoryface((
							await $http({
								url : root + '/getRandomProfile',
								method : "GET",
								params : {"forbiddenProfiles" : forbiddenIDs, "conditions" : JSON.stringify(conditions), "age" : age}
							})
						).data);
				}

				this.getProfileById = async function(profileId){
					// return the profile with ID profileID
					return this.mongoToStoryface((await $http({
						url : root + '/getProfileById',
						method : "GET",
						params : {"id" : profileId }
					})).data);
				}

				this.getUserProfiles = async function(author){
					const res = (await $http.post(root + '/getUserProfiles', {"author" : author, "authenticationToken" : authenticationService.getToken()})).data;
					return res.map(profile => this.mongoToStoryface(profile));
				}

				this.createProfile = async function(profile){
					// TODO : handle error code 500
					// profile is an object that must contain the informations of a model in the same way specified in the /models/profile.js file
					try{
						await $http.post(root + '/createProfile', {"profile" : profile, "authenticationToken" : authenticationService.getToken()})
						return true
					}catch(error){
						console.log(error);
						return false
					}
				}

				this.deleteProfile = async function(profileId){
					try{
						await $http.post(root + '/deleteProfile', {"id" : profileId, "authenticationToken" : authenticationService.getToken()})
						return true
					}catch(error){
						console.log(error);
						return false
					}
				}

				this.editProfile = async function(profile) {
					try{
						await $http.post(root + '/editProfile', {"profile" : JSON.stringify(profile), "authenticationToken" : authenticationService.getToken()})
						return true;
					}catch(error){
						console.error(error);
						return false;
					}
				}

				this.importProfiles = async function(profiles){
					try{
						await $http.post(root + '/importProfiles', {"profiles" : profiles, "authenticationToken" : authenticationService.getToken()})
						return true;
					}catch(error){
						console.error(error);
						return false;
					}
				}

				this.mongoToStoryface = function(profile){
					profile.id = profile._id
					return profile
				}
			}]);

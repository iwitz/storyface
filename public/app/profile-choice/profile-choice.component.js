//This is the profile choice page, a fictive person is suggested to the user, who decide if they are interested or not
angular.module('storyface')
		.component('profileChoice', {
			controller : [
				'$scope',
				'$translate',
				'userInfoService',
				'profileService',
				'userInfoService',
				'audioService',
				function profileChoiceController($scope, $translate, userInfoService, profileService, faceAnalysisService, audioService){
					this.lang;
					this.profile;
					this.noRemainingProfiles;

					this.profilePicIsLoading;

					//Loads a profile from the database, then displays it
					this.$onInit = function(){
						this.lang = $translate.use();
						this.noRemainingProfiles = false;
						this.next();
					}

					this.next = function(profileToForbid){
						this.profilePicIsLoading = true;
						if(profileToForbid) {
							userInfoService.addForbiddenProfile(profileToForbid.id)
						}
						profileService.getRandomProfile(userInfoService.getForbiddenProfiles(),
							{
								"language" : $translate.use(),
								"gender" : userInfoService.getPreferredGender()
							},
							userInfoService.getAge()).then(res =>
								{
									if(res)
									{
										this.profile = res;
									}
									else
									{
										this.noRemainingProfiles=true;
									}
									if(this.profile){
										audioService.playProfileMusic(this.profile);
									}									
									$scope.$digest();
						});
					}

					this.emptyForbiddenProfiles = function(){
						userInfoService.emptyForbiddenProfiles();
						this.noRemainingProfiles = false;
						this.next();
					}

					this.profilePicIsLoaded = function(){
						this.profilePicIsLoading = false;
					}

					this.profilePicNotFound = function(){
						this.profilePicIsLoading = false;
						//console.log('profile pic not found');
					}
				}
			],
		 	templateUrl : 'app/profile-choice/profile-choice.component.html',
		}).directive('imageOnLoad', function() {
        return {
            restrict: 'A',
            link: function(scope, element, attrs) {
                element.bind('load', function() {
                    //call the function that was passed
                    scope.$apply(attrs.imageOnLoad);
                });
            }
        };
    });
angular.module('storyface')
		.directive('onLoadingError', function() {
			return {
				restrict : 'A',
				link: function(scope, element, attrs) {
				  element.bind('error', function() {
				  	scope.$apply(attrs.onLoadingError);
				  });
				}
			}
		});

angular.module('storyface')
		.component('addProfile', {
		 templateUrl : 'app/profile-management/add-profile.component.html',
		 controller : ['profileService',
		 				'$scope',
		 				'$translate',
		 				'$location',
		 				'storyfaceDialogService',
		 				'authenticationService',

		 	function addProfileController(profileService, $scope, $translate, $location, storyfaceDialogService, authenticationService){

		 		this.lang;

		 		this.profile;

		 		this.$onInit = function(){
		 			this.lang = $translate.use();
		 			this.profile = this.getEmptyProfile();
		 		}

		 		this.getEmptyProfile = function(){
		 			return {
		 				title : undefined,
						language : undefined,
						gender : undefined,
						age : undefined,
						name : undefined,
						profession : undefined,
						quote : undefined,
						hobby : undefined,
						movie : undefined,
						target : undefined,
						discussion : undefined,
						author : authenticationService.getUserId()
		 			}
		 		}

		 		this.addProfile = function(){
		 			profileService.createProfile(this.profile).then(profileID => {
		 				//TODO : Redirects to the edition page of the profile
		 				if(profileID){
			 				$location.path('/'+this.lang+'/profiles');
			 				$scope.$apply();
			 			}else{
			 				storyfaceDialogService.toast("save_unsuccessful");
			 			}

		 			})
		 		}
		 	}
		 	]
		 });

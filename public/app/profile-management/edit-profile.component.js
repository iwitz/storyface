angular.module('storyface')
		.component('editProfile', {
		 templateUrl : 'app/profile-management/edit-profile.component.html',
		 controller : ['profileService',
		 				'$scope',
		 				'$translate',
		 				'$routeParams',
		 				'storyfaceDialogService',
		 	function editProfileController(profileService, $scope, $translate, $routeParams, storyfaceDialogService){

		 		this.lang;

		 		this.profile;
		 		this.currentlyEditing;

		 		this.$onInit = function(){
		 			this.currentlyEditing = false;
		 			this.lang = $translate.use();
					profileService.getProfileById($routeParams.profileID).then(res => {
						this.profile = res;
						$scope.$digest();
					});
		 		}

		 		this.saveProfile = function(){
		 			this.currentlyEditing = true;
		 			profileService.editProfile(this.profile).then(success =>{
		 				let message;
		 				if(success)
		 					message = "saved_successfully";
		 				else
		 					message = "save_unsuccessful";

		 				storyfaceDialogService.toast(message);
	 					this.currentlyEditing=false;
		 			});
		 		}
		 	}
		 	]
		 });

angular.module('storyface')
		.component('userInfoEdit', {
		 templateUrl : 'app/user-info/user-info-edit.component.html',
		 controller : ['userInfoService',
		 				'$scope',
		 				'$translate',
		 				'$routeParams',
		 				'storyfaceDialogService',
		 	function userInfoEditController(userInfoService, $scope, $translate, $routeParams, storyfaceDialogService){
				 this.user;

		 		this.$onInit = function(){
						userInfoService.getUserById($routeParams.userID).then(res => {
						this.user = res;
						$scope.$digest();
					});
		 		}

		 		this.saveUser = function(){
		 			userInfoService.editUser(this.user).then(success =>{
		 				let message;
		 				if(success)
		 					message = "Saved successfully";
		 				else
		 					message = "Save unsuccessful";

		 				storyfaceDialogService.toast(message);
		 			});
		 		}
		 	}
		 	]
		 });

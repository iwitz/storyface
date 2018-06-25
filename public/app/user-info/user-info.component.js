angular.module('storyface')
		.component('userInfo', {
		 templateUrl : 'app/user-info/user-info.component.html',
		 controller : ['userInfoService',
		 				'$scope',
		 				'$translate',
		 				'storyfaceDialogService',
						'authenticationService',
						'$location',
						'$filter',
		 	function userInfoController(userInfoService, $scope, $translate, storyfaceDialogService, authenticationService, $location, $filter){

		 		this.lang;
		 		this.users;

		 		this.$onInit = function(){

					 this.currentUserRole = authenticationService.getUserRole();
					 this.retrieveUsers();
				 };

				this.retrieveUsers = async function() {
					if (this.currentUserRole === "admin") {
						this.users = (await authenticationService.getUserList()).data;
						$scope.$digest();
					 }
				}

		 		this.remove = async function(user){
		 			const confirmValidation = await storyfaceDialogService.showConfirm({
						title : 'Delete user',
						subtitle : 'Do you really want to delete this user ?',
						validButton : 'Delete',
						cancelButton : 'Cancel'
		 			});

		 			if(confirmValidation){
		 				const success = await userInfoService.removeUser(user);
		 				if(success){
	 						this.users.splice(this.users.indexOf(user), 1);
	 						storyfaceDialogService.toast("Deletion successful");
		 				}else{
		 					storyfaceDialogService.toast("Deletion unsuccessful");
		 				}
		 			}
		 		}

		 		this.getUsers = function(lang){
		 			if(this.users)
			 			return this.users;
		 		}
		 	}
		 	]
		 })

angular.module('storyface')
		.component('authentication', {
			controller : [
				"authenticationService",
				"storyfaceDialogService",
				'$translate',
				"$location",
				"$filter",
				function authenticationController(authenticationService, storyfaceDialogService, $translate, $location, $filter){

					this.username;
					this.password;

					this.$onInit = function(){
						this.username = "";
						this.password = ""
					}


					 this.login = async function(){
						try{
							await authenticationService.login(this.username, this.password);
							// Authentication Successful
							storyfaceDialogService.toast("authentication_successful")
							$location.path("/" + $translate.use() + "/profiles")
						}catch(err){
							// Authentication unsuccessful
							console.log(err.status)
							if(err.status == 401){
								message ="invalid_credentials";
							}
							else{
								message = "unknown_error";
							}
							storyfaceDialogService.toast(message)
						}
					}

				}
			],
		 	templateUrl : 'app/authentication/authentication.component.html',
		});

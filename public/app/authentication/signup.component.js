angular.module('storyface')
		.component('signup', {
			controller : [
				"authenticationService",
				"storyfaceDialogService",
				function signupController(authenticationService, storyfaceDialogService){
					this.username;
					this.password;
					this.name;
					this.surname;
					this.email;
					//this.passwordbis

					 this.signup = async function(){
					 	try{
					 		await authenticationService.signup(this.username, this.password, this.name, this.surname, this.email);
			 				storyfaceDialogService.toast("You have successfully signed up. You can now log in.");
					 	}catch(error){
							let message;
							if(error.status == 409)
							{
								message = "Your email address or your username already exist in the database. You cannot create 2 accounts with either the same username or email address."
							}
							else if( error.status == 422 )
							{
								message = "Your username must contain at least 3 characters and your password at least 6 characters."
							}
							else if( error.status == 520 )
							{
								message = "Server error"
							}
							else{
								message = "An unknown error occurred."
							}
							storyfaceDialogService.toast(message);
						}
					}
				}
			],
		 	templateUrl : 'app/authentication/signup.component.html',
		});

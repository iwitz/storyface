//In this page the user is invited to express their emotions, before profiles are suggested
angular.module('storyface')
		.component('storyfaceHeader', {
			bindings : {
				hideTitle : '@'
			},
			controller : [
				'$translate',
				'authenticationService',
				'$location',
				'audioService',
				function headerController($translate, authenticationService, $location, audioService){
					this.lang;
					this.username;
					this.isAdmin;

					this.$onInit = function(){
						this.lang = $translate.use();
						this.username = authenticationService.getUserName();
						this.isAdmin = (authenticationService.getUserRole() === "admin") ? 1 : 0;
					}
					this.logout = function(){
						authenticationService.logout();
						this.username = undefined
					}
				}
			],
		 	templateUrl : 'app/storyface-header/storyface-header.component.html',
		});

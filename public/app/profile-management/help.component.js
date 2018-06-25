angular.module('storyface')
		.component('help', {
			controller : [
				'$translate',
				function infoController($translate){
					this.lang;

					this.$onInit = function(){
						this.lang = $translate.use();
					}
				}
			],
		 	templateUrl : 'app/profile-management/help.component.html',
		});

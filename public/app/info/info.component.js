angular.module('storyface')
		.component('info', {
			controller : [
				'$translate',
				function infoController($translate){
					this.lang;

					this.$onInit = function(){
						this.lang = $translate.use();
					}
				}
			],
		 	templateUrl : 'app/info/info.component.html',
		});

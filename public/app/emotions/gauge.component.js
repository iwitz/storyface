//In this page the user is invited to express their emotions, before profiles are suggested
angular.module('storyface')
		.component('gauge', {
			bindings : {
				percentage : '<',
				emotion : '<',
				color : '<'
			},
			controller : [
				'$element',
				function gaugeController($element){
					this.degValue;
					this.gradientColor;

					this.$onChanges = function(changes){
						if(this.percentage > 100)
							this.percentage = 100;

						if(this.percentage<50){
							this.degValue = 90 + 360 * this.percentage/100;	
							this.gradientColor = "white";						
						}else{
							this.degValue = 90 + 360 * (this.percentage - 50)/100;
							this.gradientColor = this.color ;
						}
						this.degValueLeft=90;
					}
				}
			],
		 	templateUrl : 'app/emotions/gauge.component.html',	
		});

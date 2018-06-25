angular.module('storyface')
		.component('message', {
			bindings : {
				initialMessage : '<',
				exitOption : '<?',
				label : '@',
				messageChange : '&',
			},
			 templateUrl : 'app/profile-management/message.component.html',
			 controller : [
			 	function messageController(){
			 		
			 		this.emotions;
			 		this.innerValue;

			 		this.$onInit = function(){
			 			this.emotions = ['anger','disgust','fear','happiness','sadness','surprise','neutral'];
			 			this.innerValue = this.outerMessageToInner(this.initialMessage);
			 		}

			 		this.outerMessageToInner = function(message){
			 			let res = {
			 				text : message.text,
			 				emotion : message.emotion
			 			}
			 			if(message.homosexual_text){
			 				res.homosexual_text = message.homosexual_text;
			 				res.homosexual_specific = true;
			 			}
			 			if(this.exitOption)
			 				res.exit = !!message.exit;

			 			return res;
			 		}

			 		this.innerMessageToOuter = function(message){
			 			let res = {
			 				text : message.text,
			 				emotion : message.emotion
			 			}

			 			if(message.homosexual_specific && message.homosexual_text){
			 				res.homosexual_text = message.homosexual_text
			 			}

			 			if(this.exitOption)
			 				res.exit = !!message.exit;

			 			return res;
			 		}

			 		this.fireMessage = function(){
			 			// console.log('fire');
			 			// console.log(this.innerMessageToOuter(this.innerValue));
			 			this.messageChange({message : this.innerMessageToOuter(this.innerValue)});
			 		}
			 	}
			 ]});

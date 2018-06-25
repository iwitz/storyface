angular.module('storyface')
		.component('discussion', {
		 templateUrl : 'app/profile-management/discussion.component.html',
		 bindings : {
		 	ngModel : '=',
		 	ngChange : '&'
		 },
		 controller : [	'$scope',
		 				'$translate',
		 	function profileController($scope, $translate){

		 		this.emotions;

		 		this.lang;

		 		this.ngModel;

		 		this.$onInit = function(){
		 			this.lang = $translate.use();
		 			this.emotions = ['anger','disgust','fear','happiness','sadness','surprise','neutral'];
		 		}

		 		this.$onChanges = function(){
		 			if(!this.ngModel){
		 				this.ngModel = this.getEmptyDiscussion();
		 			}
		 		}

		 		this.getEmptyDiscussion = function(){
		 			return {
		 					normal_flow : [this.getEmptyStep()],
		 					answer_after_phone_number : this.getEmptyMessage(),
							answer_exit_on_lies : this.getEmptyMessage()
		 				}
		 		}

		 		this.getEmptyStep = function(){
		 			return 	{
								question : this.getEmptyMessage(),
								answers : [this.getEmptyAnswer()]
							}

		 		}

		 		this.getEmptyAnswer = function(){
		 			return {
								user_answer : this.getEmptyMessage(),
								profile_answer : this.getEmptyMessage()
							}
		 		}

		 		this.getEmptyMessage = function(){
		 			return {
								text : '',
								emotion : 'neutral'
							}
		 		}

				this.resizeContainer = function(){
					// Set a timeout so the ew element is properly added when the container size is adjusted
					setTimeout(function() {
						var panel = document.getElementById("discussion-wrapper");
						panel.style.maxHeight = panel.scrollHeight + "px";
					 }, 100);

				}

		 		this.addStepAbove = function(index){
		 			this.ngModel.normal_flow.splice(index, 0, this.getEmptyStep());
					this.resizeContainer();
		 		}

				this.addStepBelow = function(index){
		 			this.ngModel.normal_flow.splice(index+1, 0, this.getEmptyStep());
					this.resizeContainer();
				}

				this.removeStep = function(index){
					this.ngModel.normal_flow.splice(index, 1);
					this.resizeContainer();
				}

				this.addAnswer = function(step){
					step.answers.push(this.getEmptyAnswer());
					this.resizeContainer();
				}

				this.removeAnswer = function(step, index){
					step.answers.splice(index, 1);
					this.resizeContainer();
				}
		 	}
]});

//In this page the user is invited to express their emotions, before profiles are suggested
angular.module('storyface')
		.component('chat', {
			controller : [
				'$translate',
				'$routeParams',
				'profileService',
				'$scope',
				'$anchorScroll',
				'faceAnalysisService',
				'storyfaceDialogService',
				'userInfoService',
				'$location',
				'audioService',
				'naughtyBoyService',
				function chatController($translate, $routeParams, profileService, $scope, $anchorScroll, faceAnalysisService, storyfaceDialogService, userInfoService, $location, audioService, naughtyBoyService){
					//Defines the writer of the message
					const me = "me";
					const profile = "profile"
					const minTypingTime = 0;
					const typingSpeed = 25;
					const minReadingTime = 0//1500;
					const maxReadingTime = 0//3000;
					const maxLies = 2;
					const exit_on_lies_code = 2;
					const exit_on_profile_reject_code = 1;
					const exit_success = 0;
					this.exit_code;
					this.lang;

					//The profile to chat with
					this.profile;
					//The actual discussion happening in the chat
					this.actualDiscussion;

					//The current step index in the chat
					this.currentStepIndex;
					this.currentStep;

					this.profileIsTyping;
					this.possibleAnswers;

					this.liesCount;
					this.profileHasLeftChat;

					//Load the profile and init the vars
					this.$onInit = function(){
						this.lang = $translate.use();
						this.currentStepIndex = -1;
						this.profileIsTyping = false;
						this.possibleAnswers = [];
						this.liesCount = 0;
						this.profileHasLeftChat = false;

						profileService.getProfileById($routeParams.profileID).then(res => {
							this.profile = res;
							audioService.playProfileMusic(this.profile);
							this.actualDiscussion = [];
							this.nextStep();
							$scope.$digest();
						});
					}

					//Go to the next step of the discussion
					this.nextStep = async function(){
						this.currentStepIndex++;
						//End the discussion after the last step
						if(this.currentStepIndex >= this.profile.discussion.normal_flow.length){
							await sleep(this.getReadingTime());
							this.exit_code = exit_success;
							this.endDiscussion();
						}else{
							this.currentStep = this.profile.discussion.normal_flow[this.currentStepIndex];
							//Wait a bit before going to the ne
							await sleep(this.getReadingTime());
							this.askQuestion(this.currentStep.question);
						}
					}

					//Add a question in the chat
					this.askQuestion = async function(question){
						//Shows typing animation
						this.profileIsTyping = true;
						this.renderChat();
						await sleep(this.getTypingTime(question.text.length));//types for a while

						//Display the question
						question.me = false;//display purpose
						this.actualDiscussion.push(this.handleHomosexuality(question))
						this.profileIsTyping = false;
						for(const answer of this.currentStep.answers){
							answer.user_answer = this.handleHomosexuality(answer.user_answer)
							this.possibleAnswers.push(this.handleHomosexuality(answer));
						}
						this.renderChat();

					}

					//To leave chat with a message
					this.leave = async function(){
						const message = await storyfaceDialogService.prompt({
							title : await $translate('leave_conv'),
							label : await $translate('leave_let_message'),
							validButton : await $translate('leave'),
							cancelButton : await $translate('cancel'),
							initialValue : await $translate('leave_message')
						});
						if (message) {
							const emotionOnLeave = await faceAnalysisService.getMainEmotion();
							const answer = {
								text : message,
								emotion : emotionOnLeave,
								me : true
							}
							this.actualDiscussion.push(answer);
							this.userHasLeftChat = true;
							this.renderChat();
							await sleep(2000);
							$location.path('/'+this.lang+'/choose');
							$scope.$apply();
						}
					}

					//Called when a user click on an answer, push the answer to the discussion and goes to the next step
					this.answer = async function(answer){
						//Immediately display the user's answer
						answer.user_answer.me = true;
						this.actualDiscussion.push(this.handleHomosexuality(answer.user_answer));
						this.possibleAnswers = [];
						this.renderChat(true);

						let userLying = ! await this.checkUserEmotion(answer.user_answer.emotion);

						if(userLying && this.liesCount>maxLies){
							await sleep(this.getReadingTime());
							this.exit_code = exit_on_lies_code;
							this.endDiscussion();
						}else{


							if(answer.profile_answer.text){
								//Wait some time for the profile to start typing
								await sleep(this.getReadingTime());

								this.profileIsTyping = true;
								this.renderChat();

								await sleep(this.getTypingTime(answer.profile_answer.text.length));

								this.profileIsTyping = false;
								answer.profile_answer.me = false;
								this.actualDiscussion.push(this.handleHomosexuality(answer.profile_answer));
								this.renderChat();
							}
							if(answer.profile_answer.exit){
								await sleep(this.getReadingTime());
								this.exit_code = exit_on_profile_reject_code;
								this.endDiscussion();
							}else{
								this.nextStep();
							}
						}

					}

					//End the discussion between the user and the profile
					this.endDiscussion = async function(){
						console.log("exit : " + this.exit_code + " code success : " + exit_success);
						let status = this.exit_code;
						if(status === exit_on_profile_reject_code){

						}else if(status===exit_on_lies_code){
							if(this.profile.discussion.answer_exit_on_lies && this.profile.discussion.answer_exit_on_lies.text){
								this.profileIsTyping = true;
								this.renderChat();
								await sleep(this.getTypingTime(this.profile.discussion.answer_exit_on_lies.text.length));
								this.profileIsTyping = false;
								this.actualDiscussion.push(this.handleHomosexuality(this.profile.discussion.answer_exit_on_lies));
								this.renderChat();
								await sleep(this.getReadingTime());
							}
						}else{
							// Do not show this profile again
							userInfoService.addForbiddenProfile(this.profile._id);
							await this.showSuccess();
							await sleep(this.getReadingTime());
							if(this.profile.discussion.answer_after_phone_number && this.profile.discussion.answer_after_phone_number.text){

								this.profileIsTyping = true;
								this.renderChat();
								await sleep(this.getTypingTime(this.profile.discussion.answer_after_phone_number.text.length));
								this.profileIsTyping = false;
								this.actualDiscussion.push(this.handleHomosexuality(this.profile.discussion.answer_after_phone_number));
								this.renderChat();
								await sleep(this.getReadingTime());
							}
						}

						this.profileHasLeftChat = true;
						this.renderChat();
					}

					this.renderChat = async function(doNotDigest){
						if(!doNotDigest)
							$scope.$digest();
						//The sleep is necessary so that the scroll is done once the view is rendered
						await sleep(0);
						$anchorScroll('chatBottom');
					}

					this.checkUserEmotion = async function(expectedEmotion){
						if(expectedEmotion !== 'neutral'){
							let emotion = await	faceAnalysisService.getMainEmotion();
							if(emotion!=expectedEmotion){
								this.liesCount++;

								//Asynchronously displays a warning
								this.showWarning(expectedEmotion, emotion);
								return false;
							}
						}
						return true;
					}

					this.showWarning = async function(expectedEmotion, actualEmotion){
						let userGender = userInfoService.getGender();
						let title = await $translate('liar', {gender : userGender});
						let expectedEmotionTranslated = await $translate(expectedEmotion+"_adjective", {gender : userGender});
						let actualEmotionTranslated = await $translate(actualEmotion+"_adjective", {gender : userGender});
						let warning_text = await $translate('emotion_warning', {
							expectedEmotion : expectedEmotionTranslated,
							actualEmotion : actualEmotionTranslated
						});
						let lies_left;

						if(this.liesCount<=maxLies){
							lies_left = await $translate('lies_left', {
								nbLiesLeft : maxLies - this.liesCount +1,
								profileName : this.profile.name
							})
						}else{
							lies_left = await $translate('profile_has_been_noticed_youre_lying', {
								profileName : this.profile.name
							});
						}

						storyfaceDialogService.showWarning({
							title : title,
							content : [warning_text, lies_left],
							speech : lies_left
						});
					}

					this.findLoveAgain = async function(){
						await naughtyBoyService.naughtyWarning(this.exit_code);
						$location.path('/'+this.lang+'/choose');
						$scope.$apply();
					}

					this.showSuccess = async function(){
						let your_number = await $translate('Your_number');
						let profile_wants_your_number = await $translate('profile_wants_your_number', {
							profileName : this.profile.name
						});
						let send = await $translate('send')
						let your_number_was_sent_to_profile = await $translate('your_number_was_sent_to_profile', {
							profileName : this.profile.name
						});
						let number = await storyfaceDialogService.prompt({
							title : profile_wants_your_number,
							label : your_number,
							validButton : send
						})
						storyfaceDialogService.toast(your_number_was_sent_to_profile);
					}


					//Returns a random int between min and max typing time
					this.getTypingTime = function(messageLength){
						if(!messageLength)
							messageLength = 0;

						//console.log(1000/typingSpeed*messageLength+minTypingTime);
						return 1000/typingSpeed*messageLength+minTypingTime;
					}

					//Returns a random int between min and max reading time
					this.getReadingTime = function(){
						return Math.random()*(maxReadingTime - minReadingTime)+minReadingTime;
					}

					this.handleHomosexuality = function(message){
						if(message.homosexual_text && userInfoService.getGender()===this.profile.gender)
							message.text = message.homosexual_text;
						return message;
					}

					function sleep(ms){
						  return new Promise(resolve => setTimeout(resolve, ms));
					}

				}
			],
		 	templateUrl : 'app/chat/chat.component.html',
		});

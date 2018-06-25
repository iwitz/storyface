//In this page the user is invited to express their emotions, before profiles are suggested
angular.module('storyface')
		.component('emotions', {
			controller : [
				'$translate',
				'faceAnalysisService',
				'$scope',
				'audioService',
				function emotionsController($translate, faceAnalysisService, $scope, audioService){
					this.lang;
					this.emotionCaptureDelay = 50;
					this.maxEmotion = 50;

					this.displayedEmotions = [
						'anger',
						'disgust',
						'fear',
						'happiness',
						'sadness',
						'surprise',
					];

					this.mainEmotion;
					this.displayFindLoveButton;


					this.emotionCount = [];

					this.$onInit = function(){
						this.lang = $translate.use();
						this.initEmotionCount();
						this.captureEmotions();
						this.displayFindLoveButton = false;
					}

					this.initEmotionCount = function(){
						for(let emotion of this.displayedEmotions){
							this.emotionCount.push({
								emotion : emotion,
								count : 0
							});
						}
					}

					this.captureEmotions = async function(){
						const mainEmotion = await faceAnalysisService.getMainEmotion();
						//console.log(mainEmotion)
						if( mainEmotion && mainEmotion !== "neutral"){
							// Play the right audio
							audioService.play("emotions/" + mainEmotion + ".mp3" ,"main");
						}
						let record = this.emotionCount.find(record => record.emotion === mainEmotion)
						if(record)
							record.count++;

						if(record && record.count >= this.maxEmotion){
							this.mainEmotion = mainEmotion;
							$scope.$apply();
							await sleep(2000);
							this.displayFindLoveButton = true;
							$scope.$apply();
						}else{
							await sleep(this.emotionCaptureDelay);
							this.captureEmotions();
							$scope.$apply();
						}

					}

					function sleep(ms){
						return new Promise(resolve => setTimeout(resolve, ms));
					}

				}
			],
		 	templateUrl : 'app/emotions/emotions.component.html',
		});

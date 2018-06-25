//This component renders the video from the webcam/or a basic canvas (when the website is on without_video mode)
angular.module('storyface')
		.component('faceAnalysis', {
			bindings : {
				videoFps : '<?',
				showEmojis : '<?',
				emojiRefreshDelay : '<?',
				emojiSize : '<?',
			},
			controller : [
			'$element',
			'$scope',
			'faceAnalysisService',

			function faceAnalysisController($element,$scope,  faceAnalysisService){
				this.videoFps = 30;

				//When show emojis is true
				this.emojiRefreshDelay = 100;
				this.currentEmotion;

				this.analysisHasStarted;
				this.webcamDenied;
	
				this.$onInit = function () {
					this.webcamDenied=false;
					//Retrieve the hidden video canvas from VisageTechnologies'API
					this.refCanvas = document.getElementById("canvas");

					//Run the video loop
					this.canvas = $element.children()[0];
					this.drawVideo();
					this.analysisHasStarted = false;
					let context = this;
					faceAnalysisService.waitForStart().then(
						() => {
							this.analysisHasStarted=true;
							$scope.$digest();
						}
						).catch(function(errorCode){
							if(errorCode === faceAnalysisService.webcam_denied_error_code){
								console.log(this)
								console.log(context)
								context.webcamDenied = true;
								$scope.$digest();
								console.log('denied webcam');
							}
						});
				};

				this.$onChanges = function(changes){
					if(changes.showEmojis && this.showEmojis){
						this.foreverTrackEmotion();
					}
				}

				this.foreverTrackEmotion = async function(){
					while(true){
						this.currentEmotion = await faceAnalysisService.getMainEmotion();
						await sleep(this.emojiRefreshDelay);
						$scope.$digest();
					}
				}

				this.drawVideo = function(){
					if(this.refCanvas){
						this.canvas.width = this.refCanvas.width;
						this.canvas.height = this.refCanvas.height;
						this.canvas.getContext('2d').drawImage(this.refCanvas, 0, 0);
					}else{
						//When on no-video mode
						if(this.count===undefined){
								this.count = 0//count is a var incremented at every loop, in order to draw a moving circle
						}else{
							this.count+=10;
						}
						this.canvas.width = 600;
						this.canvas.height = 400;
						let ctx = this.canvas.getContext('2d');
						ctx.beginPath();
						ctx.fillStyle="#000";
						ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
						ctx.fillStyle="#FF0000";
						ctx.fillRect(this.count%this.canvas.width, 100, 50, 50);
						ctx.stroke(); 
					}

					//Set a timer to call drawVideo() after 1/videoFPS seconds 
					let ctrlContext = this;
					setTimeout(function(){
						ctrlContext.drawVideo()
					},1000/this.videoFps);
				}

				function sleep(ms){
					  return new Promise(resolve => setTimeout(resolve, ms));
				}

		 }],
		 templateUrl : 'app/face-analysis/face-analysis.component.html',	
		});

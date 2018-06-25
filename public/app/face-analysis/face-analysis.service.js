//This service provides methods to get informations about the user analysis made by VisageTechnologies API
//The storyface module depends on it
angular.module('storyface')
		.service('faceAnalysisService', function(){
			if(typeof(FaceAnalysisAPI)==="function"){//Normal mode
				this.api = new FaceAnalysisAPI()
			}else{//No video mode
				console.warn('Visage Technologies API unavailable, faceAnalysisService will return random values');
				this.api = new FakeFaceAnalysisApi();
			}
			
			this.webcam_denied_error_code = this.api.webcam_denied_error_code;

			this.getAge = function(){
				return this.api.getAge();
			}

			this.getGender = function(){
				return this.api.getGender();
			}

			this.waitForStart = function(){
				return this.api.analysisStart();
			}

			this.getGenderAndAge = async function(){
				return {
					age : await this.getAge(),
					gender : await this.getGender()
				}
			}

			this.getMainEmotion = async function(){
				let emotions = await this.api.getEmotions();
				let mainEmotion;
				let maxValue = 0;
				for(emotion in emotions){
					if(emotions[emotion] > maxValue){
						maxValue = emotions[emotion];
						mainEmotion = emotion;
					}
				}
				return mainEmotion
			}
		});

//This API is made for development, in order to avoid using the camera and the huge visageTechnologies API when testing
//The values returned change every n seconds, so that the application keeps some consistency
let FakeFaceAnalysisApi = function(){
	this.firstTime = true;

	this.getAge = async function(){
		if(this.firstTime){
			await this.analysisStart();
			await this.sleep(2000);
			this.firstTime = false;
		}
		return Math.random()*100;
	}

	this.getEmotions = async function(){
		if(this.firstTime){
			await this.analysisStart();
			await this.sleep(2000);
			this.firstTime = false;
		}
		let tenSeconds = Math.floor((new Date()).getTime()/1000/2);
		let modulo = tenSeconds%7;
		return {
			'anger' 	: modulo===0?1:0,
			'disgust' 	: modulo===1?1:0,
			'fear' 		: modulo===2?1:0,
			'happiness'	: modulo===3?1:0,
			'sadness' 	: modulo===4?1:0,
			'surprise' 	: modulo===5?1:0,
			'neutral'	: modulo===6?1:0
			}
	}

	this.analysisStart = async function(){
		if(this.firstTime){
			await this.sleep(2000);
			this.firstTime = false;
		}
		return true;
	}

	this.getGender = async function(){
		if(this.firstTime){
			await this.analysisStart();
			await this.sleep(2000);
			this.firstTime = false;
		}
		let tenSeconds = Math.floor((new Date()).getTime()/1000/6);
		let isEven = tenSeconds%2 ===0;
		return isEven?'m':'f';
	}
	this.sleep = function(ms) {
	  return new Promise(resolve => setTimeout(resolve, ms));
	}
}

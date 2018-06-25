//The gender page detects the user's age and gender, and ask them to choose between man and woman
angular.module('storyface')
		.component('gender', {
		 templateUrl : 'app/gender/gender.component.html',
		 controller : ['faceAnalysisService',
		 				'$scope',
		 				'$translate',
		 				'userInfoService',
		 	function genderController(faceAnalysisService, $scope, $translate, userInfoService){
		 		//Store the last states in order to print for the average state
		 		this.ageList;
		 		this.maleList;	//1 if male state, 0 if woman

		 		const storedStates = 50

		 		this.disableGenderSelection;

		 		this.faceAnalysisHasStarted;

		 		//Displayed info
		 		this.gender;
		 		this.age;
		 		this.lang;
		 		this.translationData;

		 		this.$onInit = function(){
			 		this.ageList = [];
			 		this.maleList = [];
			 		this.lang = $translate.use();
			 		this.refreshGender(100);
			 		this.disableGenderSelection = true;

			 		this.faceAnalysisController = false;
			 		faceAnalysisService.waitForStart().then(() => {
			 			this.faceAnalysisHasStarted = true;
			 			$scope.$digest();
			 		}).catch(function(error){

			 		});
		 		}

		 		//Ask the faceanalysis service for the gender and states continuously
		 		this.refreshGender = function(delay){
		 			//Request to the faceanalysis service
			 		faceAnalysisService.getGenderAndAge().then(res => {
			 			//Store the gender info
			 			this.maleList.push(res.gender==='m'?1:0);
			 			//Shift the array if too big
			 			if(this.maleList.length > storedStates)
			 				this.maleList.shift();
			 			//Stores the age info
			 			this.ageList.push(res.age);
			 			if(this.ageList.length>storedStates)
			 				this.ageList.shift();

			 			//If there are many 1 (=male state), the mean is over 0.5 and the displayed gender is switched to man
			 			this.gender= average(this.maleList)>0.5? 'm' : 'f';
			 			//The displayed age is the average of all the ages stored
			 			this.age = Math.floor(average(this.ageList));

			 			this.translationData = {
			 				age : this.age,
			 				gender : this.gender
			 			}

			 			this.disableGenderSelection = false;

			 			//Template refresh
			 			$scope.$digest();

			 			//Calls itsel after <delay> milliseconds
				 		ctrl = this;
				 		setTimeout(function(){
				 			ctrl.refreshGender(delay)
				 		}, delay);
			 		})
			 	}

			 	//When the man/woman icon is clicked, the user's data are saved before going to the next page
			 	this.saveUserInfo = function(preferredGender){
			 		userInfoService.saveUser({
			 			age : this.age,
			 			gender : this.gender,
			 			preferredGender : preferredGender
			 		});
			 	}

			 	//Computes the average of a number array
		 		function average(arr){
		 			let sum = 0;
		 			for(let i in arr){
		 				sum+=arr[i]
		 			}
		 			return sum/arr.length
		 		}


		 	}
		 ]
		});

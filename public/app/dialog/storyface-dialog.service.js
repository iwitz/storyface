
angular.module('storyface')
	.service('storyfaceDialogService',
		['$mdDialog',
		 '$mdToast',
		 '$filter',
		 'audioService',
		function storyfaceDialogService($mdDialog, $mdToast, $filter, audioService){
			this.showWarning = async function(options){
				if((typeof content)=== "string"){
					content = [content];
				}

				try{
					await $mdDialog.show({
				      controller: ['$scope', '$translate',
					      function dialogController($scope, $translate){
									// play buzzer sound
									audioService.play("buzzer.mp3", "secondary");
						      if(options.title)
							      	$scope.title = options.title;
							    if(options.content)
							      	$scope.content = options.content;
							    if(options.closeButtonText)
							      	$scope.closeButtonText = options.closeButtonText;
									$scope.promise = false;
									$scope.audio_over = false; // true if the audio was played
									$scope.lang = $translate.use();
									voice = "French Female"; // defaults to French
									if($scope.lang == "en")
									{
										voice = "UK English Female"
									}
									responsiveVoice.speak(options.speech, voice, {onend : function(){
										$scope.audio_over = true;
										$scope.$digest();
									}});
									$scope.closeDialog = async function(options) {
										$mdDialog.hide();
									}
					      }
				      ],
				      templateUrl: 'app/dialog/warning-dialog.html',
				      parent: angular.element(document.body)
				    });
				}catch(error){
					if(error)
						console.error(error)
					//An undefined error is thrown on close
				}
				return;
			}

			this.showConfirm = async function(options){
	 			let confirmBox = $mdDialog.confirm();
	 			if(options.title)
					confirmBox.title(options.title);
				if(options.subtitle)
					confirmBox.textContent(options.subtitle);
				if(options.html)
					confirmBox.htmlContent(options.html);
				if(options.validButton)
					confirmBox.ok(options.validButton);
				if(options.cancelButton)
					confirmBox.cancel(options.cancelButton);
				try{
			 		return await $mdDialog.show(confirmBox);
			 	}catch(error){
			 		if(!error)
			 			return false;
			 		else
			 			console.error(error);
				 }
				 
			}

			this.prompt = async function(options){
				try{
					let res =  await $mdDialog.show({
				      controller: ['$scope',
					      function dialogController($scope){
							  $scope.value = options.initialValue
						      if(options.title)
									  $scope.title = options.title;
								if(options.label){
									$scope.label = options.label;
								}
								if(options.validButton)
									$scope.validButton = options.validButton;
					
								$scope.returnValue = async function(options) {
									$mdDialog.hide($scope.value);
								}

							//Hack to refresh every 50ms
							 let continuousRefresh = function(){
								 setTimeout(function(){
									 if(!$scope.$$phase){
										 $scope.$digest();
									 }
									continuousRefresh();
								 },150)
							 }
							 continuousRefresh();
					      }
				      ],
				      templateUrl: 'app/dialog/prompt-dialog.html',
				      parent: angular.element(document.body)
					});
					return res;
				}catch(error){
					if(error)
						console.error(error)
					//An undefined error is thrown on close
					return undefined;
				}

			}

			this.promptFile = async function(options){
				if((typeof options.acceptedFormats) === "string")
					options.acceptedFormats = [options.acceptedFormats]
				for(let i in options.acceptedFormats)
					options.acceptedFormats[i] = '.'+options.acceptedFormats[i]
				try{
					let fileData = await $mdDialog.show({
				      controller: ['$scope',
				      				'$mdDialog',
					      function dialogController($scope, $mdDialog){
					      	$scope.fileData;
					      	if(options.validButton)
						      	$scope.validButton = options.validButton;
						    if(options.acceptedFormats)
						    	$scope.acceptedFormats = options.acceptedFormats.join(', ');
						    if(options.tip)
						    	$scope.tip = options.tip;
					      	$scope.returnFile = function(){
					      		$mdDialog.hide($scope.fileData);
					      	}
					      }
				      ],
				      templateUrl: 'app/dialog/file-input.template.html',
				      parent: angular.element(document.body),
				      clickOutsideToClose:true,
				    });
				    return fileData
				}catch(error){
					if(error)
						console.error(error)
					return undefined;
				}

			}

			this.promptImage = async function(options){
				if((typeof options.acceptedFormats) === "string")
					options.acceptedFormats = [options.acceptedFormats]
				for(let i in options.acceptedFormats)
					options.acceptedFormats[i] = '.'+options.acceptedFormats[i]
				try{
					let fileData = await $mdDialog.show({
				      controller: ['$scope',
				      				'$mdDialog',
					      function dialogController($scope, $mdDialog){
					      	if(options.validButton)
						      	$scope.validButton = options.validButton;
						    if(options.acceptedFormats)
						    	$scope.acceptedFormats = options.acceptedFormats.join(', ');
						    if(options.tip)
						    	$scope.tip = options.tip;
					      	$scope.returnFile = function(){
					      		$mdDialog.hide($scope.croppedImage);
					      	}
					      }
				      ],
				      templateUrl: 'app/dialog/image-input.template.html',
				      parent: angular.element(document.body),
				      clickOutsideToClose:true,
				    });
				    return fileData
				}catch(error){
					if(error)
						console.error(error)
					return undefined;
				}

			}

			this.toast = async function(content){
				var translate = $filter("translate")
				let container = document.getElementById('toast-container');
				container.style.display = 'inline-block';
				await $mdToast.show(
	  				$mdToast.simple()
					.textContent(translate(content))
                	.parent(container)
	  			);
	  			container.style.display = 'none';

			}

		}]);

angular.module('storyface')
	.directive("fileread", [function () {
			    return {
			        scope: {
			            fileread: "="
			        },
			        link: function (scope, element, attributes) {
			            element.bind("change", function (changeEvent) {
			                var reader = new FileReader();
			                reader.onload = function (loadEvent) {
			                    scope.$apply(function () {
			                        scope.fileread = loadEvent.target.result;
			                    });
			                }
			                reader.readAsDataURL(changeEvent.target.files[0]);
			            });
			        }
			    }
			}]);

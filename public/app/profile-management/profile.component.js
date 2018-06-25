angular.module('storyface')
		.component('profile', {
		 templateUrl : 'app/profile-management/profile.component.html',
		 bindings : {
		 	ngModel : '='
		 },
		 controller : [	'$scope',
		 				 '$translate',
						 'storyfaceDialogService',
						 'authenticationService',
						 '$filter',
						 '$location',
						 '$anchorScroll',
		 	function profileController($scope, $translate, storyfaceDialogService, authenticationService, $filter, $location, $anchorScroll){

		 		this.lang;


		 		this.profilePicSrc;
		 		this.profilePicHasBeenChanged;

		 		this.$onInit = function(){
		 			this.lang = $translate.use();
					this.profilePicHasBeenChanged = false;
					this.currentUserName = authenticationService.getUserName();
					this.currentUserRole = authenticationService.getUserRole();
					console.log(this.currentUserRole)
					this.usersList = this.usersList();
					initAccordion(document.getElementById("accordion"), document.getElementById("discussion"));
		 		}

		 		this.$doCheck = function(){
		 			if(this.ngModel && !this.profilePicHasBeenChanged){
		 				this.profilePicSrc = '/storyface/profile-pics/'+this.ngModel.id+'.png';
		 			}
		 		}


		 		this.logProfile = function(){
		 			console.log(this.ngModel);
		 		}

		 		this.openImageInput = async function(){
					var translate = $filter("translate");
		 			let imageData = await storyfaceDialogService.promptImage({
		 				validButton : translate("change_profile_pic"),
		 				acceptedFormats : ['png'],
		 				tip : translate("change_profile_pic_tip")
		 			});
		 			if(imageData){
						this.profilePicSrc = imageData;
					    this.ngModel.image = imageData;
					    this.profilePicHasBeenChanged = true;
					    $scope.$digest();
					}

		 		}

		 		this.saveLocally = function(){
		 			let jsonString = JSON.stringify([this.ngModel]);
		 			const data = new Blob([jsonString], {type:"application/json"});
		 			saveAs(data, this.ngModel.title+'.json');
				 }

				 this.usersList = function() {
					var list = [];
					authenticationService.getUserList().then( res => {
					   res.data.forEach(function(user) {
						   if (user._id && user.username) {
							   list.push({"username":user.username, "id": user._id});
						   }
					   })
				   });
				   return list;
				}
		 	}

]})

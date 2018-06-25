angular.module('storyface')
		.component('profileList', {
		 templateUrl : 'app/profile-management/profile-list.component.html',
		 controller : ['profileService',
		 				'$scope',
		 				'$translate',
		 				'storyfaceDialogService',
						'authenticationService',
						'$location',
						'$filter',
		 	function profileListController(profileService, $scope, $translate, storyfaceDialogService, authenticationService, $location, $filter){

		 		this.lang;

		 		this.profiles;



		 		this.$onInit = function(){

					 this.lang = $translate.use();
					 this.selected = (this.lang == 'fr') ? 0 : 1;
					 this.currentUserRole = authenticationService.getUserRole();

					 this.retrieveProfiles();
				 }

				 this.retrieveProfiles = async function(){
				 	if (this.currentUserRole === "admin") {
				 		const users = (await authenticationService.getUserList()).data;
						profileService.getAllProfiles().then(res =>{
							this.profiles = res;
							for(let profile of this.profiles){
								if(profile.author){
									const user = users.find(u => u._id === profile.author);
									if(user){
										profile.authorInfos = user;
									}
								}
							}
							$scope.$digest();
						});
					} else {
						profileService.getUserProfiles(authenticationService.getUserId()).then( res => {
							console.log(res)
							this.profiles = res;
							$scope.$digest();
						});
					}

				 }


		 		this.remove = async function(profile){
					let translate = $filter("translate");
		 			const confirmValidation = await storyfaceDialogService.showConfirm({
						title : translate("confirm_deletion").replace("%profile%", profile.title),
						subtitle : translate("confirm_deletion_subtitle"),
						validButton : translate("delete"),
						cancelButton : translate("cancel")
		 			});

		 			if(confirmValidation){
		 				const success = await profileService.deleteProfile(profile.id);
		 				if(success){
	 						this.profiles.splice(this.profiles.indexOf(profile), 1);
	 						storyfaceDialogService.toast(translate("deletion_successful").replace("%profile%", profile.title));
		 				}else{
		 					storyfaceDialogService.toast(translate("deletion_unsuccessful").replace("%profile%", profile.title));
		 				}
		 			}
		 		}

		 		this.downloadProfiles = async function(){
		 			let profiles = await profileService.getAllProfiles();
		 			let jsonString = JSON.stringify(profiles);
		 			const data = new Blob([jsonString], {type:"application/json"});
		 			saveAs(data, 'storyface-db.json');
		 		}

		 		this.uploadProfiles = async function(){
					let translate = $filter("translate")
		 			const jsonFile = await storyfaceDialogService.promptFile({
		 				validButton : translate('upload'),
		 				acceptedFormats : "json"
		 			});
		 			if(jsonFile){
		 				const realJSON = Base64.decode(jsonFile.substring(29, jsonFile.length));
						profileService.importProfiles(JSON.parse(realJSON));
		 			}
		 		}

		 		this.getProfiles = function(lang){
		 			if(this.profiles)
			 			return this.profiles.filter(p => p.language == lang);
			 		else
			 			return [];
		 		}
		 	}
		 	]
		 })

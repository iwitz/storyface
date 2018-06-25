angular.module('storyface').
	config(['$locationProvider', '$routeProvider',
	    function configRoutes($locationProvider, $routeProvider) {

	      $routeProvider.
	        when('/', {
	          template: '<welcome></welcome>'
	        }).
					when('/:lang/emotions', {
	          template: '<emotions></emotions>'
	        }).
	        when('/:lang/gender', {
	           template: '<gender></gender>'
	        }).
	        when('/:lang/choose', {
	           template: '<profile-choice></profile-choice>'
	        }).
	        when('/:lang/chat/:profileID', {
	           template: '<chat></chat>'
	        }).
	        when('/:lang/profiles', {
	           template: '<profile-list></profile-list>'
	        }).
	        when('/:lang/profiles/new', {
	           template: '<add-profile></add-profile>'
	        }).
	        when('/:lang/profiles/edit/:profileID', {
	           template: '<edit-profile></edit-profile>'
	        }).
					when('/:lang/login', {
						 template: '<authentication></authentication>'
					}).
	        when('/:lang/infos', {
	           template: '<info></info>'
	        }).
					when('/:lang/help', {
						 template: '<help></help>'
					}).
			 		when('/infos', {
	           template: '<info></info>'
					}).
					when('/user-info', {
						 template: '<user-info></user-info>'
					}).
					when('/users/edit/:userID', {
						 template: '<user-info-edit></user-info-edit>'
					}).
					when('/debug', {
			   		 template: '<welcome></welcome>'
			}).
			otherwise({redirectTo : '/'});
	    //To remove the hash prefix in the urls
	    $locationProvider.html5Mode({
	    	enabled : true,
	    });
	  }
  ])
	.controller('appController',
		['$scope', '$routeParams', '$translate', '$location', '$window', 'authenticationService', 'audioService',
		 function appController($scope, $routeParams, $translate, $location, $window, authenticationService, audioService){
		 	$scope.$on('$locationChangeStart',function(evt, absNewUrl, absOldUrl) {
				// If user tries to access the profiles interface, redirect him to the login page
				 if($location.absUrl().indexOf("profiles") >= 0 && !authenticationService.isLoggedIn()){
					$location.path("/" + $location["$$path"].split("/")[1] + "/login")
				 }

				 // If a non-admin access the user interface, redirect him to the login page
				 if($location.absUrl().indexOf('user-info') >= 0 && authenticationService.getUserRole() !== 'admin') {
					$location.path("/" + $location["$$path"].split("/")[1] + "/login")
				 }

				 if(absOldUrl.indexOf("profiles") >=0 && absNewUrl.indexOf("profiles") === -1){
			   		//Force page reload when switching from profile management to storyface, in order to load index.html instead of index_without_webcam
			   		$window.location.href=absNewUrl;
			   }

				 // Handle the audio for the main tracks
				 if( $location.absUrl().indexOf("profiles") >= 0
				 											|| $location.absUrl().indexOf("welcome") >= 0
															|| $location.absUrl().indexOf("gender") >= 0
															|| $location.absUrl().indexOf("choose") >= 0
														  || $location.absUrl().endsWith("storyface")
														  || $location.absUrl().endsWith("storyface/") )
				{
						audioService.play("soundtrack/main_theme.mp3", "main", true, true, false);
				}
				else if( $location.absUrl().indexOf("emotions") >= 0 ||
								 $location.absUrl().indexOf("chat") >= 0 )
				{
					audioService.fadeAudio("-", "main");
				}

			});
		 	//Tells the translate service to use the lang specified in the route
		 	$scope.$on('$routeChangeSuccess', function(event, current, previous) {
			    $translate.use($routeParams.lang);
			});
	}]);

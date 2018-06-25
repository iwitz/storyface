angular.module('storyface')
		.service('authenticationService', [ "$http", "$window", "$cookies",

			function authenticationService($http, $window, $cookies){
				const root = '/storyface/api/users'
				const authenticationCookieKey = 'authenticationToken'
				const usernameCookieKey = 'username';
				const userRoleCookieKey = 'userrole';
				const userIdCookieKey = 'userid'

				this.username;
				this.userRole;
				this.userId;

				this.saveToken = function(token){
					$cookies.putObject(authenticationCookieKey, token);
					this.token = token;
				}

				this.setUserName = function(username){
					this.username = username;
					$cookies.put(usernameCookieKey, username)
				}

				this.getUserName = function(){
					if(!this.username)
						this.username = $cookies.get(usernameCookieKey);

					return this.username
				}

				this.getUserRole = function(){
					if(!this.userRole)
						this.userRole = $cookies.get(userRoleCookieKey);

					return this.userRole
				}

				this.setUserRole = function(role){
					this.userRole = role;
					$cookies.put(userRoleCookieKey, role);
				}

				this.getUserId = function(){
					if(!this.userId)
						this.userId = $cookies.get(userIdCookieKey);

					return this.userId
				}

				this.setUserId = function(id){
					this.userId = id;
					$cookies.put(userIdCookieKey, id);
				}

				this.getToken = function(){
					if (!this.token)
						this.token = $cookies.getObject(authenticationCookieKey);

					return this.token;
				}

				this.logout = function(){
					this.token = '';
					this.username = undefined;
					$cookies.remove(authenticationCookieKey);
					$cookies.remove(usernameCookieKey);
				}

				this.login = async function(username, password){
					const res = await $http.post(root + '/login', {
					 'username' : username,
					 'password' : password,
					})
					this.setUserName(username);//set only if authentication success
					this.saveToken(res.data.authenticationToken);
					const details = this.getUserDetails();
					this.setUserId(details._id);
					this.setUserRole(details.role);
					return res;
				}

				this.getUserDetails = function() {
					let token = this.getToken();
					let payload;
					if (token) {
						payload = token.split('.')[1];
						payload = window.atob(payload);
						return JSON.parse(payload);
					} else {
						return null;
					}
				}

				this.isLoggedIn = function() {
					let user = this.getUserDetails();
					if (user) {
						return user.exp > Date.now() / 1000;
					} else {
						return false;
					}
				}

				this.signup = async function(username, password, name, surname, email){
					const res = await $http.post(root + '/signup', { 
						'username' : username,
						 'password' : password,
						'name' 	: name,
						'surname' 	: surname,
						'email' 	: email,
					});
					return res;
				}

				this.getAllUsers = async function(){
					const res = await $http({
						url : root + '/getAllUsers',
						method : "GET",
						params : {authenticationToken : this.getToken()}
					})
					return res;
				}

				this.getUserList = async function(){
					const res = await $http({
						url : root + '/getUserList',
						method : "GET",
						params : {authenticationToken : this.getToken()}
					})
					return res;
				}

			}]);

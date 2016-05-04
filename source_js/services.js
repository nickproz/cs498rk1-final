var finalServices = angular.module('finalServices', []);

// Service for our User API requests
finalServices.factory('Users', function($http, $window) {

	//var baseUrl = $window.sessionStorage.baseurl + '/api/users/';
	var baseUrl = 'http://localhost:4000/api/users/';

	// Route to correct HTTP API call
    return {

		createUser : function(user) {
			return $http.post(baseUrl, user);
        },
		getUsers : function(query) {
			if(query === undefined || query === "undefined")
				return $http.get(baseUrl);
			else
				return $http.get(baseUrl + query);
		},
		getUser : function(id) {
			return $http.get(baseUrl + id);
		},
		updateUser : function(user, id) {
			return $http.put(baseUrl + id, user);
		},
		deleteUser : function(id) {
			return $http.delete(baseUrl + id);
		}
    }
});

// Auth service
finalServices.factory('auth', ['$http', '$window',
function($http, $window) {
	var auth = {};

	auth.saveToken = function(token) {
		$window.localStorage['chatroom-token'] = token;
	};

	auth.getToken = function() {
		return $window.localStorage['chatroom-token'];
	}

	auth.isLoggedIn = function() {
		var token = auth.getToken();

		if (token) {
			var payload = JSON.parse($window.atob(token.split('.')[1]));

			return payload.exp > Date.now() / 1000;
		} else {
			return false;
		}
	};

	auth.currentUser = function() {
		if (auth.isLoggedIn()) {
			var token = auth.getToken();
			var payload = JSON.parse($window.atob(token.split('.')[1]));

			return payload.username;
		}
	};

	auth.register = function(user) {
		return $http.post('/register', user).success(function(data) {
			auth.saveToken(data.token);
		});
	};

	auth.logIn = function(user) {
		return $http.post('/login', user).success(function(data) {
			auth.saveToken(data.token);
		});
	};

	auth.logOut = function() {
		$window.localStorage.removeItem('chatroom-token');
	};

	return auth;
}]);

// Service for our Class API requests
finalServices.factory('Classes', function($http, $window) {

	//var baseUrl = $window.sessionStorage.baseurl + '/api/classes/';
	var baseUrl = 'http://localhost:4000/api/classes/';

	// Route to correct HTTP API call
	return {

		createClass : function(newClass) {
			return $http.post(baseUrl, newClass);
		},
		getClasses : function (query) {
			if(query === undefined || query === "undefined")
				return $http.get(baseUrl);
			else
				return $http.get(baseUrl + query);
		},
		getClass : function(id) {
			return $http.get(baseUrl + id);
		},
		updateClass : function(newClass, id) {
			return $http.put(baseUrl + id, task);
		},
		deleteClass : function(id) {
			return $http.delete(baseUrl + id);
		}
	}
});
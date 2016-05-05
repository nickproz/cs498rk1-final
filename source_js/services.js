var finalServices = angular.module('finalServices', []);

// Service for our User API requests
finalServices.factory('Users', ['$http', '$window', '$location', function($http, $window, $location) {
	function getBaseUrl() {
		return 'http://' + window.location.hostname + ':4000/api/users/';
	}

	// Route to correct HTTP API call
    return {

		createUser : function(user) {
			return $http.post(getBaseUrl(), user);
        },
		getUsers : function(query) {
			if(query === undefined || query === "undefined")
				return $http.get(getBaseUrl());
			else
				return $http.get(getBaseUrl() + query);
		},
		getUser : function(id) {
			return $http.get(getBaseUrl() + id);
		},
		updateUser : function(user, id) {
			return $http.put(getBaseUrl() + id, user);
		},
		deleteUser : function(id) {
			return $http.delete(getBaseUrl() + id);
		}
    }
}]);

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
	function getBaseUrl() {
		return 'http://' + window.location.hostname + ':4000/api/classes/';
	}

	// Route to correct HTTP API call
	return {

		createClass : function(newClass) {
			return $http.post(getBaseUrl(), newClass);
		},
		getClasses : function (query) {
			if(query === undefined || query === "undefined")
				return $http.get(getBaseUrl());
			else
				return $http.get(getBaseUrl() + query);
		},
		getClass : function(id) {
			return $http.get(getBaseUrl() + id);
		},
		updateClass : function(newClass, id) {
			return $http.put(getBaseUrl() + id, task);
		},
		deleteClass : function(id) {
			return $http.delete(getBaseUrl() + id);
		}
	}
});
var finalServices = angular.module('finalServices', []);

// Service for our User API requests
finalServices.factory('Users', ['$http', '$window', '$location', function($http, $window, $location) {
	function getBaseUrl() {
		return 'http://' + window.location.hostname + ':4000/api/users/';
	}
	function getHeaders() {
		var token = $window.localStorage['chatroom-token'];
		return token ? {headers: {'Authorization': 'JWT ' + token}} : {};
	}

	// Route to correct HTTP API call
    return {

		createUser : function(user) {
			return $http.post(getBaseUrl(), user, getHeaders());
        },
		getUsers : function(query) {
			if(query === undefined || query === "undefined")
				return $http.get(getBaseUrl(), getHeaders());
			else
				return $http.get(getBaseUrl() + query, getHeaders());
		},
		getUser : function(id) {
			return $http.get(getBaseUrl() + id, getHeaders());
		},
		updateUser : function(user, id) {
			return $http.put(getBaseUrl() + id, user, getHeaders());
		},
		deleteUser : function(id) {
			return $http.delete(getBaseUrl() + id, getHeaders());
		}
    }
}]);

// Auth service
finalServices.factory('Auth', ['$http', '$window', '$rootScope',
function($http, $window, $rootScope) {
	function getBaseUrl() {
		return 'http://' + window.location.hostname + ':4000/api';
	}
	var auth = {};

	auth.saveToken = function(token) {
		$window.localStorage['chatroom-token'] = token;
		$rootScope.$broadcast('userLogin', {});
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

			return {_id: payload._id, userName: payload.userName};
		}
	};

	auth.logIn = function(user, successCb, errorCb) {
		return $http.post(getBaseUrl() + '/login', user).success(function(data) {
			auth.saveToken(data.token);
			successCb();
		}).error(function(err) {
			errorCb(err);
		});
	};

	auth.logOut = function() {
		$window.localStorage.removeItem('chatroom-token');
		$rootScope.$broadcast('userLogout', {});
	};

	return auth;
}]);

// Service for our Class API requests
finalServices.factory('Classes', function($http, $window) {
	function getBaseUrl() {
		return 'http://' + window.location.hostname + ':4000/api/classes/';
	}
	function getHeaders() {
		var token = $window.localStorage['chatroom-token'];
		return token ? {headers: {'Authorization': 'JWT ' + token}} : {};
	}

	// Route to correct HTTP API call
	return {

		createClass : function(newClass) {
			return $http.post(getBaseUrl(), newClass, getHeaders());
		},
		getClasses : function (query) {
			if(query === undefined || query === "undefined")
				return $http.get(getBaseUrl(), getHeaders());
			else
				return $http.get(getBaseUrl() + query, getHeaders());
		},
		getClass : function(id) {
			return $http.get(getBaseUrl() + id, getHeaders());
		},
		updateClass : function(newClass, id) {
			return $http.put(getBaseUrl() + id, task, getHeaders());
		},
		deleteClass : function(id) {
			return $http.delete(getBaseUrl() + id, getHeaders());
		}
	}
});
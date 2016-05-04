var mp4Services = angular.module('mp4Services', []);

// Service for our User API requests
mp4Services.factory('Users', function($http, $window) {

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

// Service for our Class API requests
mp4Services.factory('Classes', function($http, $window) {

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
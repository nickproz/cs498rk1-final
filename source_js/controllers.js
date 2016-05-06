var finalControllers = angular.module('finalControllers', []);

finalControllers.controller('SignUpController', ['$scope' , '$http', '$window', 'Users', function($scope, $http, $window, Users) {

	// Form "placeholders"
	$('.form').find('input, textarea').on('keyup blur focus', function (e) {
	  var $this = $(this),
		  label = $this.prev('label');
		  if (e.type === 'keyup') {
				if ($this.val() === '') {
			  label.removeClass('active highlight');
			} else {
			  label.addClass('active highlight');
			}
		} else if (e.type === 'blur') {
			if( $this.val() === '' ) {
				label.removeClass('active highlight');
				} else {
				label.removeClass('highlight');
				}
		} else if (e.type === 'focus') {
		  if( $this.val() === '' ) {
				label.removeClass('highlight');
				}
		  else if( $this.val() !== '' ) {
				label.addClass('highlight');
				}
		}
	});

	// Add our user to the database
	$scope.addUser = function() {

		$scope.user = {};

		$scope.user.firstName = $scope.firstName;
		$scope.user.lastName = $scope.lastName;
		$scope.user.userName = $scope.userName;
		$scope.user.email = $scope.email;
		$scope.user.password = $scope.password;

		if($scope.user.firstName === "undefined" || $scope.user.lastName === "undefined" || $scope.user.userName === "undefined"|| $scope.user.email === "undefined"|| $scope.user.firstName === undefined || $scope.user.lastName === undefined || $scope.user.userName === undefined || $scope.user.email === undefined || $scope.user.password === undefined) {
			$scope.userFail = "Please fill out all fields with valid characters.";
			$('#userSuccess').hide();
			$('#userFail').show();
			return;
		}

		Users.createUser($scope.user).success(function(data) {
			$scope.userSuccess = data.message;
			$('#userSuccess').show();
			$('#userFail').hide();
		}).error(function(data) {
			$scope.userFail = data.message;
			$('#userSuccess').hide();
			$('#userFail').show();
		});
	}

	// Navbar update
	$('.navbar li').removeClass('active');
	$('#navSignup').addClass('active');

}]);

// Depends of UI-Routing
finalControllers.controller('AuthCtrl', ['$scope', '$state', 'auth',
function($scope, $state, auth) {
	$scope.user = {};

	$scope.register = function() {
		auth.register($scope.user).error(function(error) {
			$scope.error = error;
		}).then(function() {
			$state.go('search');
		});
	};

	$scope.logIn = function() {
		auth.logIn($scope.user).error(function(error) {
			$scope.error = error;
		}).then(function() {
			$state.go('search');
		});
	};
}]);

finalControllers.controller('LoginController', ['$scope' , '$http', '$window', function($scope, $http, $window) {

	// Form "placeholders"
	$('.form').find('input, textarea').on('keyup blur focus', function (e) {
	  var $this = $(this),
		  label = $this.prev('label');
		  if (e.type === 'keyup') {
				if ($this.val() === '') {
			  label.removeClass('active highlight');
			} else {
			  label.addClass('active highlight');
			}
		} else if (e.type === 'blur') {
			if( $this.val() === '' ) {
				label.removeClass('active highlight');
				} else {
				label.removeClass('highlight');
				}
		} else if (e.type === 'focus') {
		  if( $this.val() === '' ) {
				label.removeClass('highlight');
				}
		  else if( $this.val() !== '' ) {
				label.addClass('highlight');
				}
		}
	});

	// Navbar update
	$('.navbar li').removeClass('active');
	$('#navLogin').addClass('active');

}]);

finalControllers.controller('ChatController', ['$scope' , '$http', '$window', '$routeParams', 'Classes', function($scope, $http, $window, $routeParams, Classes) {

	// Navbar update
	$('.navbar li').removeClass('active');
	$('#navChat').addClass('active');

	$scope.id = $routeParams.id;

	// Get class data, add courses to search bar typeahead
	//$http.get('./data/courses.json')
	Classes.getClass($scope.id).success(function(data) {
		$scope.class = data.data;
	}).error(function (err) {
		console.log(err);
	})
}]);

finalControllers.controller('SearchController', ['$scope' , '$http', '$window', '$route', 'Classes', function($scope, $http, $window, $route, Classes) {
	
	// Navbar update
	$('.navbar li').removeClass('active');
	$('#navSearch').addClass('active');
	
	// Filter for our search box
	 $scope.search = function (row) {
        return (angular.lowercase(row.identifier).indexOf(angular.lowercase($scope.query) || '') !== -1 ||
                angular.lowercase(row.name).indexOf(angular.lowercase($scope.query) || '') !== -1);
    };
	
	// Substring matcher for search bar
	$scope.substringMatcher = function(strs) {
	  return function findMatches(q, cb) {

		var matches = [];
		var substrRegex = new RegExp(q, 'i');

		$.each(strs, function(i, str) {
		  if (substrRegex.test(str)) {
			matches.push(str);
		  }
		});

		cb(matches);
	  };
	};

	// Get class data, add courses to search bar typeahead
	Classes.getClasses().success(function(data) {
		var data = data.data;

		var classes = [];
		for(var i = 0; i < data.length; i++) {
			//Classes.createClass(data[i]); // Upload class data to backend
			classes.push(data[i].identifier.toLowerCase());
		}

		$scope.classes = classes;
		$scope.data = data;
		
		/* $('#catalog-search .typeahead').typeahead({
		   hint: true,
		   highlight: true,
		   minLength: 1
		 },
		 {
		   name: 'classes',
		   source: $scope.substringMatcher(classes)
		 }); */

	}).error(function (err) {
		console.log(err);
	})
}]);

finalControllers.controller('ClassController', ['$scope' , '$http', '$window', '$route', '$routeParams', 'Classes', 'Users', function($scope, $http, $window, $route, $routeParams, Classes, Users) {
	
	// Navbar update
	$('.navbar li').removeClass('active');
	
	// Route parameters
	$scope.id = $routeParams.id;
	$scope.classRoute = $routeParams.class;
	
	// Get class data, add courses to search bar typeahead
	Classes.getClass($scope.id).success(function(data) {
		$scope.currClass = data.data;
	}).error(function (err) {
		console.log(err);
	})
	
	// REPLACE WITH CURRENT ACTIVE USER
	Users.getUser('572c04f9295b333110f34b7e').success(function(data) {
		$scope.user = data.data;
	}).error(function (err) {
		console.log(err);
	})
	
	$scope.enroll = function()
	{
		if($scope.user.classes.indexOf($scope.currClass.id))
			$scope.user.classes.push($scope.currClass.id)
		Users.updateUser($scope.user, $scope.user._id).success(function(data) {
			$scope.user = data.data;
		}).error(function (err) {
			console.log(err);
		})
		
	}
}]);

finalControllers.controller('ProfileController', ['$scope' , '$http', '$window', '$route', '$routeParams', 'Users', 'Classes', function($scope, $http, $window, $route, $routeParams, Users, Classes) {
	
	$scope.id = $routeParams.id;

	// Get class data, add courses to search bar typeahead
	Users.getUser($scope.id).success(function(data) {
		$scope.user = data.data;
		
		$scope.classes = [];
		for(var i = 0; i < $scope.user.classes.length; i++)
		{
			Classes.getClass($scope.user.classes[i]).success(function(data) {
				$scope.classes.push(data.data);
			}).error(function (err) {
				console.log(err);
			})
		}
	}).error(function (err) {
		console.log(err);
	})
	
	$scope.unEnroll = function(classID)
	{
		var index = $scope.user.classes.indexOf(classID);
		$scope.user.classes.splice(index, 1);
		Users.updateUser($scope.user, $scope.user._id).success(function(data) {
			$scope.user = data.data;
			$scope.classes = [];
			for(var i = 0; i < $scope.user.classes.length; i++)
			{
				Classes.getClass($scope.user.classes[i]).success(function(data) {
					$scope.classes.push(data.data);
				}).error(function (err) {
					console.log(err);
				})
			}
		}).error(function (err) {
			console.log(err);
		})
	}
	
}]);
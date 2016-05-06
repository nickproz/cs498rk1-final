var finalControllers = angular.module('finalControllers', []);

finalControllers.controller('SignUpController', ['$scope' , '$http', '$window', '$location', 'Users', 'Auth', function($scope, $http, $window, $location, Users, Auth) {

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
			Auth.saveToken(data.token);
			$location.path('/search');
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

finalControllers.controller('LoginController', ['$scope' , '$http', '$window', '$location', 'Auth', function($scope, $http, $window, $location, Auth) {
	$scope.showError = false;
	// Navbar update
	$('.navbar li').removeClass('active');
	$('#navLogin').addClass('active');

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

	$scope.login = function(e) {
		e.preventDefault();
		$scope.showError = false;
		Auth.logIn({email: $scope.emInput, password: $scope.pwInput}, function() {
			$location.path('/profile');
		}, function(err) {
			$scope.showError = true;
			$scope.userFail = err.message;
		});
	}

}]);

finalControllers.controller('ChatController', ['$scope' , '$http', '$window', '$timeout', '$routeParams', '$location', 'Classes', 'ggsChat', 'Upload', 'chatConfig', 'Auth', function($scope, $http, $window, $timeout, $routeParams, $location, Classes, ggsChat, Upload, chatConfig, Auth) {
	if (!Auth.isLoggedIn()) {
		return $location.path('/login');
	}
	$scope.$on('userLogin', function(e, args) {
		$location.path('/search');
	});
	// Navbar update
	$('.navbar li').removeClass('active');
	$('#navChat').addClass('active');

	var uploadUrl = 'http://' + window.location.hostname + ':' + chatConfig.port + '/upload';
	var fileUrl = 'http://' + window.location.hostname + ':' + chatConfig.port + '/file/';

	$scope.id = $routeParams.id;

	$scope.messages = [];
	$scope.messageInput = "";

	var username = Auth.currentUser().userName;

	ggsChat.joinRoom(username, String($scope.id), function(msg) {
		msg.own = msg.sender == username;
		msg.timeString = (new Date(msg.timestamp)).toLocaleString();
		if (msg.messageType != 'text') {
			msg.link = fileUrl + msg._id;
			if (msg.messageType == 'file')
				msg.isFile = true;
			else
				msg.isImage = true;
		}
		$scope.messages.push(msg);
		$timeout(function() {
			$('.chat-history').scrollTop($('.chat-history')[0].scrollHeight);
		});
	}, function() {
		$scope.messages.splice(0);
	}, function(users) {
		$scope.participants = users.map(function(name) {
			return {
				name: name
			};
		});
	});

	$scope.sendMessage = function() {
		if ($scope.messageInput) {
			ggsChat.sendMessage($scope.messageInput);
			$scope.messageInput = "";
		}
	};

	$scope.textareaEnter = function(e) {
		if (e.keyCode == 13 && !e.shiftKey) {
			e.preventDefault();
			$scope.sendMessage();
		}
	};

	function doUpload(file, type) {
		if (file) {
			file.upload = Upload.upload({
				url: uploadUrl,
				data: {
					attachment: file,
					sender: username,
					receiver: $scope.id,
					messageType: type
				}
			});
		}
	}
	$scope.uploadFile = function(file) {
		doUpload(file, 'file');
	};
	$scope.uploadImage = function(file) {
		doUpload(file, 'image');
	};
	$scope.viewImage = function(message) {
		$window.open(message.link, '_blank');
	};

	// Get class data, add courses to search bar typeahead
	Classes.getClass($scope.id).success(function(data) {
		$scope.class = data.data;
	}).error(function (err) {
		console.log(err);
	});

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

finalControllers.controller('ClassController', ['$scope' , '$http', '$window', '$route', '$routeParams', '$location', 'Classes', 'Users', 'Auth', function($scope, $http, $window, $route, $routeParams, $location, Classes, Users, Auth) {
	// Navbar update
	$('.navbar li').removeClass('active');
	
	$scope.showError = false;
	$scope.showSuccess = false;
	
	// Route parameters
	$scope.id = $routeParams.id;
	$scope.classRoute = $routeParams.class;
	
	// Get class data, add courses to search bar typeahead
	Classes.getClass($scope.id).success(function(data) {
		$scope.currClass = data.data;
	}).error(function (err) {
		console.log(err);
	})
	
	if (Auth.isLoggedIn()) {
		$scope.userid = Auth.currentUser()._id;
		Users.getUser($scope.userid).success(function(data) {
			$scope.user = data.data;
		}).error(function (err) {
			console.log(err);
		})
	}

	$scope.$on('userLogout', function(e, args) {
		$scope.userid = undefined;
		$scope.user = undefined;
	});
	
	
	$scope.enroll = function()
	{
		if (!Auth.isLoggedIn()) {
			return $location.path('/login');
		}
		if($scope.user.classes.indexOf($scope.currClass.id) === -1) {
			$scope.user.classes.push($scope.currClass.id)
			Users.updateUser($scope.user, $scope.user._id).success(function(data) {
				$scope.user = data.data;
				$scope.showError = false;
				$scope.showSuccess = true;
			}).error(function (err) {
				console.log(err);
			})
		}
		else {
			$scope.showSuccess = false;
			$scope.showError = true;
		}
	}
}]);

finalControllers.controller('ProfileController', ['$scope' , '$http', '$window', '$route', '$routeParams', '$location', 'Users', 'Classes', 'Auth', function($scope, $http, $window, $route, $routeParams, $location, Users, Classes, Auth) {
	if (!Auth.isLoggedIn()) {
		return $location.path('/login');
	}
	$scope.id = $routeParams.id || Auth.currentUser()._id;

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

finalControllers.controller('navbarController', ['$scope', '$location', 'Users', 'Auth', function($scope, $location, Users, Auth) {
	$scope.isLoggedIn = false;
	updateView();
	$scope.$on('userLogin', function(event, args) {
		updateView();
	});
	$scope.logout = function() {
		Auth.logOut();
		updateView();
		$location.path('/login');
	};
	function updateView() {
		if (Auth.isLoggedIn()) {
			Users.getUser(Auth.currentUser()._id).success(function(data) {
				$scope.isLoggedIn = true;
				$scope.firstName = data.data.firstName;
			}).error(function(err) {
				console.log(error);
			});
		} else {
			$scope.isLoggedIn = false;
		}
	}
}]);
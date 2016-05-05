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

finalControllers.controller('ChatController', ['$scope' , '$http', '$window', '$timeout', '$routeParams', 'Classes', 'ggsChat', 'Upload', 'chatConfig', function($scope, $http, $window, $timeout, $routeParams, Classes, ggsChat, Upload, chatConfig) {

	// Navbar update
	$('.navbar li').removeClass('active');
	$('#navChat').addClass('active');

	var uploadUrl = 'http://' + window.location.hostname + ':' + chatConfig.port + '/upload';
	var fileUrl = 'http://' + window.location.hostname + ':' + chatConfig.port + '/file/';

	$scope.id = $routeParams.id;

	$scope.messages = [];
	$scope.messageInput = "";

	var randomName = Math.random().toString(36).substr(16);
	var username = randomName;

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
	
	$scope.update = function() 
	{
		return;
	}
	
	$scope.nameFilter = {'identifier': ""};
	
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

		$scope.nameFilter.identifier = q.toUpperCase();
		cb(matches);
	  };
	};

	// Get class data, add courses to search bar typeahead
	//$http.get('./data/courses.json')
	Classes.getClasses().success(function(data) {
		var data = data.data;

		var classes = [];
		for(var i = 0; i < data.length; i++) {
			//Classes.createClass(data[i]);
			classes.push(data[i].identifier);
		}

		$scope.classes = classes;
		$scope.data = data;

		$scope.filters = data;
		
		$('#catalog-search .typeahead').typeahead({
		  hint: true,
		  highlight: true,
		  minLength: 1
		},
		{
		  name: 'classes',
		  source: $scope.substringMatcher(classes)
		});

	}).error(function (err) {
		console.log(err);
	})
}]);

finalControllers.controller('ClassController', ['$scope' , '$http', '$window', '$route', '$routeParams', 'Classes', function($scope, $http, $window, $route, $routeParams, Classes) {
	
	// Navbar update
	$('.navbar li').removeClass('active');
	
	$scope.id = $routeParams.id;
	$scope.classRoute = $routeParams.class;
	
	// Get class data, add courses to search bar typeahead
	//$http.get('./data/courses.json')
	Classes.getClass($scope.id).success(function(data) {
		$scope.currClass = data.data;
	}).error(function (err) {
		console.log(err);
	})
	
}]);
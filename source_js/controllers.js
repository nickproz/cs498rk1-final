var mp4Controllers = angular.module('mp4Controllers', []);
var id;

mp4Controllers.controller('SignUpController', ['$scope' , '$http', '$window', function($scope, $http, $window) {

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
	$('#navSignup').addClass('active');

}]);

mp4Controllers.controller('LoginController', ['$scope' , '$http', '$window', function($scope, $http, $window) {

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

mp4Controllers.controller('ChatController', ['$scope' , '$http', '$window', '$routeParams', function($scope, $http, $window, $routeParams) {
	
	// Navbar update
	$('.navbar li').removeClass('active');
	$('#navChat').addClass('active');
	
	$scope.id = $routeParams.id;	
	
	// Get class data, add courses to search bar typeahead
	$http.get('./data/courses.json').success(function(data) {
		
		$scope.class = data[$scope.id - 1]
		
	}).error(function (err) {
		console.log(err);
	})
	
}]);

mp4Controllers.controller('SearchController', ['$scope' , '$http', '$window', function($scope, $http, $window) {
	
	// Navbar update
	$('.navbar li').removeClass('active');
	$('#navSearch').addClass('active');
	
	// Substring matcher for search bar
	var substringMatcher = function(strs) {
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
	$http.get('./data/courses.json').success(function(data) {
		var classes = [];
		for(var i = 0; i < data.length; i++)
			classes.push(data[i].identifier);
		
		$scope.classes = classes;
		$scope.data = data;
		
		$('#catalog-search .typeahead').typeahead({
		  hint: true,
		  highlight: true,
		  minLength: 1
		},
		{
		  name: 'classes',
		  source: substringMatcher(classes)
		});
		
	}).error(function (err) {
		console.log(err);
	})
	
}]);
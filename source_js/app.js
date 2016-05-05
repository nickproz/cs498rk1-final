var app = angular.module('mp4', ['ngRoute', 'mp4Controllers', 'mp4Services']);

app.config(['$routeProvider', function($routeProvider) {
  $routeProvider.
  when('/signup', {
    templateUrl: 'partials/signUp.html',
    controller: 'SignUpController'
  }).
  when('/login', {
    templateUrl: 'partials/login.html',
    controller: 'LoginController'
  }).
  when('/class/:class/:id', {
    templateUrl: 'partials/class.html',
    controller: 'ClassController'
  }).
  when('/chat/:class/:id', {
    templateUrl: 'partials/chat.html',
    controller: 'ChatController'
  }).
  when('/search', {
    templateUrl: 'partials/search.html',
    controller: 'SearchController'
  }).
  otherwise({
    redirectTo: '/search'
  });
}]);

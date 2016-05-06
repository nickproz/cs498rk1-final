var app = angular.module('final', ['ngRoute', 'finalControllers', 'finalServices']);

// Default Config
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
  when('/profile/:id', {
    templateUrl: 'partials/profile.html',
    controller: 'ProfileController'
  }).
  otherwise({
    redirectTo: '/search'
  });
}]);

// var app = angular.module('final', ['ui.router']);

// // Angular UI UI-router version
// app.config(['$stateProvider', '$urlRouterProvider',
// function($stateProvider, $urlRouterProvider) {

//   $stateProvider.state('search', {
//     url : '/search',
//     templateUrl : 'partials/search.html',
//     controller : 'SearchController'
//   }).state('chat', {
//     url : '/chat/:class/:id',
//     templateUrl : 'partials/chat.html',
//     controller : 'ChatController'
//   }).state('login', {
//     url : '/login',
//     templateUrl : '/login.html',
//     controller : 'AuthCtrl',
//     onEnter : ['$state', 'auth',
//     function($state, auth) {
//       if (auth.isLoggedIn()) {
//         $state.go('search');
//       }
//     }]

//   }).state('signup', {
//     url : '/register',
//     templateUrl : '/register.html',
//     controller : 'AuthCtrl',
//     onEnter : ['$state', 'auth',
//     function($state, auth) {
//       if (auth.isLoggedIn()) {
//         $state.go('search');
//       }
//     }]

//   });

//   $urlRouterProvider.otherwise('search');
// }]);

var app = angular.module('final', ['ngRoute', 'finalControllers', 'finalServices', 'ggsChat', 'ngFileUpload']);

app.constant('chatConfig', {
  port: '12345'
});

// Default Config
app.config(['$routeProvider', 'ggsChatProvider', 'chatConfig', function($routeProvider, ggsChatProvider, chatConfig) {
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

  ggsChatProvider.init(':' + chatConfig.port);
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

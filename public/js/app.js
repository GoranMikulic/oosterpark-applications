(function() {

  angular.module('dataAnalizingApp', ['btford.socket-io', 'ngRoute'])

  .config(function($routeProvider) {

    $routeProvider
      .when('/', {
        templateUrl: '/js/views/analyze.html'
      })
      .when('/compare', {
        templateUrl: '/js/views/analyze.html'
      })
      .when('/livedata', {
        templateUrl: '/js/views/realtimewifi.html'
      })
      .otherwise({
        redirectTo: '/'
      });
  });

})();

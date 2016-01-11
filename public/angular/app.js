(function() {

  angular.module('dataAnalizingApp', ['btford.socket-io', 'ngRoute'])

  .config(function($routeProvider) {

    $routeProvider
      .when('/', {
        templateUrl: '/angular/views/analyze.html'
      })
      .when('/compare', {
        templateUrl: '/angular/views/analyze.html'
      })
      .when('/livedata', {
        templateUrl: '/angular/views/realtimewifi.html'
      })
      .when('/map', {
        templateUrl: '/angular/views/map.html'
      })
      .otherwise({
        redirectTo: '/'
      });
  });

})();

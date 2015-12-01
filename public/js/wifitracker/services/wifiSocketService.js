(function() {
  // using the function form of use-strict...
  "use strict";
  // accessing the module in another.
  // this can be done by calling angular.module without the []-brackets

  angular.module('chartsApp').factory('socketConnection', function($rootScope) {
    var socket = io.connect('http://localhost:8080/');
    return {
      on: function(eventName, callback) {
        socket.on(eventName, function() {
          var args = arguments;
          $rootScope.$apply(function() {
            callback.apply(socket, args);
          });
        });
      },
      emit: function(eventName, data, callback) {
        socket.emit(eventName, data, function() {
          var args = arguments;
          $rootScope.$apply(function() {
            if (callback) {
              callback.apply(socket, args);
            }
          });
        })
      }
    };
  });
})();

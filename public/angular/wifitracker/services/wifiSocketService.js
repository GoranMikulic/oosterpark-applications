(function() {
  "use strict";
  /**
  * Handling socket connection, providing methods for listening and emitting data
  */
  angular.module('dataAnalizingApp').factory('socketConnection', function($rootScope, $http) {

    //socket conncetion (ip of backend server)- TODO: make easier it configurable
    var socket = io.connect('http://nodejs-mikugo.rhcloud.com:8080/');
    //for rpi deployment: var socket = io.connect('http://213.124.216.186:80/');

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

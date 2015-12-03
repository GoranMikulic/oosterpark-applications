(function() {
  // using the function form of use-strict...
  "use strict";
  // accessing the module in another.
  // this can be done by calling angular.module without the []-brackets

  angular.module('chartsApp').factory('socketConnection', function($rootScope, $http) {
    var socket = io.connect('http://127.0.0.1:8080/');

    $http({
      method: 'GET',
      url: '/serverconnection'
    }).success(function(data) {
      var ip = data.connection.ipaddress;
      var port = data.connection.port;

      socket = io.connect('http://' + ip + ':' + port + '/', {'forceNew': true});
      console.log('port refreshed ' + ip + ':' + port);
    }).error(function(data, status) {
      console.log("DATA" + data + " " + status);
    });

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

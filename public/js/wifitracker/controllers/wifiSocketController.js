(function() {
  // using the function form of use-strict...
  "use strict";
  // accessing the module in another.
  // this can be done by calling angular.module without the []-brackets
  angular.module('chartsApp')
    .controller('wifiSocketController', ['$scope', 'socketConnection', function($scope, socketConnection) {

      $scope.devices = new Array();
      $scope.counter = 0;

      socketConnection.on("kismetServerConnectionStatus", function(data) {
        console.log("connection: " + JSON.stringify(data));
        $scope.recievedTroughSocket = data.msg;
      });
      socketConnection.on("kismessage", function(data) {
        //console.log("data: " + JSON.stringify(data));
        $scope.recievedTroughSocket = data.msg;

        data.firsttime = new Date(data.firsttime * 1000);
        data.lasttime = new Date(data.lasttime * 1000);

        // $scope.devices.pushIfNotExist(data, function(e) {
        //     return e.bssid === data.bssid && e.bssid === data.bssid;
        // });
        checkAndAdd(data);

        //$scope.devices.push(JSON.stringify(data));
      });

      $scope.sendWithSocket = function(msg) {
        socketConnection.emit("connection", msg);
      }

      socketConnection.on("kismetServerConnectionStatus", function(data) {
        console.log(data);
      });

      setInterval(function() {

        for (var i = $scope.devices.length - 1; i >= 0; i--) {
            var dif = (new Date() - $scope.devices[i].lasttime) / 1000;

            console.log(dif);
            if (dif > 10) {
              $scope.devices.splice(i, 1);
            }
        }

      }, 2000);

      function checkAndAdd(device) {
        var found = $scope.devices.some(function(el) {
          return el.bssid === device.bssid;
        });
        if (!found) {
          $scope.counter = $scope.devices.length;
          $scope.devices.push(device);
        }
      }

    }]);

})();

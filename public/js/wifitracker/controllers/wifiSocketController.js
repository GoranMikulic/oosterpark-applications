(function() {
  // using the function form of use-strict...
  "use strict";
  // accessing the module in another.
  // this can be done by calling angular.module without the []-brackets

  var tempCounter = 0;
  angular.module('chartsApp')
    .controller('wifiSocketController', ['$scope', 'socketConnection', function($scope, socketConnection) {

      $scope.devices = new Array();

      socketConnection.on("kismetServerConnectionStatus", function(data) {
        console.log("connection: " + JSON.stringify(data));
        $scope.recievedTroughSocket = data.msg;
      });
      socketConnection.on("kismessage", function(data) {
        $scope.recievedTroughSocket = data.msg;
        data.firsttime = new Date(data.firsttime * 1000);
        data.lasttime = new Date(data.lasttime * 1000);
        checkAndAdd(data);
      });

      $scope.sendWithSocket = function(msg) {
        socketConnection.emit("connection", msg);
      }

      socketConnection.on("kismetServerConnectionStatus", function(data) {
        console.log(data);
      });

      setInterval(function() {
        removeLostDevices();
        addToChart($scope.devices);
      }, 2000);

      function addToChart(devices){
        $scope.chartdata.dates.push(new Date());
        $scope.chartdata.counts.push(devices.length);
      }

      function removeLostDevices() {
        for (var i = $scope.devices.length - 1; i >= 0; i--) {
            var dif = (new Date() - $scope.devices[i].lasttime) / 1000;

            if (dif > 10) {
              $scope.devices.splice(i, 1);
            }
        }
      }

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
    function ChartResult(dates, counts) {
      this.dates = dates;
      this.counts = counts;
    }

})();

(function() {
  // using the function form of use-strict...
  "use strict";

  /**
   * Controller for realtime wifi devices tracking
   * Listens to scockets, handles devices list and updates chart data
   */
  angular.module('chartsApp')
    .controller('wifiSocketController', function($scope, socketConnection) {

      $scope.devices = new Array();

      /**
       * Fired on established socket connection
       */
      socketConnection.on("kismetServerConnectionStatus", function(data) {
        console.log("connected to socket");
      });

      /**
       * Listens to kismet server messages, receiving captured device data
       */
      socketConnection.on("kismessage", function(data) {
        data.firsttime = new Date(data.firsttime * 1000);
        data.lasttime = new Date(data.lasttime * 1000);
        checkAndAdd(data);
      });

      /**
       * Interval for data handling
       */
      setInterval(function() {
        addToChart($scope.devices);
        removeLostDevices();
      }, 2000);

      /**
       * Pushes current array of devices to the chart data
       * @param {Device[]} devices - Array of captured devices
       */
      function addToChart(devices) {
        $scope.chartdata.dates.push(new Date());
        $scope.chartdata.counts.push(devices.length);
      }

      /**
       * Removes devices which are not tracked since x seconds
       */
      function removeLostDevices() {
        for (var i = $scope.devices.length - 1; i >= 0; i--) {
          var dif = (new Date() - $scope.devices[i].lasttime) / 1000;

          if (dif > 10) {
            $scope.devices.splice(i, 1);
          }
        }
      }

      /**
       * Checks if a device is already buffered in the array and adds it
       * @param {Device} device
       */
      function checkAndAdd(device) {
        var found = $scope.devices.some(function(el) {
          return el.bssid === device.bssid;
        });
        if (!found) {
          $scope.counter = $scope.devices.length;
          $scope.devices.push(device);
        }
      }

    });


})();

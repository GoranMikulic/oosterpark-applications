(function() {
  // using the function form of use-strict...
  "use strict";

  /**
   * Controller for realtime wifi devices tracking
   * Listens to scockets, handles devices list and updates chart data
   */
  angular.module('dataAnalizingApp')
    .controller('wifiSocketController', function($scope, socketConnection, ChartResult, LiveChart) {

      /**
       * Interval for data handling
       */
      $scope.initLiveChart = function() {
        //init chart data
        $scope.chartdata = ChartResult.createNew(['x'], ['count of devices']);
        //creating line chart
        $scope.lineChart = LiveChart.createNew($scope.chartdata);

        $scope.devices = new Array();
        $scope.chartInterval;
        $scope.startChartUpdateInterval();
      }

      /**
       * Interval for data handling
       */
      $scope.startChartUpdateInterval = function() {
        $scope.chartInterval = setInterval(function() {

          removeLostDevicesFromBuffer();
          removeFirstDeviceInChart();
          addToChart($scope.devices);
        }, 2000);
      }



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
        if($scope.chartInterval) {
          data.firsttime = new Date(data.firsttime * 1000);
          data.lasttime = new Date(data.lasttime * 1000);
          checkAndAdd(data);

        }
      });

      /**
       * Removes first data points in chart to prevent overload in browser
       */
      function removeFirstDeviceInChart() {
        if ($scope.chartdata.dates.length > 50) {
          $scope.chartdata.dates.splice(1, 1);
          $scope.chartdata.counts.splice(1, 1);
        }
      }

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
      function removeLostDevicesFromBuffer() {
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

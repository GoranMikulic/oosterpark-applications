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

        $scope.devices.pushIfNotExist(data, function(e) {
            return e.bssid === data.bssid && e.bssid === data.bssid;
        });

        $scope.counter = $scope.devices.length;
        //$scope.devices.push(JSON.stringify(data));
      });

      $scope.sendWithSocket = function(msg) {
        socketConnection.emit("connection", msg);
      }

      socketConnection.on("kismetServerConnectionStatus", function(data) {
        console.log(data);
      });

    }]);

  // check if an element exists in array using a comparer function
  // comparer : function(currentElement)
  Array.prototype.inArray = function(comparer) {
    for (var i = 0; i < this.length; i++) {
      if (comparer(this[i])) return true;
    }
    return false;
  };

  // adds an element to the array if it does not already exist using a comparer
  // function
  Array.prototype.pushIfNotExist = function(element, comparer) {
    if (!this.inArray(comparer)) {
      this.push(element);
    }
  };


})();

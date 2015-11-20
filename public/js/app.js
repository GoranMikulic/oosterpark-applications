var app = angular.module('chartsApp', []);

app.directive('ngSparkline', function() {
  var url = "/wifidevicescount?fy=2015&fm=11&fd=10&ty=2015&tm=11&td=20";

  return {
    restrict: 'A',
    templateUrl: 'templates/ng-timeseries-chart.html',
    require: '^ngModel',
    controller: ['$scope', '$http', function($scope, $http){
      $scope.getChartData = function() {
        $http({
          method: 'GET',
          url: url
        }).success(function(data) {
          var result = new Array();
          //array for date values
          var dates = new Array();
          dates.push('x');
          //array for amount of devices
          var counts = new Array();
          counts.push('Amount of Wifi-Devices');

          angular.forEach(data['Wifi-Devices'], function(value){
            dates.push(value.date);
            counts.push(value.count);
          });
          console.log(dates)
          console.log(counts)

          $scope.dates = dates;
          $scope.counts = counts;
          $scope.result = result;
        });
      }
    }],
    link: function(scope, iElement, iAttrs, ctrl) {
      scope.getChartData();
      scope.$watch('startdate', function(newVal) {
        // the `$watch` function will fire even if the
        // weather property is undefined, so we'll
        // check for it
        if (newVal) {

          // chart
        }
      });
    }
  }
});

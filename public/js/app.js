var app = angular.module('chartsApp', []);

app.directive('ngSparkline', function() {
  var url = "/wifidevicescount?fy=2015&fm=11&fd=10&ty=2015&tm=11&td=20";

  return {
    restrict: 'A',
    templateUrl: 'templates/ng-timeseries-chart.html',
    require: '^ngStartdate',
    scope: {
      ngStartdate: '@'
    },
    controller: ['$scope', '$http', function($scope, $http){
      $scope.getChartData = function(startdate) {
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
            dates.push(new Date(value.date));
            counts.push(value.count);
          });
          console.log('start'+startdate);
          $scope.dates = dates;
          $scope.counts = counts;
          $scope.result = result;
        });
      }
    }],
    link: function(scope, iElement, iAttrs, ctrl) {
      scope.getChartData(iAttrs.ngStartdate);
      scope.$watch('dates', function(newVal) {
        // the `$watch` function will fire even if the
        // weather property is undefined, so we'll
        // check for it
        if (newVal) {
          timeSeriesGraph(scope.dates, scope.counts);
        }
      });

      //  watch date changes
      scope.$watch('ngStartdate', function(newVal) {
        scope.getChartData(iAttrs.ngStartdate);
        console.log(scope.ngStartdate);
      });

      scope.refresh = function() {
          alert('inside click');
      }
    }
  }
});

//enabling custom directive attributes
app.directive('ngStartdate', function() {
  return {
    controller: function($scope) {}
  }
});

var timeSeriesGraph = function(dates, counts) {
  var chart = c3.generate({
      bindto: '#chart',
      data: {
          x: 'x',
          columns: [
              dates,
              counts
          ]
      },
      axis: {
          x: {
              type: 'timeseries',
              tick: {
                  format: '%d.%m.%Y'
              }
          }
      }
  });
}

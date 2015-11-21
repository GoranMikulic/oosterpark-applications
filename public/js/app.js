var app = angular.module('chartsApp', []);

app.directive('ngLinechart', ['$compile', function($compile) {
  var url = "/wifidevicescount?";
  var uniqueId = 1;

  return {
    restrict: 'A',
    templateUrl: 'templates/ng-timeseries-chart.html',
    scope: {
      uniqueId: '='
    },
    controller: ['$scope', '$http', '$element', function($scope, $http, $element){
      $scope.getChartData = function(startdate, enddate) {
        $http({
          method: 'GET',
          url: url + 'startdate=' + startdate + '&enddate=' + enddate
        }).success(function(data) {
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

          $scope.dates = dates;
          $scope.counts = counts;
        });
      },
      $scope.addChart = function () {
        var el = $compile( "<div ng-sparkline ></div>" )( $scope );
        $element.parent().append(el);
      }
    }],
    link: function(scope, iElement, iAttrs, ctrl) {
      scope.uniqueId = uniqueId++;
      scope.getChartData(scope.startdate, scope.enddate);
      scope.$watch('dates', function(newVal) {
        // the `$watch` function will fire even if the
        // weather property is undefined, so we'll
        // check for it

        if (newVal) {
          timeSeriesGraph(scope.dates, scope.counts, scope.uniqueId);
        }
      });

      scope.refresh = function() {
          scope.getChartData(scope.startdate, scope.enddate);
      }
    }
  }
}]);

var timeSeriesGraph = function(dates, counts, uniqueId) {

  var chart = c3.generate({
      bindto: '#chart' + uniqueId,
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

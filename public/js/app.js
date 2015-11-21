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

          //Workaround for date parsing issue
          //c3 can't parse date format YYYY-MM-DDThh:mm:ss.sTZD
          var dates = data['Wifi-Devices'].x;
          for (i = 1; i < dates.length; i++) {
              dates[i] = new Date(dates[i]);
          }

          $scope.dates = dates;
          $scope.counts = data['Wifi-Devices'].counts;

        });
      },
      $scope.addChart = function () {
        var el = $compile( "<div ng-linechart ></div>" )( $scope );
        $element.parent().append(el);
      },
      $scope.deleteChart = function () {
        $element.remove();
        $scope.destroy();
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


/**
* Creating C3 Line Chart
*/
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
      },
      legend: {
        position: 'inset',
        inset: {
          anchor: 'top-right'
        }
      }
  });
}

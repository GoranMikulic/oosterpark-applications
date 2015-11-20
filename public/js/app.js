var app = angular.module('chartsApp', []);

app.directive('ngSparkline', function() {
  var url = "/wifidevicescount?";

  return {
    restrict: 'A',
    templateUrl: 'templates/ng-timeseries-chart.html',
    controller: ['$scope', '$http', function($scope, $http){
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
          console.log('start'+startdate);
          console.log('end'+enddate);
          $scope.dates = dates;
          $scope.counts = counts;
        });
      }
    }],
    link: function(scope, iElement, iAttrs, ctrl) {
      scope.getChartData(scope.startdate, scope.enddate);
      scope.$watch('dates', function(newVal) {
        // the `$watch` function will fire even if the
        // weather property is undefined, so we'll
        // check for it
        if (newVal) {
          timeSeriesGraph(scope.dates, scope.counts);
        }
      });

      //  watch date changes
      scope.$watch('startdate', function(newVal) {

        console.log(scope.startdate);
      });

      scope.refresh = function() {
          scope.getChartData(scope.startdate, scope.enddate);
          console.log('clicked');
      }
    }
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

$('.datepicker').datepicker({
    format: 'yyyy-mm-dd',
    startDate: '-3d'
})

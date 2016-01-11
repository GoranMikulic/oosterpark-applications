(function() {
  /**
   * Custom directive for linecharts
   */
  angular.module('dataAnalizingApp').directive('ngRealtime', function($compile, ChartResult, LiveChart) {

    return {
      restrict: 'A',
      templateUrl: 'angular/wifitracker/templates/ng-realtime.html',
      scope: {
        chartdata: '='
      },
      controller: 'wifiSocketController',
      link: function(scope, element, iAttrs, ctrl) {

        scope.initLiveChart();

        //Listening for changes in chartdate to update linechart
        scope.$watch('chartdata', function(newVal) {
          if (newVal) {
            if (scope.lineChart) {
              //load new chartdata into chart
              scope.lineChart.load({
                columns: [
                  scope.chartdata.dates,
                  scope.chartdata.counts
                ]
              });
            } else {
              scope.lineChart = LiveChart.createNew(chartdata);
            }
          }
        }, true);

        scope.pause = function() {
          clearInterval(scope.chartInterval);
          scope.chartInterval = false;
        }
        scope.play = function() {
          scope.startChartUpdateInterval();
        }
        scope.clear = function() {
          clearInterval(scope.chartInterval);
          scope.initLiveChart();
        }

      }
    }

  });
})();

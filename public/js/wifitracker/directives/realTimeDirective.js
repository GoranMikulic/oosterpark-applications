(function() {
    /**
     * Custom directive for linecharts
     */
    angular.module('dataAnalizingApp').directive('ngRealtime', function($compile, ChartResult, LiveChart) {

        return {
          restrict: 'A',
          templateUrl: 'js/wifitracker/templates/ng-realtime.html',
          scope: {
            chartdata: '='
          },
          controller: 'wifiSocketController',
          link: function(scope, element, iAttrs, ctrl) {
            //init chart data, TODO: Should this be in the controller?
            var dates = ['x'];
            var counts = ['count of devices'];
            scope.chartdata = ChartResult.createNew(dates, counts);
            //creating line chart
            scope.lineChart = LiveChart.createNew(scope.chartdata);

            //Listening for changes in chartdate to update linechart
            scope.$watch('chartdata', function(newVal) {
              console.log('chartdata changed' + Object.getOwnPropertyNames(newVal));
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

        }


      }

    });



})();

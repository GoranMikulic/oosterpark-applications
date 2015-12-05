(function() {
    /**
     * Custom directive for linecharts
     */
    angular.module('chartsApp').directive('ngRealtime', function($compile, ChartResult) {

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
            scope.lineChart = getLineChart(scope.chartdata);

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
                  scope.lineChart = getLineChart(chartdata);
                }
              }
            }, true);

        }


      }

    });

    /**
    * Creates line chart for live devices
    * TODO: Create common service
    */
    function getLineChart(chartdata) {
      return c3.generate({
        bindto: '#rtchart',
        data: {
          x: 'x',
          onclick: function(e) {
            //console.log('fired with: ' + e.x + e.id);
            callback(e.x, e.id);
          },
          columns: [
            chartdata.dates,
            chartdata.counts
          ]
        },
        axis: {
          x: {
            type: 'timeseries',
            tick: {
              format: d3.time.format('%H:%M:%S')
            }
          },

        },
        legend: {
          position: 'inset',
          inset: {
            anchor: 'top-right'
          }
        },
        zoom: {
          enabled: true
        }
      });


    }

})();

(function() {
    /**
     * Custom directive for linecharts
     */
    angular.module('chartsApp').directive('ngRealtime', function($compile) {

        return {
          restrict: 'A',
          templateUrl: 'js/wifitracker/templates/ng-realtime.html',
          scope: {
            chartdata: '='
          },
          controller: 'wifiSocketController',
          link: function(scope, element, iAttrs, ctrl) {
            var date = new Date();

            date ; //# => Fri Apr 01 2011 11:14:50 GMT+0200 (CEST)
            date.setDate(date.getDate() - 1);
            date ; //# => Thu Mar 31 2011 11:14:50 GMT+0200 (CEST)


            var dates = ['x', new Date()];
            var counts = ['count of devices', 0];

            scope.chartdata = new ChartResult(dates, counts);
            console.log("linked");

            scope.lineChart = getLineChart(scope.chartdata);

            scope.$watch('chartdata', function(newVal) {
              // the `$watch` function will fire even if the
              // dates property is undefined, so we'll
              // check for it
              console.log('chartdata changed' + Object.getOwnPropertyNames(newVal));
              if (newVal) {
                if (scope.lineChart) {
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
    function ChartResult(dates, counts) {
      this.dates = dates;
      this.counts = counts;
    }
})();

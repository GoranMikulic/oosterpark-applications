(function() {
  /**
   * Custom directive for linecharts
   */
  angular.module('dataAnalizingApp').directive('ngLinechart', function($compile, dataSetFactory, updateFormatter, timeSeriesGraph) {
    var uniqueId = 1;

    return {
      restrict: 'A',
      templateUrl: 'js/linechart/templates/ng-timeseries-chart.html',
      scope: {
        uniqueId: '=',
        chartdata: '='
      },
      controller: 'lineChartController',
      link: function(scope, element, iAttrs, ctrl) {
        scope.uniqueId = uniqueId++;

        angular.forEach(dataSetFactory.datasets, function(value, key) {
          scope.getChartData(scope.startdate, scope.enddate, value.url);
        });

        //listen for chart data changes
        scope.$watch('chartdata', function(newVal) {
          // the `$watch` function will fire even if the
          // dates property is undefined, so we'll
          // check for it

          if (newVal) {
            if (scope.lineChart) {
              if (scope.detailUrl != 'empty') {

                var unloadDataSets = new Array();

                // angular.forEach(dataSetFactory.datasets, function(value, key) {
                //   if (value.detailUrl != scope.detailUrl) {
                //     unloadDataSets.push(value.dataId);
                //   }
                // });
                scope.lineChart.load({
                  columns: [
                    scope.chartdata.dates,
                    scope.chartdata.counts
                  ],
                  unload: unloadDataSets
                });
                scope.lineChart.flush();
              } else {
                scope.lineChart.load({
                  columns: [
                    scope.chartdata.dates,
                    scope.chartdata.counts
                  ]
                });
              }

            } else {
              scope.lineChart = timeSeriesGraph(scope.chartdata.dates, scope.chartdata.counts, scope.uniqueId, scope.getDayDetails);
            }

          }

        }, false);

        scope.refresh = function() {
            updateFormatter();
            for (var i = 0; i < dataSetFactory.datasets.length; i++) {
              var value = dataSetFactory.datasets[i];
              scope.getChartData(scope.startdate, scope.enddate, value.url);
            }
          },
          scope.deleteChart = function() {
            element.remove();
          },
          scope.addChart = function() {
            var el = $compile("<div ng-linechart ></div>")(scope);
            element.parent().append(el);
            el.hide().fadeIn(1000);
            $("body").animate({
              scrollTop: el.offset().top
            }, "slow");
          }
      }
    }
  });

})();

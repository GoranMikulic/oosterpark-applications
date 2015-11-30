(function() {
  /**
   * Custom directive for linecharts
   */
  angular.module('chartsApp').directive('ngLinechart', ['$compile', 'dataSetFactory', 'updateFormatter', 'timeSeriesGraph', function($compile, dataSetFactory, updateFormatter, timeSeriesGraph) {
    var uniqueId = 1;
    console.log(dataSetFactory.datasets);
    return {
      restrict: 'A',
      templateUrl: 'templates/ng-timeseries-chart.html',
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

                angular.forEach(dataSetFactory.datasets, function(value, key) {
                  if (value.detailUrl != scope.detailUrl) {
                    unloadDataSets.push(value.dataId);
                  }
                });
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
              scope.lineChart = timeSeriesGraph(scope.chartdata.dates, scope.chartdata.counts, scope.uniqueId, scope.getDayDetailsData);
            }

          }

        }, false);

        scope.refresh = function() {

            angular.forEach(dataSetFactory.datasets, function(value, key) {
              scope.getChartData(scope.startdate, scope.enddate, value.url);
            });
            updateFormatter();
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
  }]);

})();

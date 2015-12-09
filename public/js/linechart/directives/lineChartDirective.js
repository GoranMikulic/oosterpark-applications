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

        angular.forEach(dataSetFactory.datasets, function(dataset) {
          scope.getChartData(scope.startdate, scope.enddate, dataset.url, dataset.resultFieldName);
        });

        //listen for chart data changes
        scope.$watch('chartdata', function(newVal) {
          if (newVal) {
            if (scope.lineChart) {

                scope.lineChart.load({
                  columns: [
                    scope.chartdata.dates,
                    scope.chartdata.counts
                  ]
                });

            } else {
              console.log('new chart created');
              scope.lineChart = timeSeriesGraph(scope.chartdata.dates, scope.chartdata.counts, scope.uniqueId, scope.getDayDetails);
            }

          }

        }, false);

        scope.refresh = function() {
            updateFormatter();
            angular.forEach(dataSetFactory.datasets, function(dataset) {
              scope.getChartData(scope.startdate, scope.enddate, dataset.url, dataset.resultFieldName);
            });
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

(function() {
  /**
   * Custom directive for linecharts
   */
  angular.module('dataAnalizingApp').directive('ngLinechart', function($compile, dataSetFactory, updateFormatter, multiaxesChart) {
    var uniqueId = 1;

    return {
      restrict: 'A',
      templateUrl: 'angular/linechart/templates/ng-timeseries-chart.html',
      scope: {
        uniqueId: '=',
        chartdata: '='
      },
      controller: 'lineChartController',
      link: function(scope, element, iAttrs, ctrl) {
        scope.uniqueId = uniqueId++;

        //Loading data for every defined dataset
        scope.queryPeriod();

        //listen for chart data changes and update chart
        scope.$watch('loadedData', function(newVal) {
          if (newVal) {
            //if chart already exists just reload data
            console.log("loadedData changed");
            if (scope.lineChart) {

              /**
              * Workaround for chart rendering issue,
              * if chart loads all datasets at once chart freezes at some point.
              * First loading x values and one value series. After that loading
              * all datasets.
              */
              scope.lineChart.load({
                columns: [
                  scope.loadedData[0],
                  scope.loadedData[1],
                ]
              });
              scope.lineChart.load({
                columns: scope.loadedData
              });
            } else {
              scope.lineChart = multiaxesChart(scope.loadedData, scope.uniqueId, scope.getDayDetails);
            }

          }

        }, false);

        scope.refresh = function() {
          updateFormatter();
          scope.queryPeriod();
        }
        scope.deleteChart = function() {
          element.remove();
        }
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

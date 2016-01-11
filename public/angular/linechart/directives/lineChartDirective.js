(function() {
  /**
   * Custom directive for linecharts
   */
  angular.module('dataAnalizingApp').directive('ngLinechart', function($compile, dataSetFactory, updateFormatter, multiaxesChart, CHART_MODE) {
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

        initChart();

        //listen for chart data changes and update chart
        scope.$watch('loadedData', function(newVal) {
          if (newVal) {
            //if chart already exists just reload data
            if (scope.lineChart) {
              loadDatasets(scope.loadedData);
            } else {
              scope.lineChart = multiaxesChart(scope.loadedData, scope.uniqueId, scope.loadDayDetails);
            }
          }

        }, false);

        function initChart() {
          scope.chartmode = CHART_MODE.period;
          updateFormatter();
          scope.queryPeriod();
        }

        function loadDatasets(datasets) {
          /**
          * Workaround for chart rendering issue,
          * if chart loads all datasets at once chart freezes at some point.
          * First loading x (time) values and one value series. After that loading
          * all datasets.
          */
          if(scope.loadedData.length > 0) {
            scope.lineChart.load({
              columns: [
                datasets[0],
                datasets[1],
              ]
            });
            scope.lineChart.load({
              columns: datasets
            });
          }
        }

        scope.loadDayDetails = function(daySelected) {
          scope.chartmode = CHART_MODE.day + " for "
            + daySelected.getDate() + "."
            + (daySelected.getMonth() + 1) + "."
            + daySelected.getFullYear();

          updateFormatter(true);
          scope.getDayDetails(daySelected);
        }
        scope.refresh = function() {
          scope.chartmode = CHART_MODE.period;
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

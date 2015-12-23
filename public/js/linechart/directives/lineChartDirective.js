(function() {
  /**
   * Custom directive for linecharts
   */
  angular.module('dataAnalizingApp').directive('ngLinechart', function($compile, dataSetFactory, updateFormatter, timeSeriesGraph, multiaxesChart) {
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
        scope.weatherAttributes = ["temp", "windspeed", "rain", "humidity", "clouds"];
        scope.weatherdata = new Array();
        scope.loadedData = new Array();
        //Loading data for every defined dataset
        angular.forEach(dataSetFactory.datasets, function(dataset) {
          scope.getChartData(scope.startdate, scope.enddate, dataset.url, dataset.resultFieldName);
        });

        //listen for chart data changes and update chart
        scope.$watch('chartdata', function(newVal) {
          if (newVal) {
            //if chart already exists just reload data
            if (scope.lineChart) {

              scope.lineChart.load({
                columns: [
                  scope.chartdata.dates,
                  scope.chartdata.counts
                ]
              });
            } else {
              scope.lineChart = timeSeriesGraph(scope.chartdata.dates, scope.chartdata.counts, scope.uniqueId, scope.getDayDetails);
            }

          }

        }, false);

        scope.$watch('weatherdata', function(newVal) {
          if (newVal) {
            //if chart already exists just reload data
            if (scope.lineChart) {
              scope.lineChart = multiaxesChart(scope.loadedData, scope.uniqueId, scope.getDayDetails);
            }
          }

        }, true);

        scope.refresh = function() {
          updateFormatter();
          angular.forEach(dataSetFactory.datasets, function(dataset) {
            scope.getChartData(scope.startdate, scope.enddate, dataset.url, dataset.resultFieldName);
          });

          if (scope.weatherdata.length > 0) {
            for (attr in scope.weatherAttributes) {
              scope.getWeatherData(scope.startdate, scope.enddate, scope.weatherAttributes[attr]);
            }
          }
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
        scope.showTemparature = function() {

          for (attr in scope.weatherAttributes) {
            if (scope.chartmode == "Period-View") {
              scope.getWeatherData(scope.startdate, scope.enddate, scope.weatherAttributes[attr]);
            } else {
              scope.getWeatherDayData(scope.selectedDetailDate, scope.weatherAttributes[attr]);
            }
          }
        }
      }
    }
  });

})();

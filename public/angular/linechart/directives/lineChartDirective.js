(function() {
  /**
   * Custom directive for linecharts
   */
  angular.module('dataAnalizingApp').directive('ngLinechart', function($compile, dataSetFactory, updateFormatter, timeSeriesChart, multiaxesChart) {
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
        scope.weatherAttributes = ["temp", "windspeed", "rain", "humidity", "clouds"];
        scope.weatherdata = new Array();
        scope.loadedData = new Array();
        //Loading data for every defined dataset
        scope.reloadAllDatasets();

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
              scope.lineChart = timeSeriesChart(scope.chartdata.dates, scope.chartdata.counts, scope.uniqueId, scope.getDayDetails);
            }

          }

        }, false);

        scope.$watch('weatherdata', function(newVal) {
          if (newVal) {
            if (scope.lineChart) {
              //creates chart with second axis for weather data
              scope.lineChart = multiaxesChart(scope.loadedData, scope.uniqueId, scope.getDayDetails);
            }
          }

        }, true);

        scope.refresh = function() {
          updateFormatter();
          scope.reloadAllDatasets();
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
        scope.loadWeather = function() {
          scope.loadWeatherData();
        }
      }
    }
  });

})();

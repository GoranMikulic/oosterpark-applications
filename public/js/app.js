var app = angular.module('chartsApp', []);

/**
 * Custom directive for linecharts
 */
app.directive('ngLinechart', ['$compile', function($compile) {
  //var url = "/wifidevicescount?";
  var uniqueId = 1;
  var resultFieldName = "Devices";

  return {
    restrict: 'A',
    templateUrl: 'templates/ng-timeseries-chart.html',
    scope: {
      uniqueId: '='
    },
    controller: ['$scope', '$http', '$element', function($scope, $http, $element) {
      $scope.getChartData = function(startdate, enddate, url) {
          $scope.dataLoading = true;

          $http({
              method: 'GET',
            url: url + 'startdate=' + startdate + '&enddate=' + enddate
          }).success(function(data) {
            //Workaround for date parsing issue
            //c3 can't parse date format YYYY-MM-DDThh:mm:ss.sTZD
            var dates = data[resultFieldName].x;
            for (i = 1; i < dates.length; i++) {
              dates[i] = new Date(dates[i]);
            }

            $scope.dates = dates;
            $scope.counts = data[resultFieldName].counts;
            $scope.dataLoading = false;

          });
        },
        $scope.getDefaultEndDate = function() {
          var curdate = new Date();
          var day = curdate.getDate();
          var month = curdate.getMonth() + 1;
          var year = curdate.getFullYear();
          return year + '-' + month + '-' + day;
        },
        $scope.getDefaultStartDate = function() {
          var curdate = new Date();
          curdate.setDate(curdate.getDate() - 30);
          var day = curdate.getDate();
          var month = curdate.getMonth() + 1;
          var year = curdate.getFullYear();
          return year + '-' + month + '-' + day;
        },
        $scope.getDayDetailsData = function(daySelected, chartId) {
          $scope.dataLoading = true;

          var url = chartId == wifiDataId ? wifiDetaillUrl : btDetaillUrl;

          var date = daySelected.getDate();
          var month = daySelected.getMonth() + 1;
          var year = daySelected.getFullYear();

          var dateString = year + '-' + month + '-' + date;
          $http({
            method: 'GET',
            url: url + 'day=' + dateString
          }).success(function(data) {

            //Workaround for date parsing issue
            //c3 can't parse date format YYYY-MM-DDThh:mm:ss.sTZD
            var dates = data[resultFieldName].x;

            for (i = 1; i < dates.length; i++) {
              dates[i] = new Date(dates[i]);
            }

            $scope.dates = dates;
            $scope.counts = data[resultFieldName].counts;
            updateFormatter(true);
            $scope.dataLoading = false;
          });
        }
    }],
    link: function(scope, element, iAttrs, ctrl) {
      scope.uniqueId = uniqueId++;

      angular.forEach(datasetUrls, function(value, key) {
        scope.getChartData(scope.startdate, scope.enddate, value);
      });

      //listen if chart data changes
      scope.$watch('dates', function(newVal) {
        // the `$watch` function will fire even if the
        // dates property is undefined, so we'll
        // check for it

        if (newVal) {
          if (scope.lineChart) {
            scope.lineChart.load({
              columns: [
                scope.dates,
                scope.counts
              ]
            });
          } else {
            scope.lineChart = timeSeriesGraph(scope.dates, scope.counts, scope.uniqueId, scope.getDayDetailsData);
          }

        }
      });
      scope.refresh = function() {
        angular.forEach(datasetUrls, function(value, key) {
          scope.getChartData(scope.startdate, scope.enddate, value);
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

var wifiUrl = "/wifidevicescount?";
var btUrl = "/btdevicescount?";
var datasetUrls = [wifiUrl, btUrl];

var wifiDetaillUrl = "/wifidevicescountdetail?";
var btDetaillUrl = "/btdevicescountdetail?";

var wifiDataId = "Amount of Wifi-Devices";
var btDataId = "Amount of Bluetooth-Devices";


/**
 * Creating C3 Line Chart
 */
var formatter;

/**
 * Formatter has to be changed in detail view to show hours instead of dates
 */
function updateFormatter(days) {
  formatter = d3.time.format(days ? '%H' : '%d.%m.%Y');
}

var timeSeriesGraph = function(dates, counts, uniqueId, callback) {
  updateFormatter();

  var chart = c3.generate({
    bindto: '#chart' + uniqueId,
    data: {
      x: 'x',
      onclick: function(e) {
        callback(e.x, e.id);
      },
      columns: [
        dates,
        counts
      ]
    },
    axis: {
      x: {
        type: 'timeseries',
        tick: {
          format: function(x) { // x comes in as a time string.
            return formatter(x);
          }
        }
      }
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

  return chart;

}

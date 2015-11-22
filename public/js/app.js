var app = angular.module('chartsApp', []);

app.directive('ngLinechart', ['$compile', function($compile) {
  //var url = "/wifidevicescount?";
  var uniqueId = 1;
  var wifiFieldName = "Wifi-Devices";
  var btFieldName = "Bluetooth-Devices";


  return {
    restrict: 'A',
    templateUrl: 'templates/ng-timeseries-chart.html',
    scope: {
      uniqueId: '='
    },
    controller: ['$scope', '$http', '$element', function($scope, $http, $element){
      $scope.getChartData = function(startdate, enddate, url) {
        $scope.dataLoading = true;

        $http({
          method: 'GET',
          url: url + 'startdate=' + startdate + '&enddate=' + enddate
        }).success(function(data) {

          //Workaround for date parsing issue
          //c3 can't parse date format YYYY-MM-DDThh:mm:ss.sTZD
          var dates = data['Wifi-Devices'].x;
          for (i = 1; i < dates.length; i++) {
              dates[i] = new Date(dates[i]);
          }

          $scope.dates = dates;
          $scope.counts = data['Wifi-Devices'].counts;
          $scope.dataLoading = false;

        });
      },
      $scope.addChart = function () {
        var el = $compile( "<div ng-linechart ></div>" )( $scope );
        $element.parent().append(el);
        el.hide().fadeIn(1000);
        $("body").animate({scrollTop: el.offset().top}, "slow");
      },
      $scope.getDefaultEndDate = function () {
        var curdate = new Date();
        var day = curdate.getDate();
        var month = curdate.getMonth()+1;
        var year = curdate.getFullYear();
        return year + '-' + month + '-' + day;
      },
      $scope.getDefaultStartDate = function () {
        var curdate = new Date();
        curdate.setDate(curdate.getDate()-30);
        var day = curdate.getDate();
        var month = curdate.getMonth()+1;
        var year = curdate.getFullYear();
        return year + '-' + month + '-' + day;
      },
      $scope.deleteChart = function () {
        $element.remove();
      },
      $scope.showDayDetails = function (daySelected) {
        $scope.dataLoading = true;

        var date = daySelected.getDate();
        var month = daySelected.getMonth()+1;
        var year = daySelected.getFullYear();

        var dateString = year + '-' + month + '-' + date;
        $http({
          method: 'GET',
          url: '/wifidevicescountdetail?' + 'day=' + dateString
        }).success(function(data) {

          //Workaround for date parsing issue
          //c3 can't parse date format YYYY-MM-DDThh:mm:ss.sTZD
          var dates = data['Wifi-Devices'].x;

          for (i = 1; i < dates.length; i++) {
              dates[i] = new Date(dates[i]);
          }

          $scope.dates = dates;
          $scope.counts = data['Wifi-Devices'].counts;
          $scope.dataLoading = false;
          updateFormatter(true);
          $scope.dataLoading = false;

        });
      }
    }],
    link: function(scope, iElement, iAttrs, ctrl) {
      scope.uniqueId = uniqueId++;
      var url = "/wifidevicescount?";
      console.log(scope.dataset);
      scope.getChartData(scope.startdate, scope.enddate, url);

      //listen if chart data changes
      scope.$watch('dates', function(newVal) {
        // the `$watch` function will fire even if the
        // dates property is undefined, so we'll
        // check for it

        if (newVal) {
          if(scope.lineChart){
            scope.lineChart.load({
              columns: [
                  scope.dates,
                  scope.counts
              ]
            });
          } else {
            scope.lineChart = timeSeriesGraph(scope.dates, scope.counts, scope.uniqueId, scope.showDayDetails);

          }

        }
      });

      scope.refresh = function() {
          scope.getChartData(scope.startdate, scope.enddate);
          updateFormatter();
      }
    }
  }
}]);


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
          onclick: function(e) { callback(e.x); },
          columns: [
              dates,
              counts
          ]
      },
      axis: {
          x: {
              type: 'timeseries',
              tick: {
                  format: function (x) { // x comes in as a time string.
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

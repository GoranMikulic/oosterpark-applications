(function() {
  // using the function form of use-strict...
  "use strict";
  // accessing the module in another.
  // this can be done by calling angular.module without the []-brackets
  angular.module('chartsApp')
    .controller('lineChartController', function($scope, $http, $element, getDetailUrl, updateFormatter, ChartResult) {
      var resultFieldName = "Devices";

      $scope.getChartData = function(startdate, enddate, url) {
          $scope.dataLoading = true;
          $scope.detailUrl = 'empty';
          $http({
            method: 'GET',
            url: url + 'startdate=' + startdate + '&enddate=' + enddate
          }).success(function(data) {
            //Workaround for date parsing issue
            //c3 can't parse date format YYYY-MM-DDThh:mm:ss.sTZD
            var dates = data[resultFieldName].x;
            for (var i = 1; i < dates.length; i++) {
              //console.log('old: ' + dates[i]);
              dates[i] = new Date(dates[i]);
              //console.log('new: ' + dates[i]);
            }

            $scope.chartdata = ChartResult.createNew(dates, data[resultFieldName].counts);
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
          $scope.detailUrl = getDetailUrl(chartId);

          var date = daySelected.getDate();
          var month = daySelected.getMonth() + 1;
          var year = daySelected.getFullYear();

          var dateString = year + '-' + month + '-' + date;
          $http({
            method: 'GET',
            url: $scope.detailUrl + 'day=' + dateString
          }).success(function(data) {

            //Workaround for date parsing issue
            //c3 can't parse date format YYYY-MM-DDThh:mm:ss.sTZD
            var dates = data[resultFieldName].x;

            for (var i = 1; i < dates.length; i++) {
              dates[i] = new Date(dates[i]);
            }
            $scope.chartdata = ChartResult.createNew(dates, data[resultFieldName].counts);
            updateFormatter(true);
            $scope.dataLoading = false;
          });
        }
    });
})();

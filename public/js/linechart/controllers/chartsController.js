(function() {
  "use strict";

  angular.module('dataAnalizingApp')
    .controller('lineChartController', function($scope, $http, $element, getDetailUrl, updateFormatter, ChartResult) {
      var resultFieldName = "Devices";

      /**
      * @param {Date} - startdate
      * @param {Date} - enddate
      * @param {String} - url
      */
      $scope.getChartData = function(startdate, enddate, url) {
          $scope.dataLoading = true;
          $scope.detailUrl = 'empty';
          $http({
            method: 'GET',
            url: url + 'startdate=' + startdate + '&enddate=' + enddate
          }).success(function(data) {

            //Workaround for date parsing issue
            //c3 can't parse date format YYYY-MM-DDThh:mm:ss.sTZD
            //TODO: check out better solutions/should this be done in the backend?
            var dates = data[resultFieldName].x;
            for (var i = 1; i < dates.length; i++) {
              dates[i] = new Date(dates[i]);
            }

            $scope.chartdata = ChartResult.createNew(dates, data[resultFieldName].counts);
            $scope.dataLoading = false;
          });
        },

        /**
        * Returns default end-date
        * @return {String} returns default start date
        */
        $scope.getDefaultEndDate = function() {
          var curdate = new Date();
          var day = curdate.getDate()+10;
          var month = curdate.getMonth() + 1;
          var year = curdate.getFullYear();
          return year + '-' + month + '-' + day;
        },

        /**
        * Returns default start-date
        * TODO: Refactoring! Copy-paste code! see getDefaultEndDate()
        * @return {String} returns default start date
        */
        $scope.getDefaultStartDate = function() {
          var curdate = new Date();
          curdate.setDate(curdate.getDate() - 30);
          var day = curdate.getDate();
          var month = curdate.getMonth() + 1;
          var year = curdate.getFullYear();
          return year + '-' + month + '-' + day;
        },

        /**
        * Requesting and fetching data for a particular day
        * TODO: rename! returns nothing - therefore no get... name
        * @param {Date} daySelected - The selected Day for the detail view
        * @param {string|number} chartId - unique id of the chart
        */
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

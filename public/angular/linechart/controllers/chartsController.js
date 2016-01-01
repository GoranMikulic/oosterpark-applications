(function() {
  "use strict";

  angular.module('dataAnalizingApp')
    .controller('lineChartController', function($scope, $http, $element, updateFormatter, ChartResult, dataSetFactory, CHART_MODE) {

      /**
       * Reloads all datasets which are defined in the dataset configuration
       */
      $scope.reloadAllDatasets = function() {
        angular.forEach(dataSetFactory.datasets, function(dataset) {
          $scope.getChartData($scope.startdate, $scope.enddate, dataset);
        });
      }

      /**
       * Requests dataset with a GET request at the given url, for the given time period
       * @param {Date} startdate
       * @param {Date} enddate
       * @param {String} url - REST API Url
       * @param {String} resultFieldName - Name of JSON result field
       */
      $scope.getChartData = function(startdate, enddate, dataset) {
        $scope.dataLoading = true;
        $scope.chartmode = CHART_MODE.period;
        $http({
          method: 'GET',
          url: dataset.getPeriodUrl(startdate, enddate)
        }).success(function(data) {
          
          var dates = getConvertedDates(data[dataset.resultFieldName].x);
          $scope.chartdata = ChartResult.createNew(dates, data[dataset.resultFieldName].counts);
          $scope.loadedData.push(dates);
          $scope.loadedData.push(data[dataset.resultFieldName].counts);
          $scope.dataLoading = false;
        });
      }

      /**
       * Loads all detail data for each defined dataset for the selected date
       * @param {Date} daySelected - The selected day
       */
      $scope.getDayDetails = function(daySelected) {
        $scope.chartmode = CHART_MODE.day + " for " + daySelected.getDate() + "." + (daySelected.getMonth() + 1) + "." + daySelected.getFullYear();
        $scope.loadedData = new Array();

        angular.forEach(dataSetFactory.datasets, function(dataset, key) {
          getDayDetailsData(dataset, daySelected);
        });
      }

      /**
       * Returns default end-date
       * @return {String} returns default start date
       */
      $scope.getDefaultEndDate = function() {
        var curdate = new Date();
        curdate.setDate(curdate.getDate() + 10);
        var month = curdate.getMonth() + 1;
        return curdate.getFullYear() + '-' + month + '-' + curdate.getDate();
      }

      /**
       * Returns default start-date
       * TODO: Refactoring! Copy-paste code! see getDefaultEndDate()
       * Should be more generic
       * @return {String} returns default start date
       */
      $scope.getDefaultStartDate = function() {
        var curdate = new Date();
        curdate.setDate(curdate.getDate() - 30);
        var month = curdate.getMonth() + 1;
        return curdate.getFullYear() + '-' + month + '-' + curdate.getDate();
      }

      /**
       * Requesting and fetching data for a particular day
       * TODO: rename! returns nothing - therefore no get... name
       * @param {Date} daySelected - The selected Day for the detail view
       * @param {string|number} chartId - unique id of the chart
       */
      function getDayDetailsData(dataset, daySelected) {
        $scope.dataLoading = true;
        $scope.selectedDetailDate = daySelected;

        $http({
          method: 'GET',
          url: dataset.getDayDetailUrl(getDateStringForReq(daySelected))
        }).success(function(data) {

          //Workaround for date parsing issue
          //c3 can't parse date format YYYY-MM-DDThh:mm:ss.sTZD
          var dates = getConvertedDates(data[dataset.resultFieldName].x);

          $scope.chartdata = ChartResult.createNew(dates, data[dataset.resultFieldName].counts);
          $scope.loadedData.push(dates);
          $scope.loadedData.push(data[dataset.resultFieldName].counts);
          updateFormatter(true);
          $scope.dataLoading = false;

        });
      }

      /* Workaround for date parsing issue
       * c3 can't parse date format YYYY-MM-DDThh:mm:ss.sTZD
       * TODO: check out better solutions/should this be done in the backend?
       * @param {Dates[]}
       */
      function getConvertedDates(dates) {
        for (var i = 1; i < dates.length; i++) {
          dates[i] = new Date(dates[i]);
        }
        return dates;
      }

      /**
       * Converts {Date} to date string format for request (yyyy-mm-dd)
       * @param {Date} date
       */
      function getDateStringForReq(date) {
        var day = date.getDate();
        var month = date.getMonth() + 1;
        var year = date.getFullYear();

        return year + '-' + month + '-' + day;
      }

    });
})();

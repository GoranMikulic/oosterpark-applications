(function() {
  "use strict";

  angular.module('dataAnalizingApp')
    .controller('lineChartController', function($scope, $http, $element, updateFormatter, ChartResult, dataSetFactory, weatherAttributes, CHART_MODE) {

      /**
       * Loads weather data for all defined weather attributes
       */
      $scope.loadWeatherData = function() {
        for (var attr in weatherAttributes.attributes) {
          if ($scope.chartmode == CHART_MODE.period) {
            $scope.loadWeatherAttribute($scope.startdate, $scope.enddate, weatherAttributes.attributes[attr]);
          } else {
            $scope.loadWeatherAttrForDay($scope.selectedDetailDate, weatherAttributes.attributes[attr]);
          }
        }
      }

      /**
       * Reloads all datasets which are defined in the dataset configuration
       * If the weather data is already loaded it also reloads weather data
       */
      $scope.reloadAllDatasets = function() {
        angular.forEach(dataSetFactory.datasets, function(dataset) {
          $scope.getChartData($scope.startdate, $scope.enddate, dataset.url, dataset.resultFieldName);
        });

        if ($scope.weatherdata.length > 0) {
          for (var attr in weatherAttributes.attributes) {
            $scope.loadWeatherAttribute($scope.startdate, $scope.enddate, weatherAttributes.attributes[attr]);
          }
        }
      }

      /**
       * Requests dataset with a GET request at the given url, for the given time period
       * @param {Date} startdate
       * @param {Date} enddate
       * @param {String} url - REST API Url
       * @param {String} resultFieldName - Name of JSON result field
       */
      $scope.getChartData = function(startdate, enddate, url, resultFieldName) {
        $scope.dataLoading = true;
        $scope.chartmode = CHART_MODE.period;
        $http({
          method: 'GET',
          url: url + 'startdate=' + startdate + '&enddate=' + enddate
        }).success(function(data) {

          var dates = getConvertedDates(data[resultFieldName].x);
          $scope.chartdata = ChartResult.createNew(dates, data[resultFieldName].counts);
          $scope.loadedData.push(dates);
          $scope.loadedData.push(data[resultFieldName].counts);
          $scope.dataLoading = false;
        });
      }

      /**
       * Loads weather data for the given period of time
       * @param {Date} startdate
       * @param {Date} enddate
       * @param {String} Name of weather attribute
       */
      $scope.loadWeatherAttribute = function(startdate, enddate, attr) {
        $scope.dataLoading = true;
        var weatherUrl = "/weatherperiod?";
        $http({
          method: 'GET',
          url: weatherUrl + 'startdate=' + startdate + '&enddate=' + enddate + '&attr=' + attr
        }).success(function(data) {
          $scope.weatherdata.push(data["Result"].weather);
          $scope.loadedData.push(data["Result"].weather);
          $scope.dataLoading = false;
        });
      }

      /**
       * Loads time value series for the given date and the given weather attribute
       * adds the dataset to the chart data
       * @param {Date} date - date to load the data for
       * @param {String} attr - Name of weather attribute
       */
      $scope.loadWeatherAttrForDay = function(date, attr) {
        $scope.dataLoading = true;
        var weatherUrl = "/weatherdetail?";

        $http({
          method: 'GET',
          url: weatherUrl + 'day=' + getDateStringForReq(date) + '&attr=' + attr
        }).success(function(data) {
          $scope.weatherdata.push(data["Result"].weather);
          $scope.loadedData.push(data["Result"].weather);
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
          getDayDetailsData(daySelected, dataset.dataId, dataset.detailUrl, dataset.resultFieldName);
        });

        if ($scope.weatherdata.length > 0) {
          for (var attr in weatherAttributes.attributes) {
            $scope.loadWeatherAttrForDay(daySelected, weatherAttributes.attributes[attr]);
          }
        }

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
      function getDayDetailsData(daySelected, chartId, detailUrl, resultFieldName) {
        $scope.dataLoading = true;
        $scope.selectedDetailDate = daySelected;

        $http({
          method: 'GET',
          url: detailUrl + 'day=' + getDateStringForReq(daySelected)
        }).success(function(data) {

          //Workaround for date parsing issue
          //c3 can't parse date format YYYY-MM-DDThh:mm:ss.sTZD
          var dates = getConvertedDates(data[resultFieldName].x);

          $scope.chartdata = ChartResult.createNew(dates, data[resultFieldName].counts);
          $scope.loadedData.push(dates);
          $scope.loadedData.push(data[resultFieldName].counts);
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

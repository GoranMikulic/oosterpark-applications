(function() {
  "use strict";

  angular.module('dataAnalizingApp').factory('DataSource', function() {
    /**
     * Defines the model for a data source
     * @param {String} url - Url for period query
     * @param {String} detailUrl - Url to query data of a day
     * @param {String} resultFieldName - JSON field name for the result list of the requests
     */
    function DataSource(url, detailUrl, dataId, resultFieldName) {
      this.url = url;
      this.detailUrl = detailUrl;
      this.dataId = dataId;
      this.resultFieldName = resultFieldName;
    }

    DataSource.prototype.getDayDetailUrl = function(daySelected) {
      return this.detailUrl + 'day=' + daySelected;
    };

    DataSource.prototype.getPeriodUrl = function(startDate, endDate) {
      return this.url + 'startdate=' + startDate + '&enddate=' + endDate;
    };

    DataSource.build = function(url, detailUrl, dataId, resultFieldName) {
      return new DataSource(url, detailUrl, dataId, resultFieldName);
    }

    return DataSource;

  });

})();

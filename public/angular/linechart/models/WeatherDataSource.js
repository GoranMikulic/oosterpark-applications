(function() {
  "use strict";

  /**
  * Model for a weather data source, extends DataSource
  */
  angular.module('dataAnalizingApp').factory('WeatherDataSource', function(DataSource) {

    WeatherDataSource.prototype = new DataSource();

    function WeatherDataSource(url, detailUrl, resultFieldName, attr) {
      DataSource.apply(this, arguments);
      this.attr = attr;
    }

    WeatherDataSource.prototype.getDayDetailUrl = function(daySelected) {
      return this.detailUrl + 'day=' + daySelected + '&attr=' + this.attr;
    };

    WeatherDataSource.prototype.getPeriodUrl = function(startDate, endDate) {
      return this.url + 'startdate=' + startDate + '&enddate=' + endDate + '&attr=' + this.attr;
    };

    return WeatherDataSource;
  });

})();

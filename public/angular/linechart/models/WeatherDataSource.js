(function() {
  "use strict";

  angular.module('dataAnalizingApp').factory('WeatherDataSource', function(DataSource) {

    WeatherDataSource.prototype = new DataSource();

    function WeatherDataSource(url, detailUrl, dataId, resultFieldName, attr) {
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

  angular.module('dataAnalizingApp').constant('weatherAttributes', {
    attributes: ["temp", "windspeed", "rain", "humidity", "clouds"],
    labels: {
      temp: 'Temparature in °C',
      windspeed: 'Windspeed in m/s',
      rain: 'Rain in mm',
      humidity: 'Humidity (%)',
      clouds: 'Cloudiness (%)'
    }
  });
  
})();

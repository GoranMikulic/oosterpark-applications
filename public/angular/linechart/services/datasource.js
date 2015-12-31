(function() {
  "use strict";

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

  /**
   * Returns datasources for the linechart
   * @returns Datasources for the linechart
   */
  angular.module('dataAnalizingApp').factory('dataSetFactory', function() {

    var wifiData = new DataSource('/wifidevicescount?', '/wifidevicescountdetail?', 'Amount of Wifi-Devices', 'Result');
    var btData = new DataSource('/btdevicescount?', '/btdevicescountdetail?', 'Amount of Bluetooth-Devices', 'Result');

    var datasets = [wifiData, btData];

    return {
      datasets: datasets
    }
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

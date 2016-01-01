(function() {
  "use strict";
  
  /**
   * Returns datasources for the linechart
   * @returns Datasources for the linechart
   */
  angular.module('dataAnalizingApp').factory('dataSetFactory', function(DataSource, WeatherDataSource) {

    var wifiData = DataSource.build('/wifidevicescount?', '/wifidevicescountdetail?', 'Amount of Wifi-Devices', 'Result');
    var btData = DataSource.build('/btdevicescount?', '/btdevicescountdetail?', 'Amount of Bluetooth-Devices', 'Result');
    var temperature = new WeatherDataSource('/weatherperiod?', '/weatherdetail?', 'Temp', 'Result', 'temp');
    var windspeed = new WeatherDataSource('/weatherperiod?', '/weatherdetail?', 'Windspeed', 'Result', 'windspeed');
    var rain = new WeatherDataSource('/weatherperiod?', '/weatherdetail?', 'Rain', 'Result', 'rain');
    var humidity = new WeatherDataSource('/weatherperiod?', '/weatherdetail?', 'Humidity', 'Result', 'humidity');
    var clouds = new WeatherDataSource('/weatherperiod?', '/weatherdetail?', 'Clouds', 'Result', 'clouds');

    var datasets = [wifiData, btData, temperature, windspeed, rain, humidity, clouds];

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

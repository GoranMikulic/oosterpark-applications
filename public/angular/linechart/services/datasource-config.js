(function() {
  "use strict";

  /**
   * Returns datasources for the linechart
   * @returns Datasources for the linechart
   */
  angular.module('dataAnalizingApp').factory('dataSetFactory', function(DataSource, WeatherDataSource) {

    var wifiData = DataSource.build('/wifidevicescount?', '/wifidevicescountdetail?', 'Result');
    var btData = DataSource.build('/btdevicescount?', '/btdevicescountdetail?', 'Result');
    var walkers = DataSource.build('/walkers?', '/walkersdetail?', 'Result');
    var runners = DataSource.build('/runners?', '/runnersdetail?', 'Result');
    var noise = DataSource.build('/noise?', '/noisedetail?', 'Result');
    var temperature = new WeatherDataSource('/weatherperiod?', '/weatherdetail?', 'Result', 'temp');
    var windspeed = new WeatherDataSource('/weatherperiod?', '/weatherdetail?', 'Result', 'windspeed');
    var rain = new WeatherDataSource('/weatherperiod?', '/weatherdetail?', 'Result', 'rain');
    var humidity = new WeatherDataSource('/weatherperiod?', '/weatherdetail?', 'Result', 'humidity');
    var clouds = new WeatherDataSource('/weatherperiod?', '/weatherdetail?', 'Result', 'clouds');

    var datasets = [wifiData, btData, walkers, runners, noise, temperature, windspeed, rain, humidity, clouds];

    return {
      datasets: datasets
    }
  });

})();

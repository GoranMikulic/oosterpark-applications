(function() {
  "use strict";

  angular.module('dataAnalizingApp').constant('chartconfig', {
    datasetsToHide: ["temp", "windspeed", "rain", "humidity", "clouds", "decibel"],
    labels: {
      temp: 'Temperature in °C',
      windspeed: 'Windspeed in m/s',
      rain: 'Rain in mm',
      humidity: 'Humidity (%)',
      clouds: 'Cloudiness (%)',
      wifidevices: 'Amount of Wifi-Devices',
      btdevices: 'Amount of Bluetooth-Devices',
      walkers: 'Amount of walkers',
      runners: 'Amount of runners',
      decibel: 'Noise in decibel'
    },
    axes: {
      x: 'y',
      temp: 'y2',
      windspeed: 'y2',
      rain: 'y2',
      humidity: 'y2',
      clouds: 'y2',
      decibel: 'y2'
    },
    y1label: 'Amount of Devices',
    y2label: 'Weather'
  });

  angular.module('dataAnalizingApp').constant('CHART_MODE', {
    period: "Period-View",
    day: "Day-View"
  });

})();

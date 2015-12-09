(function() {
  "use strict";


  angular.module('dataAnalizingApp').factory('dataSetFactory', function() {
    function DataSource(url, detailUrl, dataId, resultFieldName) {
      this.url = url;
      this.detailUrl = detailUrl;
      this.dataId = dataId;
      this.resultFieldName = resultFieldName;
    }

    var wifiUrl = '/wifidevicescount?';
    var btUrl = "/btdevicescount?";
    var wifiDetaillUrl = "/wifidevicescountdetail?";
    var btDetaillUrl = "/btdevicescountdetail?";
    var wifiDataId = "Amount of Wifi-Devices";
    var btDataId = "Amount of Bluetooth-Devices";
    var resultFieldName = "Devices";

    var wifiData = new DataSource(wifiUrl, wifiDetaillUrl, wifiDataId, resultFieldName);
    var btData = new DataSource(btUrl, btDetaillUrl, btDataId, resultFieldName);
    var datasets = [wifiData, btData];

    return {
      datasets: datasets
    }
  });

  /**
   * Creating C3 Line Chart
   */
  var formatter;

  /**
   * Formatter has to be changed in detail view to show hours instead of dates
   */
  angular.module('dataAnalizingApp').factory('updateFormatter', function() {
    return function(days) {
      formatter = d3.time.format(days ? '%H' : '%d.%m.%Y');
    }
  });

  /**
  * Returns a time series chart
  */
  angular.module('dataAnalizingApp').factory('timeSeriesGraph', function(updateFormatter) {
    return function(dates, counts, uniqueId, callback) {
      updateFormatter();

      var chart = c3.generate({
        bindto: '#chart' + uniqueId,
        data: {
          x: 'x',
          onclick: function(e) {
            callback(e.x);
          },
          columns: [
            dates,
            counts
          ]
        },
        axis: {
          x: {
            type: 'timeseries',
            tick: {
              format: function(x) { // x comes in as a time string.
                return formatter(x);
              }
            }
          }
        },
        legend: {
          position: 'inset',
          inset: {
            anchor: 'top-right'
          }
        },
        zoom: {
          enabled: true
        }
      });

      return chart;
    }
  });

})();

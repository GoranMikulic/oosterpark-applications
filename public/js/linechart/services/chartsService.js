(function() {
  "use strict";


  angular.module('chartsApp').factory('dataSetFactory', function() {
    function DataSource(url, detailUrl, dataId) {
      this.url = url;
      this.detailUrl = detailUrl;
      this.dataId = dataId;
    }

    var wifiUrl = '/wifidevicescount?';
    var btUrl = "/btdevicescount?";
    var wifiDetaillUrl = "/wifidevicescountdetail?";
    var btDetaillUrl = "/btdevicescountdetail?";
    var wifiDataId = "Amount of Wifi-Devices";
    var btDataId = "Amount of Bluetooth-Devices";

    var wifiData = new DataSource(wifiUrl, wifiDetaillUrl, wifiDataId);
    var btData = new DataSource(btUrl, btDetaillUrl, btDataId);
    var datasets = [wifiData, btData];

    return {
      datasets: datasets
    }
  });

  angular.module('chartsApp').factory('getDetailUrl', function(dataSetFactory) {
    return function(chartId) {

      for (var i = 0; i < dataSetFactory.datasets.length; i++) {
        var value = dataSetFactory.datasets[i];
        if (chartId == value.dataId) {
          //console.log('result ' + chartId + ' ' + value.dataId);
          return value.detailUrl;
        }
      }
    }
  });

  /**
   * Creating C3 Line Chart
   */
  var formatter;

  /**
   * Formatter has to be changed in detail view to show hours instead of dates
   */
  angular.module('chartsApp').factory('updateFormatter', function() {
    return function(days) {
      formatter = d3.time.format(days ? '%H' : '%d.%m.%Y');
    }
  });

  /**
  * Returns a time series chart
  */
  angular.module('chartsApp').factory('timeSeriesGraph', function(updateFormatter) {
    return function(dates, counts, uniqueId, callback) {
      updateFormatter();

      var chart = c3.generate({
        bindto: '#chart' + uniqueId,
        data: {
          x: 'x',
          onclick: function(e) {
            //console.log('fired with: ' + e.x + e.id);
            callback(e.x, e.id);
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

(function() {
  "use strict";


  angular.module('dataAnalizingApp').constant('CHART_MODE', {
    period: "Period-View",
    day: "Day-View"
  });

  /**
   * Returns a time series chart
   */
  angular.module('dataAnalizingApp').factory('timeSeriesChart', function(updateFormatter) {
    return function(dates, counts, uniqueId, callback) {
      updateFormatter();

      var chart = c3.generate({
        size: {
          height: 400
        },
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

  /**
   * Returns chart with second Y-Axis for weather data
   * @param {Array} loadedData - Datasets to load
   * @param {int} uniqueId - Unique Id of the chart directive
   * @param {function} callback - callback function for onClick event for a datapoint
   * @returns chart with second Y-Axis for weather data
   */
  angular.module('dataAnalizingApp').factory('multiaxesChart', function(updateFormatter, weatherAttributes) {
    return function(loadedData, uniqueId, callback) {

      var chart = c3.generate({
        size: {
          height: 400
        },
        bindto: '#chart' + uniqueId,
        data: {
          x: 'x',
          onclick: function(e) {
            callback(e.x);
          },
          columns: loadedData,
          names: weatherAttributes.labels,
          axes: {
            x: 'y',
            temp: 'y2',
            windspeed: 'y2',
            rain: 'y2',
            humidity: 'y2',
            clouds: 'y2'
          },
          hide: weatherAttributes.attributes
        },
        axis: {
          y: {
            label: {
              text: "Amount of Devices",
              position: 'outer-middle'
            }
          },
          y2: {
            show: true,
            min: 0,
            label: {
              text: "Weather",
              position: 'outer-middle'
            }
          },
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
        },
        line: {
          connectNull: true
        }
      });

      return chart;
    }
  });

  //Formatter for linechart
  var formatter;

  /**
   * Formatter has to be changed in detail view to show hours instead of dates
   */
  angular.module('dataAnalizingApp').factory('updateFormatter', function() {
    return function(days) {
      formatter = d3.time.format(days ? '%H' : '%d.%m.%Y');
    }
  });

})();

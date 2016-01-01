(function() {
  "use strict";

  /**
   * Returns chart with second Y-Axis for weather data
   * @param {Array} loadedData - Datasets to load
   * @param {int} uniqueId - Unique Id of the chart directive
   * @param {function} callback - callback function for onClick event for a datapoint
   * @returns chart with second Y-Axis for weather data
   */
  angular.module('dataAnalizingApp').factory('multiaxesChart', function(updateFormatter, chartconfig) {
    return function(loadedData, uniqueId, callback) {
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
          columns: loadedData,
          names: chartconfig.labels,
          axes: chartconfig.axes,
          hide: chartconfig.datasetsToHide
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

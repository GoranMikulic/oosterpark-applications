(function() {
  "use strict";
  /**
  * Handling socket connection, providing methods for listening and emitting data
  */
  angular.module('dataAnalizingApp').factory('LiveChart', function($rootScope, $http) {

    /**
    * Creates line chart for live devices
    * TODO: Create common service
    */
    function createLineChart(chartdata) {
      return c3.generate({
        bindto: '#rtchart',
        data: {
          x: 'x',
          onclick: function(e) {
            callback(e.x, e.id);
          },
          columns: [
            chartdata.dates,
            chartdata.counts
          ]
        },
        axis: {
          x: {
            type: 'timeseries',
            tick: {
              format: d3.time.format('%H:%M:%S')
            }
          },

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


    }
    return {
      createNew: function(chartdata) {
        return createLineChart(chartdata);
      }
    };

  });
})();

(function() {
  "use strict";

  angular.module('chartsApp').factory('ChartResult', function() {
    function ChartResult(dates, counts) {
      this.dates = dates;
      this.counts = counts;
    }

    return {
      createNew: function(dates, counts) {
        return new ChartResult(dates, counts);
      }
    };
  });

})();

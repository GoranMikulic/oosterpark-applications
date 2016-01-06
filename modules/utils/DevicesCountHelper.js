var Utils = require('../utils/Utils');

module.exports = {
  fetchDevicesForDay: function(day, datePropertyName, comparator, dataname, response, dbFunction, entityIdentifier) {

    if (typeof day !== 'undefined') {
      var start = day + ' 00:01:00';
      var end = day + ' 23:59:00';

      dbFunction(start, end, function(queryResult) {
        var hours = Utils.getClockHours(day);
        var result = getDevicesCountsForTimeRange(hours, queryResult, datePropertyName, comparator, dataname, entityIdentifier);

        Utils.returnResult(response, result);
      });
    } else {
      Utils.returnResult(response, {});
    }
  },

  returnStatsForPeriod: function(startDate, endDate, datePropertyName, comparator, dataname, response, dbFunction, entityIdentifier) {
    var isValidPeriodQuery = Utils.checkPeriodQuery(startDate, endDate);

    if (isValidPeriodQuery) {
      dbFunction(startDate, endDate, function(queryResult) {

        var datesBetween = Utils.getDatesBetween(new Date(startDate), new Date(endDate));
        var result = getDevicesCountsForTimeRange(datesBetween, queryResult, datePropertyName, comparator, dataname, entityIdentifier);

        Utils.returnResult(response, result);
      });
    } else {
      Utils.returnResult(response, {});
    }
  }
}

function getDevicesCountsForTimeRange(timeRange, devices, datePropertyName, comparator, dataLabel, entityId) {
  //array for date values
  var dates = new Array();
  dates.push('x');
  //array for amount of devices
  var counts = new Array();
  counts.push(dataLabel);

  for (var time in timeRange) {
    var counter = getDevicesCount(timeRange[time], devices, datePropertyName, comparator, entityId);
    dates.push(timeRange[time]);
    counts.push(counter);
  }

  return {
    x: dates,
    counts: counts
  };
}

/**
 * Returns amount of devices for a particular date,
 * values are compared with the comparator function
 */
function getDevicesCount(time, devices, datePropertyName, comparator, identifier) {

  var result = {};

  for (var device in devices) {

    //if the comparator returns true, the device is relevant and added to the result object
    var compareResult = comparator(devices[device][datePropertyName], time, devices[device]);
    if (compareResult) {
      result[devices[device][identifier]] = devices[device][identifier];
    }
  }
  var amountOfDevices = Object.keys(result).length;
  return amountOfDevices;
}

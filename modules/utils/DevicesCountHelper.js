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

function getDevicesCountsForTimeRange(timeRange, devicesArray, datePropertyName, comparator, dataLabel, entityId) {
  //array for date values
  var dates = new Array();
  dates.push('x');
  //array for amount of devices
  var counts = new Array();
  counts.push(dataLabel);

  for (var time in timeRange) {
    var counter = getDevicesCount(timeRange[time], devicesArray, datePropertyName, comparator, entityId);
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
function getDevicesCount(time, devicesArray, datePropertyName, comparator, identifier) {

  var counter = 0;
  var buffer = new Array();

  for (var device in devicesArray) {
    var compareResult = comparator(devicesArray[device][datePropertyName], time, devicesArray[device]);
    if (compareResult) {
      counter++;
      buffer.push(devicesArray[device][identifier]);
    }
  }

  var result = remove_duplicates_safe(buffer);

  return result.length;
}

/**
 * Removes duplicate elements from Array
 * {Array} arr - Array to clean off duplicates
 */
function remove_duplicates_safe(arr) {
  var obj = {};
  var arr2 = [];
  for (var i = 0; i < arr.length; i++) {
    if (!(arr[i] in obj)) {
      arr2.push(arr[i]);
      obj[arr[i]] = true;
    }
  }
  return arr2;

}

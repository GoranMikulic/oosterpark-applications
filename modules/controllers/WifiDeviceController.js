var WifiDevice = require('../models/WifiDevice');
var Utils = require('../utils/Utils');

module.exports = {
  /**
   * Returns a wifi device by id
   */
  getWifiDeviceById: function(req, res) {
    WifiDevice.getWifiDeviceById(req.params.device_id, function(rows) {
      Utils.returnResult(res, rows);
    });
  },

  /**
   * Returns all Wifi-Devices
   * If a period is set, it returns all devices between the dates
   */
  getWifiDevices: function(req, res) {
    var startDate = req.query.startdate;
    var endDate = req.query.enddate;

    var isValidPeriodQuery = Utils.checkPeriodQuery(startDate, endDate);

    if (!isValidPeriodQuery) {
      WifiDevice.queryAllDevices(function(rows) {
        Utils.returnResult(res, rows)
      });
    } else {
      WifiDevice.queryDeivcesInPeriod(startDate, endDate, function(rows) {
        Utils.returnResult(res, rows);
      });
    }

  },
  /**
   *  Returns the amount of wifi devices for every day in the given period
   */
  getWifiDevicesCountInPeriod: function(req, res) {
    var startDate = req.query.startdate;
    var endDate = req.query.enddate;

    var isValidPeriodQuery = Utils.checkPeriodQuery(startDate, endDate);

    if (isValidPeriodQuery) {
      WifiDevice.queryDeivcesInPeriod(startDate, endDate, function(queryResult) {

        var datesBetween = Utils.getDatesBetween(new Date(startDate), new Date(endDate));
        var result = getDevicesCountsForTimeRange(datesBetween, queryResult, 'first_time_seen', isDayEqual, 'Amount of Wifi-Devices');

        Utils.returnResult(res, result);
      });
    } else {
      Utils.returnResult(res, {});
    }

  },
  /**
   *  Returns the amount of wifi devices for every day in the given period
   */
  getWifiDevicesCountForDay: function(req, res) {
    var day = req.query.day;

    if (typeof day !== 'undefined') {
      var start = day + ' 00:01:00';
      var end = day + ' 23:59:00';

      WifiDevice.queryDeivcesInPeriod(start, end, function(queryResult) {
        var hours = getClockHours(day);
        var result = getDevicesCountsForTimeRange(hours, queryResult, 'first_time_seen', isHourEqual, 'Amount of Wifi-Devices');

        Utils.returnResult(res, result);
      });
    } else {
      Utils.returnResult(res, {});
    }
  },
}

/**
 * Returns the amounts of devices for a period of days
 */
var getDevicesCountsForTimeRange = function(timeRange, devicesArray, datePropertyName, comparator, dataLabel) {
  //array for date values
  var dates = new Array();
  dates.push('x');
  //array for amount of devices
  var counts = new Array();
  counts.push(dataLabel);

  for (var time in timeRange) {
    var counter = getDevicesCount(timeRange[time], devicesArray, datePropertyName, comparator);
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
var getDevicesCount = function(time, devicesArray, datePropertyName, comparator) {
  var counter = 0;

  for (var device in devicesArray) {
    var compareResult = comparator(devicesArray[device][datePropertyName], time);
    if (compareResult) {
      counter++;
    }
  }
  return counter;
}

/**
 * Returns true if the hour matches
 */
var isHourEqual = function(deviceCaptureTime, timeToCompare) {
  if (deviceCaptureTime.getHours() == timeToCompare.getHours()) {
    return true;
  }
  return false;
}

/**
 * Compares true if the day matches
 */
var isDayEqual = function(deviceCaptureTime, timeToCompare) {
  //Set time to 00:00:00 to compare days only
  deviceCaptureTime.setHours(0, 0, 0, 0);
  timeToCompare.setHours(0, 0, 0, 0);

  if (deviceCaptureTime.getTime() == timeToCompare.getTime()) {
    return true;
  }

  return false;
}

/**
 * Returns an array of date objects of
 * the given day with hours set from 0 to 23
 */
var getClockHours = function(day) {
  var hours = new Array();
  for (var i = 0; i < 24; i++) {
    var date = new Date(day);
    date.setHours(i);
    date.setMinutes(0, 0, 0);
    hours.push(date);
  }
  return hours;
}

var WifiDevice = require('../models/WifiDevice');
var MyUtils = require('../utils/Utils');

module.exports = {
  /**
   * Returns a wifi device by id
   */
  getWifiDeviceById: function(req, res) {
    WifiDevice.getWifiDeviceById(req.params.device_id, function(rows) {
      MyUtils.returnResult(res, rows);
    });
  },

  /**
   * Returns all Wifi-Devices
   * If a period is set, it returns all devices between the dates
   */
  getWifiDevices: function(req, res) {
    var startDate = req.query.startdate;
    var endDate = req.query.enddate;

    var isValidPeriodQuery = MyUtils.checkPeriodQuery(startDate, endDate);

    if (!isValidPeriodQuery) {
      WifiDevice.queryAllDevices(function(rows) {
        MyUtils.returnResult(res, rows)
      });
    } else {
      WifiDevice.queryDeivcesInPeriod(startDate, endDate, function(rows) {
        MyUtils.returnResult(res, rows);
      });
    }

  },
  /**
   *  Returns the amount of wifi devices for every day in the given period
   */
  getWifiDevicesCountInPeriod: function(req, res) {
    var startDate = req.query.startdate;
    var endDate = req.query.enddate;

    var isValidPeriodQuery = MyUtils.checkPeriodQuery(startDate, endDate);

    if (isValidPeriodQuery) {
      WifiDevice.queryDeivcesInPeriod(startDate, endDate, function(queryResult) {

        var datesBetween = MyUtils.getDatesBetween(new Date(startDate), new Date(endDate));
        var result = getDevicesCountsForDays(datesBetween, queryResult, 'first_time_seen', getDevicesCountForDay);

        MyUtils.returnResult(res, result);
      });
    } else {
      MyUtils.returnResult(res, {});
    }

  },
  /**
   *  Returns the amount of wifi devices for every day in the given period
   */
  getWifiDevicesCountForDay: function(req, res) {
    var day = req.query.day;

    if (typeof day !== 'undefined') {
      var start = day + ' 00:01:00';
      var end = day + ' 23:00:00';

      WifiDevice.queryDeivcesInPeriod(start, end, function(queryResult) {

        var result = getDevicesCountForHours(day, queryResult, 'first_time_seen');

        MyUtils.returnResult(res, result);
      });
    } else {
      MyUtils.returnResult(res, {});
    }

  },
}

/**
 * Returns the amounts of devices for a period of days
 */
var getDevicesCountsForDays = function(datesBetween, devicesArray, datePropertyName, countCalculatorFunction) {
  //array for date values
  var dates = new Array();
  dates.push('x');
  //array for amount of devices
  var counts = new Array();
  counts.push('Amount of Wifi-Devices');

  for (var date in datesBetween) {

    var day = datesBetween[date];
    var counter = countCalculatorFunction(day, devicesArray, datePropertyName);

    dates.push(datesBetween[date]);
    counts.push(counter);

  }

  return {
    x: dates,
    counts: counts
  };
}

var getDevicesCountForHours = function(day, devicesArray, datePropertyName) {
  var hours = new Array();
  var hoursResult = new Array();
  hoursResult.push('x');

  var counts = new Array();
  counts.push('Amount of Wifi-Devices');

  for (var i = 0; i < 24; i++) {
    hours.push(i);
  }

  for (var hour in hours) {
    var counter = 0;

    for (var device in devicesArray) {
      var timeCaptured = devicesArray[device][datePropertyName].getHours();

      if (timeCaptured == hour) {
        counter++;
      }
    }

    hoursResult.push(day + ' ' + hour + ':00:00');
    counts.push(counter);
  }

  return {
    x: hoursResult,
    counts: counts
  };

}

/**
 * Returns the amount of devices for a day
 */
var getDevicesCountForDay = function(day, devicesArray, datePropertyName) {
  var counter = 0;

  for (var row in devicesArray) {
    var dayCaptured = devicesArray[row][datePropertyName];

    //Set time to 00:00:00 to compare days only
    dayCaptured.setHours(0, 0, 0, 0);
    day.setHours(0, 0, 0, 0);
    if (dayCaptured.getTime() == day.getTime()) {
      counter++;
    }

  }
  return counter;
}

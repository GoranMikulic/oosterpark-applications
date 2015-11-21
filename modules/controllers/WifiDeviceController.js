var WifiDevice = require('../models/WifiDevice');
var MyUtils = require('../utils/Utils');

module.exports = {

  getWifiDeviceById: function(req, res) {
    WifiDevice.getWifiDeviceById(req.params.device_id, function(rows){
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

    if(!isValidPeriodQuery) {
      WifiDevice.queryAllDevices(function(rows){
          MyUtils.returnResult(res, rows)
      });
    } else {
      WifiDevice.queryDeivcesInPeriod(startDate, endDate, function(rows){
          MyUtils.returnResult(res, rows);
      });
    }

  },
  /**
  *  Returns the amount of devices for every day in the given period
  */
  getWifiDevicesCountInPeriod: function(req, res) {
    var startDate = req.query.startdate;
    var endDate = req.query.enddate;

    var isValidPeriodQuery = MyUtils.checkPeriodQuery(startDate, endDate);

    if(isValidPeriodQuery) {
      WifiDevice.queryDeivcesInPeriod(startDate, endDate, function(queryResult){

        var datesBetween = MyUtils.getDatesBetween(new Date(startDate), new Date(endDate));
        var result = getDevicesCountsForDays(datesBetween, queryResult, 'first_time_seen');

        MyUtils.returnResult(res, result);
      });
    } else {
      MyUtils.returnResult(res, {});
    }

  },
}

var getDevicesCountsForDays = function(datesBetween, devicesArray, datePropertyName) {
  //array for date values
  var dates = new Array();
  dates.push('x');
  //array for amount of devices
  var counts = new Array();
  counts.push('Amount of Wifi-Devices');

  for(var date in datesBetween) {

    var day = datesBetween[date];
    var counter = getDevicesCountForDay(day, devicesArray, datePropertyName);

    dates.push(datesBetween[date]);
    counts.push(counter);

  }

  return {
    x: dates,
    counts: counts
  };
}

var getDevicesCountForDay = function(day, devicesArray, datePropertyName) {
  var counter = 0;

  for(var row in devicesArray) {
    var dayCaptured = devicesArray[row][datePropertyName];
    dayCaptured.setHours(0,0,0,0);
    day.setHours(0,0,0,0);
    console.log(dayCaptured);
    if(dayCaptured.getTime() == day.getTime()) {
      counter++;
    }

  }
  return counter;
}

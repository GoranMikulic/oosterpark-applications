var Noise = require('../db/Noise');
var Utils = require('../utils/Utils');
var Comparators = require('../utils/Comparators');
var DevicesCountHelper = require('../utils/DevicesCountHelper');

var ATTR_NAME_TIME = 'timestamp';
var ATTR_NAME_DECIBEL = 'decibel';
var ATTR_NAME_ENTITY_ID = 'id';


module.exports = {
  getDevicesCountInPeriod: function(req, res) {
    //DevicesCountHelper.returnStatsForPeriod(req.query.startdate, req.query.enddate, ATTR_NAME_TIME, Comparators.dayComparator, ATTR_NAME_DECIBEL, res, Noise.queryDeivcesInPeriod, ATTR_NAME_ENTITY_ID);
    var startDate = req.query.startdate;
    var endDate = req.query.enddate;
    var isValidPeriodQuery = Utils.checkPeriodQuery(req.query.startdate, req.query.enddate);

    if (isValidPeriodQuery) {
      Noise.queryDeivcesInPeriod(startDate, endDate, function(queryResult) {

        var datesBetween = Utils.getDatesBetween(new Date(startDate), new Date(endDate));
        var result = getValuesForTimeRange(datesBetween, queryResult, ATTR_NAME_TIME, Comparators.dayComparator, ATTR_NAME_DECIBEL, ATTR_NAME_DECIBEL);

        Utils.returnResult(res, result);
      });
    } else {
      Utils.returnResult(res, {});
    }
  },
  getDevicesCountForDay: function(req, res) {
    //DevicesCountHelper.fetchDevicesForDay(req.query.day, ATTR_NAME_TIME, Comparators.hourComparator, ATTR_NAME_DECIBEL, res, Noise.queryDeivcesInPeriod, ATTR_NAME_ENTITY_ID);
    var day = req.query.day;
    if (typeof day !== 'undefined') {
      var start = day + ' 00:01:00';
      var end = day + ' 23:59:00';

      Noise.queryDeivcesInPeriod(start, end, function(queryResult) {
        var hours = Utils.getClockHours(day);
        var result = getDevicesCountsForTimeRange(hours, queryResult, ATTR_NAME_TIME, Comparators.hourComparator, ATTR_NAME_DECIBEL, ATTR_NAME_DECIBEL);

        Utils.returnResult(res, result);
      });
    } else {
      console.log("NOTHING");
      Utils.returnResult(res, {});
    }
  }
}

function getValuesForTimeRange(timeRange, devices, datePropertyName, comparator, dataLabel, entityId) {
  //array for date values
  var dates = new Array();
  dates.push('x');
  //array for amount of devices
  var counts = new Array();
  counts.push(dataLabel);

  for (var time in timeRange) {
    var counter = getMatchingValue(timeRange[time], devices, datePropertyName, comparator, entityId);
    dates.push(timeRange[time]);
    counts.push(counter);
  }

  return {
    x: dates,
    counts: counts
  };
}

function getMatchingValue(time, devices, datePropertyName, comparator, identifier) {

  var result = new Array();

  for (var device in devices) {

    //if the comparator returns true, the device is relevant and added to the result object
    var compareResult = comparator(devices[device][datePropertyName], time, devices[device]);
    if (compareResult) {
      result.push(devices[device][identifier]);
    }
  }
  var amountOfDevices = result[0];
  return amountOfDevices;
}

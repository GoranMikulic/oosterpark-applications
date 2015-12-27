var BluetoothDevice = require('../db/BluetoothDevice');
var Utils = require('../utils/Utils');

module.exports = {
  getDevices: function(req, res) {
    BluetoothDevice.queryAllDevices(function function_name(rows) {
      Utils.returnResult(res, rows);
    });
  },
  /**
   *  Returns the amount of wifi devices for every day in the given period
   */
  getDevicesCountInPeriod: function(req, res) {
    var startDate = req.query.startdate;
    var endDate = req.query.enddate;

    var isValidPeriodQuery = Utils.checkPeriodQuery(startDate, endDate);

    if (isValidPeriodQuery) {
      BluetoothDevice.queryDeivcesInPeriod(startDate, endDate, function(queryResult) {

        var datesBetween = Utils.getDatesBetween(new Date(startDate), new Date(endDate));
        var result = Utils.getDevicesCountsForTimeRange(datesBetween, queryResult, 'Time', Utils.isDayEqual, 'Amount of Bluetooth-Devices');

        Utils.returnResult(res, result);
      });
    } else {
      Utils.returnResult(res, {});
    }

  },
  /**
   *  Returns the amount of wifi devices for every day in the given period
   */
  getDevicesCountForDay: function(req, res) {
    var day = req.query.day;

    if (typeof day !== 'undefined') {
      var start = day + ' 00:01:00';
      var end = day + ' 23:59:00';

      BluetoothDevice.queryDeivcesInPeriod(start, end, function(queryResult) {
        var hours = Utils.getClockHours(day);
        var result = Utils.getDevicesCountsForTimeRange(hours, queryResult, 'Time', Utils.isHourEqual, 'Amount of Bluetooth-Devices');

        Utils.returnResult(res, result);
      });
    } else {
      Utils.returnResult(res, {});
    }
  }
}

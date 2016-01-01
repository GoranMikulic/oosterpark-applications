var WifiDevice = require('../db/WifiDevice');
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
        var result = Utils.getDevicesCountsForTimeRange(datesBetween, queryResult, 'first_time_seen', Utils.isDayEqual, 'wifidevices');

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
        var hours = Utils.getClockHours(day);
        var result = Utils.getDevicesCountsForTimeRange(hours, queryResult, 'first_time_seen', Utils.isHourEqual, 'wifidevices');

        Utils.returnResult(res, result);
      });
    } else {
      Utils.returnResult(res, {});
    }
  },
  /**
  * Saves an array of wifi devices
  * @param {device} devices
  */
  saveWifiDevices: function(devices) {
    devices.forEach(function(device){
      WifiDevice.insertDevice(device.mac, device.firsttime, device.lasttime, device.signal_dbm);
    });
  }

}

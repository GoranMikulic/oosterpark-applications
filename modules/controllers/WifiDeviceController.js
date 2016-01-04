var WifiDevice = require('../db/WifiDevice');
var Utils = require('../utils/Utils');
var Comparators = require('../utils/Comparators');
var DevicesCountHelper = require('./DevicesCountHelper');

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

    DevicesCountHelper.fetchDevicesForPeriod(startDate, endDate, 'first_time_seen', Comparators.dayComparator, 'wifidevices', res, WifiDevice.queryDeivcesInPeriod, 'address');

  },
  /**
   *  Returns the amount of wifi devices for every day in the given period
   */
  getWifiDevicesCountForDay: function(req, res) {
    var day = req.query.day;
    DevicesCountHelper.fetchDevicesForDay(day, 'first_time_seen', Comparators.hourComparator, 'wifidevices', res, WifiDevice.queryDeivcesInPeriod, 'address');
  },
  /**
   * Saves an array of wifi devices
   * @param {device} devices
   */
  saveWifiDevices: function(devices) {
    devices.forEach(function(device) {
      WifiDevice.insertDevice(device.mac, device.firsttime, device.lasttime, device.signal_dbm);
    });
  }

}

var WifiDevice = require('../db/WifiDevice');
var Utils = require('../utils/Utils');
var Comparators = require('../utils/Comparators');
var DevicesCountHelper = require('../utils/DevicesCountHelper');

var ATTR_NAME_TIME = 'first_time_seen';
var ATTR_NAME_WIFI_DEVICES = 'wifidevices';
var ATTR_NAME_WIFI_ENTITY_ID = 'address';

module.exports = {
  /**
   *  Returns the amount of wifi devices for every day in the given period
   */
  getWifiDevicesCountInPeriod: function(req, res) {
    var startDate = req.query.startdate;
    var endDate = req.query.enddate;

    DevicesCountHelper.returnStatsForPeriod(startDate, endDate, ATTR_NAME_TIME, Comparators.dayComparator, ATTR_NAME_WIFI_DEVICES, res, WifiDevice.queryDeivcesInPeriod, ATTR_NAME_WIFI_ENTITY_ID);
  },
  /**
   *  Returns the amount of wifi devices for every day in the given period
   */
  getWifiDevicesCountForDay: function(req, res) {
    DevicesCountHelper.fetchDevicesForDay(req.query.day, ATTR_NAME_TIME, Comparators.hourComparator, ATTR_NAME_WIFI_DEVICES, res, WifiDevice.queryDeivcesInPeriod, ATTR_NAME_WIFI_ENTITY_ID);
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

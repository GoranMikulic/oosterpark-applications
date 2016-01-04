var BluetoothDevice = require('../db/BluetoothDevice');
var Utils = require('../utils/Utils');
var Comparators = require('../utils/Comparators');
var DevicesCountHelper = require('../utils/DevicesCountHelper');
var ATTR_NAME_TIME = 'Time';
var ATTR_NAME_BTDEVICES = 'btdevices';
var ATTR_NAME_WALKERS = 'walkers';
var ATTR_NAME_RUNNERS = 'runners';
var ATTR_NAME_BT_ENTITY_ID = 'Bluetooth_Id';


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
    DevicesCountHelper.returnStatsForPeriod(req.query.startdate, req.query.enddate, ATTR_NAME_TIME, Comparators.dayComparator, ATTR_NAME_BTDEVICES, res, BluetoothDevice.queryDeivcesInPeriod, ATTR_NAME_BT_ENTITY_ID);
  },
  getWalkersCountInPeriod: function(req, res) {
    DevicesCountHelper.returnStatsForPeriod(req.query.startdate, req.query.enddate, ATTR_NAME_TIME, Comparators.walkerComparator, ATTR_NAME_WALKERS, res, BluetoothDevice.queryDeivcesInPeriod, ATTR_NAME_BT_ENTITY_ID);
  },
  getRunnersCountInPeriod: function(req, res) {
    DevicesCountHelper.returnStatsForPeriod(req.query.startdate, req.query.enddate, ATTR_NAME_TIME, Comparators.runnerComparator, ATTR_NAME_RUNNERS, res, BluetoothDevice.queryDeivcesInPeriod, ATTR_NAME_BT_ENTITY_ID);
  },
  /**
   *  Returns the amount of wifi devices for every day in the given period
   */
  getDevicesCountForDay: function(req, res) {
    DevicesCountHelper.fetchDevicesForDay(req.query.day, ATTR_NAME_TIME, Comparators.hourComparator, ATTR_NAME_BTDEVICES, res, BluetoothDevice.queryDeivcesInPeriod, ATTR_NAME_BT_ENTITY_ID);
  },
  getWalkersCountForDay: function(req, res) {
    DevicesCountHelper.fetchDevicesForDay(req.query.day, ATTR_NAME_TIME, Comparators.walkerComparatorDay, ATTR_NAME_WALKERS, res, BluetoothDevice.queryDeivcesInPeriod, ATTR_NAME_BT_ENTITY_ID);
  },
  getRunnersCountForDay: function(req, res) {
    DevicesCountHelper.fetchDevicesForDay(req.query.day, ATTR_NAME_TIME, Comparators.runnerComparatorDay, ATTR_NAME_RUNNERS, res, BluetoothDevice.queryDeivcesInPeriod, ATTR_NAME_BT_ENTITY_ID);
  }
}

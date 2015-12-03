var express = require('express');
var router = express.Router();
var serverconfig = require('./utils/serverconfig');

var WifiDeviceService = require('./controllers/WifiDeviceController');
var BluetoothDeviceController = require('./controllers/BluetoothDeviceController');

//Route to return all wifi devices
router.route('/wifidevices')
  .get(WifiDeviceService.getWifiDevices);

//Route to return device with the given ID
router.route('/wifidevices/:device_id')
  .get(WifiDeviceService.getWifiDeviceById);

//Route to return count of wifi devices in a period
router.route('/wifidevicescount').get(WifiDeviceService.getWifiDevicesCountInPeriod);

//Route to return count of a particulart day
router.route('/wifidevicescountdetail').get(WifiDeviceService.getWifiDevicesCountForDay);

//Route to return all bluetooth devices
router.route('/btdevices').get(BluetoothDeviceController.getDevices);

//Route to return count of bluetooth devices in a period
router.route('/btdevicescount').get(BluetoothDeviceController.getDevicesCountInPeriod);

//Route to return count of a particular day
router.route('/btdevicescountdetail').get(BluetoothDeviceController.getDevicesCountForDay);

//Returns server data, needed to establish socket connection
router.route('/serverconnection').get(serverconfig.getConfigJsonResponse);

module.exports = router;

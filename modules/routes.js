var express = require('express');
var router = express.Router();

var WifiDeviceService = require('./controllers/WifiDeviceController');
var BluetoothDeviceController = require('./controllers/BluetoothDeviceController');

//Route to return all devices
router.route('/wifidevices')
  .get(WifiDeviceService.getWifiDevices);

//Route to return device with the given ID
router.route('/wifidevices/:device_id')
  .get(WifiDeviceService.getWifiDeviceById);

//Route to return count of wifidevices in a period
router.route('/wifidevicescount').get(WifiDeviceService.getWifiDevicesCountInPeriod);

router.route('/btdevices').get(BluetoothDeviceController.getDevices);

module.exports = router;

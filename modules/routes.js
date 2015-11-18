var express = require('express');
var router = express.Router();
var WifiDevice = require('./models/WifiDevice');

//Route to return all devices
router.route('/wifidevices')
  .get(WifiDevice.getWifiDevices);

//Route to return device with the given ID
router.route('/wifidevices/:device_id')
  .get(WifiDevice.getWifiDeviceById);

//Route to return all captured devices in a period
router.route('/wifidevices/:start_time/:end_time')
  .get(WifiDevice.getWifiDevicesInPeriod);

module.exports = router;

var express = require('express');
var router = express.Router();
var WifiDevice = require('./models/WifiDevice');

//Route to return all devices
router.route('/wifidevices')
  .get(WifiDevice.getWifiDevices);

//Route to return device with the given ID
router.route('/wifidevices/:device_id')
  .get(WifiDevice.getWifiDeviceById);

router.route('/wifidevicescount').get(WifiDevice.getWifiDevicesCountInPeriod);

module.exports = router;

var express = require('express');
var router = express.Router();
var WifiDevice = require('./models/WifiDevice');
var WifiDeviceService = require('./controllers/WifiDeviceController');

//Route to return all devices
router.route('/wifidevices')
  .get(WifiDeviceService.getWifiDevices);

//Route to return device with the given ID
router.route('/wifidevices/:device_id')
  .get(WifiDeviceService.getWifiDeviceById);

router.route('/wifidevicescount').get(WifiDeviceService.getWifiDevicesCountInPeriod);

module.exports = router;

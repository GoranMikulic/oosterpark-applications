var express = require('express');
var serverconfig = require('./utils/serverconfig');
var router = express.Router();

var WifiDeviceService = require('./controllers/WifiDeviceController');
var BluetoothDeviceController = require('./controllers/BluetoothDeviceController');
var WeatherController = require('./controllers/WeatherController');

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

router.route('/walkers').get(BluetoothDeviceController.getWalkersCountInPeriod);

router.route('/walkersdetail').get(BluetoothDeviceController.getWalkersCountForDay);

router.route('/runners').get(BluetoothDeviceController.getRunnersCountInPeriod);

router.route('/runnersdetail').get(BluetoothDeviceController.getRunnersCountForDay);

//Route to return count of a particular day
router.route('/btdevicescountdetail').get(BluetoothDeviceController.getDevicesCountForDay);

//Route to return weather for a period of time
router.route('/weatherperiod').get(WeatherController.getWeatherStatsForPeriod);

//Route to return weather for a day
router.route('/weatherdetail').get(WeatherController.getWeatherForDay);

//Returns server data, needed to establish socket connection
router.route('/serverconnection').get(serverconfig.getConfigJsonResponse);

module.exports = router;

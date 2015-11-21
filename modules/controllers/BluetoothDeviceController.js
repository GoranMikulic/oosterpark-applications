var BluetoothDevice = require('../models/BluetoothDevice');
var Utils = require('../utils/Utils');

module.exports = {
  getDevices: function(req, res) {
    BluetoothDevice.queryAllDevices(function function_name(rows) {
      Utils.returnResult(res, rows);
    });
  }
}
